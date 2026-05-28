import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { authService } from "../services/authService";

// ─── Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Decode the JWT payload to extract the user object.
 * The backend uses RS256 JWTs. We read the base64url payload segment.
 * Expected fields: sub (UUID), email, username.
 * Returns null if decoding fails for any reason.
 */
const decodeUser = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  } catch {
    return null;
  }
};

/**
 * Persist the accessToken to localStorage.
 * The refreshToken is an httpOnly cookie managed entirely by the browser
 * — we never read, write, or delete it from JavaScript.
 */
const storeTokens = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
};

/**
 * Persist the username to localStorage so it survives hard refreshes.
 */
const storeUsername = (username) => {
  if (username) localStorage.setItem("username", username);
};

/**
 * Remove the accessToken from localStorage on logout.
 * The httpOnly cookie will be cleared by the server's Set-Cookie response
 * on the /auth/logout call.
 */
const clearTokens = () => {
  localStorage.removeItem("accessToken");
};

/**
 * Remove the username from localStorage on logout.
 */
const clearUsername = () => {
  localStorage.removeItem("username");
};

// ─── Reducer ──────────────────────────────────────────────────────────────

/**
 * Synchronously read localStorage to build the initial auth state.
 * This runs once before the first render, ensuring ProtectedRoute never
 * sees isAuthenticated:false for a user who has a stored token — even
 * before the background /auth/refresh call completes.
 *
 * isLoading remains true so the background refresh still runs and rotates
 * the token; the spinner shows briefly but there is no redirect flash.
 */
const getInitialState = () => {
  const accessToken = localStorage.getItem("accessToken");
  const storedUsername = localStorage.getItem("username");
  if (accessToken) {
    const decoded = decodeUser(accessToken);
    return {
      isAuthenticated: true,
      user: {
        ...decoded,
        username: storedUsername || decoded?.username || 'Trader',
      },
      isLoading: true, // background refresh still runs to rotate the token
    };
  }
  return { isAuthenticated: false, user: null, isLoading: true };
};

const AUTH_ACTIONS = {
  HYDRATION_COMPLETE: "HYDRATION_COMPLETE",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.HYDRATION_COMPLETE:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    default:
      return state;
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  // Pass getInitialState as the lazy initializer (3rd arg) so it runs
  // synchronously exactly once, before the first render.
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialState);

  // ── App-Load Hydration: silently verify stored tokens on every page refresh
  useEffect(() => {
    const hydrate = async () => {
      const storedAccess = localStorage.getItem("accessToken");

      // Only the accessToken is stored in localStorage.
      // The refreshToken lives in an httpOnly cookie set by the server.
      if (!storedAccess) {
        dispatch({
          type: AUTH_ACTIONS.HYDRATION_COMPLETE,
          payload: { isAuthenticated: false, user: null },
        });
        return;
      }

      try {
        // Proactively refresh: the stored accessToken may be expired.
        // A successful refresh proves the session is still valid.
        // The backend returns: { success, data: { accessToken } }
        const responseData = await authService.refresh();

        // Backend response envelope: responseData = { success, data: { accessToken } }
        const newAccessToken = responseData.data.accessToken;
        storeTokens(newAccessToken);
        const decoded = decodeUser(newAccessToken);
        const storedUsername = localStorage.getItem("username");
        const user = {
          ...decoded,
          username: storedUsername || decoded?.username || 'Trader',
        };

        dispatch({
          type: AUTH_ACTIONS.HYDRATION_COMPLETE,
          payload: { isAuthenticated: true, user },
        });
      } catch (err) {
        // The /auth/refresh call failed — most common causes:
        //   • Backend CORS: sameSite cookie blocked cross-origin (needs sameSite:'None' + secure:true on server)
        //   • Server cold-start / transient network error
        //   • Genuine session expiry (api.js interceptor will handle subsequent 401s)
        //
        // We do NOT evict the user here. The optimistic state seeded from localStorage
        // remains intact. The user stays on the page they refreshed. If their session
        // is truly expired, the next protected API call will 401, the interceptor will
        // retry the refresh, fail, clear the token, and redirect to /login correctly.
        console.warn("[AuthContext] Background refresh failed — preserving optimistic state.", err?.message);
        dispatch({
          type: AUTH_ACTIONS.HYDRATION_COMPLETE,
          // Re-read the current reducer state snapshot captured at hydration start.
          // This is safe: getInitialState() already seeded isAuthenticated/user from
          // localStorage synchronously, so these values are stable and correct.
          payload: { isAuthenticated: state.isAuthenticated, user: state.user },
        });
      }
    };

    hydrate();
  }, []); // Runs once on mount only

  // ── Login Action
  const login = useCallback(async (email, password) => {
    const responseData = await authService.login(email, password);

    const { accessToken, username } = responseData.data;
    storeTokens(accessToken);
    const decodedUser = decodeUser(accessToken);
    const user = { ...decodedUser, username: username || decodedUser?.username || 'Trader' };
    storeUsername(user.username);

    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
  }, []);

  // ── Register Action (register only — no auto-login)
  const register = useCallback(async (email, username, password) => {
    await authService.register(email, username, password);
    // Do NOT auto-login here. The RegisterForm will redirect to /login
    // so the user can log in manually with their new credentials.
  }, []);

  // ── Logout Action
  const logout = useCallback(async () => {
    try {
      // Best-effort: tell the server to invalidate the refresh token in DB.
      // We always clear local state regardless of whether this call succeeds.
      await authService.logout();
    } catch {
      // Server logout failed (e.g. token already expired) — silently continue
    } finally {
      clearTokens();
      clearUsername();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  const contextValue = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// ─── Consumer Hook ─────────────────────────────────────────────────────────
/**
 * useAuth() — Access authentication state and actions from any component.
 *
 * @returns {{
 *   isAuthenticated: boolean,
 *   user: { id: string, email: string, username: string } | null,
 *   isLoading: boolean,
 *   login: (email: string, password: string) => Promise<void>,
 *   register: (email: string, username: string, password: string) => Promise<void>,
 *   logout: () => Promise<void>
 * }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
};

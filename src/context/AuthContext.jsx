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
 * Remove the accessToken from localStorage on logout.
 * The httpOnly cookie will be cleared by the server's Set-Cookie response
 * on the /auth/logout call.
 */
const clearTokens = () => {
  localStorage.removeItem("accessToken");
};

// ─── Reducer ──────────────────────────────────────────────────────────────
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true, // true on first render until hydration completes
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
  const [state, dispatch] = useReducer(authReducer, initialState);

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
        const user = decodeUser(newAccessToken);

        dispatch({
          type: AUTH_ACTIONS.HYDRATION_COMPLETE,
          payload: { isAuthenticated: true, user },
        });
      } catch {
        // Refresh failed — both tokens are invalid/expired, clear everything
        clearTokens();
        dispatch({
          type: AUTH_ACTIONS.HYDRATION_COMPLETE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    hydrate();
  }, []); // Runs once on mount only

  // ── Login Action
  const login = useCallback(async (email, password) => {
    console.log("1. Mulai proses login ke authService...");
    const responseData = await authService.login(email, password);
    
    
    // TAMBAHKAN .data DI SINI 👇
    const token = responseData.data.accessToken; 
    
    storeTokens(token);
    const user = decodeUser(token);

    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
  }, []);

  // ── Register Action
  const register = useCallback(async (email, username, password) => {
    await authService.register(email, username, password);
    const responseData = await authService.login(email, password);

    // TAMBAHKAN .data DI SINI 👇                         
    const token = responseData.data.accessToken; 

    storeTokens(token);
    const user = decodeUser(token);

    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
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

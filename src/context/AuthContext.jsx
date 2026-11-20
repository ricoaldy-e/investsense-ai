import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

const decodePayload = (token) =>
  JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));

const decodeUser = (token) => {
  try {
    const payload = decodePayload(token);
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  } catch {
    return null;
  }
};

// UX gate only (the server still verifies every request): a token with >60s left needs no
// startup refresh. A missing/garbled `exp` yields NaN, which is treated as not fresh.
const isTokenFresh = (token) => {
  try {
    return decodePayload(token).exp * 1000 - Date.now() > 60_000;
  } catch {
    return false;
  }
};

const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

const storeUsername = (username) => {
  if (username) localStorage.setItem("username", username);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
};

const clearUsername = () => {
  localStorage.removeItem("username");
};

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
      // Only an expired token must wait for a refresh round trip before the UI can render.
      isLoading: !isTokenFresh(accessToken),
    };
  }
  return { isAuthenticated: false, user: null, isLoading: false };
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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialState);

  useEffect(() => {
    const hydrate = async () => {
      const storedAccess = localStorage.getItem("accessToken");

      // No token, or a still-fresh one: the initial state is already final and any later
      // 401 is handled by the api.js interceptor. Skip the blocking network round trip.
      if (!storedAccess || isTokenFresh(storedAccess)) return;

      try {
        const responseData = await authService.refresh();
        const newAccessToken = responseData.data.accessToken;
        // Keep a rotated refresh token, same as the api.js interceptor does.
        storeTokens(newAccessToken, responseData.data.refreshToken);
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
        console.warn("[AuthContext] Background refresh failed.", err?.message);
        clearTokens();
        clearUsername();
        dispatch({
          type: AUTH_ACTIONS.HYDRATION_COMPLETE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    hydrate();
  }, []);

  const login = useCallback(async (email, password, rememberMe) => {
    const responseData = await authService.login(email, password, rememberMe);
    const { accessToken, username } = responseData.data;
    storeTokens(accessToken);
    const decodedUser = decodeUser(accessToken);
    const user = { ...decodedUser, username: username || decodedUser?.username || 'Trader' };
    storeUsername(user.username);
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
  }, []);

  const register = useCallback(async (email, username, password) => {
    await authService.register(email, username, password);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
};

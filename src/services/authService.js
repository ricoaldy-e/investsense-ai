import api, { plainAxios } from "./api";

// ─── Token Helpers ────────────────────────────────────────────────────────────
// Centralises localStorage key names to avoid typos across the service.
const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Note: plainAxios is defined in api.js and exported as a named export.
// authService.refresh() uses plainAxios directly to bypass the 401 interceptor.
// All other authService methods use the main intercepted `api` instance.

export const authService = {
  /**
   * Register a new user account.
   * POST /auth/register
   * @returns {{ success: boolean, data: { id, email, username, created_at } }}
   */
  register: async (email, username, password) => {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
    });
    // Some backends return tokens on register (auto-login flow).
    // If present, persist them so the user is immediately authenticated.
    const { accessToken, refreshToken } = response.data?.data ?? {};
    saveTokens(accessToken, refreshToken);
    return response.data;
  },

  /**
   * Login with email and password.
   * POST /auth/login
   * @returns {{ success: boolean, data: { accessToken: string, refreshToken: string } }}
   */
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    // Persist both tokens to localStorage.
    // accessToken  → attached as Bearer header by the request interceptor.
    // refreshToken → sent in body by plainAxios when the interceptor retries on 401.
    const { accessToken, refreshToken } = response.data?.data ?? {};
    saveTokens(accessToken, refreshToken);
    return response.data;
  },

  /**
   * Silently rotate an expired access token.
   * POST /auth/refresh
   * The refreshToken is read from localStorage and sent in the request body.
   * plainAxios is used to bypass the 401 response interceptor (no cookie needed).
   * @returns {{ success: boolean, data: { accessToken: string, refreshToken?: string } }}
   */
  refresh: async () => {
    // IMPORTANT: Use plainAxios (non-intercepted) here, NOT the main `api` instance.
    // If we used `api` and the server returned 401, the response interceptor would
    // fire, attempt another refresh, get 401 again → infinite loop → force logout.
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const response = await plainAxios.post("/auth/refresh", {
      refreshToken: storedRefreshToken,
    });
    return response.data;
  },

  /**
   * Invalidate the current session on the server.
   * POST /auth/logout — Protected (Bearer token sent automatically by interceptor)
   * @returns {{ success: boolean }}
   */
  logout: async () => {
    const response = await api.post("/auth/logout");
    // Clear ALL tokens from localStorage on explicit logout.
    clearTokens();
    return response.data;
  },
};


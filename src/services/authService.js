import api, { plainAxios } from "./api";

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
    return response.data;
  },

  /**
   * Login with email and password.
   * POST /auth/login
   * @returns {{ success: boolean, accessToken: string, refreshToken: string }}
   */
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * Silently rotate an expired access token.
   * POST /auth/refresh
   * The refreshToken is sent automatically by the browser as an httpOnly
   * cookie — no body payload needed. withCredentials: true on plainAxios
   * (defined in api.js) ensures the cookie is included.
   * @returns {{ success: boolean, data: { accessToken: string } }}
   */
  refresh: async () => {
    // IMPORTANT: Use plainAxios (non-intercepted) here, NOT the main `api` instance.
    // If we used `api` and the server returned 401, the response interceptor would
    // fire, attempt another refresh, get 401 again → infinite loop → force logout.
    // plainAxios has withCredentials:true so the httpOnly cookie is sent correctly.
    const response = await plainAxios.post("/auth/refresh", {});
    return response.data;
  },

  /**
   * Invalidate the current session on the server.
   * POST /auth/logout — Protected (Bearer token sent automatically by interceptor)
   * @returns {{ success: boolean }}
   */
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};


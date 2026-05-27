import api from "./api";

// Note: plainAxios is defined in api.js and is not needed here.
// authService.refresh() uses the api instance's plainAxios indirectly
// via authService, but for logout and login we use the main api instance.

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
    console.log(response.data)
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
    // Empty body — the backend reads the refreshToken from req.cookies,
    // not from the request body. The browser attaches the cookie automatically.
    const response = await api.post("/auth/refresh", {});
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


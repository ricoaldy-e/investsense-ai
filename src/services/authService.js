import api, { plainAxios } from "./api";

const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const authService = {
  register: async (email, username, password) => {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
    });
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
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const response = await plainAxios.post("/auth/refresh", {
      refreshToken: storedRefreshToken,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    clearTokens();
    return response.data;
  },
};

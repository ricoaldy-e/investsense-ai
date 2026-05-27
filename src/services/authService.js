import axios from "axios";
import api from "./api";

// ─── Plain axios instance for /auth/refresh ───────────────────────────────
// The intercepted `api` instance must NOT be used for refresh to prevent
// an infinite 401 → refresh → 401 loop.
const plainAxios = axios.create({
  baseURL: "https://investsense-ai-investsense-backend.hf.space/api/v1",
  headers: { "Content-Type": "application/json" },
});

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
   * Silently rotate an expired access token using the stored refresh token.
   * POST /auth/refresh
   * Uses plain axios (not the intercepted instance) to avoid infinite loops.
   * @returns {{ success: boolean, accessToken: string, refreshToken: string }}
   */
  refresh: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token stored");
    }
    const response = await plainAxios.post("/auth/refresh", { refreshToken });
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


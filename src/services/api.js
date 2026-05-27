import axios from "axios";

// ─── Axios Instance ───────────────────────────────────────────────────────────
// Central API client configured with the production backend URL.
// All service modules import this single instance.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://investsense-ai-investsense-backend.hf.space/api/v1",
  timeout: 30000, // 30 seconds default timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attaches the Bearer token from localStorage to every request.
// If no token exists, the request proceeds without auth (graceful bypass).

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handles 401 Unauthorized gracefully:
// - Logs a warning to console (does NOT redirect to login since auth is not
//   integrated yet — per user instruction to "bypass error dulu").
// - All other errors pass through to the calling service for local handling.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "[API] ⚠️ 401 Unauthorized — token mungkin tidak valid atau belum tersedia. " +
        "Fitur autentikasi belum diintegrasikan."
      );
      // Don't redirect to login yet since auth integration is deferred.
      // The calling service will receive the error and can handle it locally.
    }
    return Promise.reject(error);
  }
);

export default api;
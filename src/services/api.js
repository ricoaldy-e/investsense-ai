import axios from "axios";

// ─── Production Base URL ───────────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://investsense-ai-investsense-backend.hf.space/api/v1";

// ─── Primary intercepted instance (used by all app services) ──────────────
// NOTE: withCredentials is intentionally NOT set here.
// The accessToken is managed via localStorage + Authorization header.
// Setting withCredentials:true on every request (including /auth/login)
// would force strict CORS credentials mode unnecessarily, causing browsers
// to reject responses where Access-Control-Allow-Credentials is not echoed.
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds default timeout
  headers: { "Content-Type": "application/json" },
});

// ─── Plain instance for token refresh (avoids infinite interceptor loop) ──
// This must NOT use the `api` instance, otherwise a 401 on /auth/refresh
// would trigger the interceptor again, creating an infinite loop.
// No withCredentials needed — refreshToken is now sent via request body
// from localStorage (not via httpOnly cookie).
const plainAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Queue State ──────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

/**
 * Drains the failed request queue after a refresh attempt.
 * @param {Error|null} error - null on success, Error on failure
 * @param {string|null} token - new accessToken on success, null on failure
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Request Interceptor — Attach Access Token ────────────────────────────
// Automatically attaches the Bearer token from localStorage to every request.
// If no token exists, the request proceeds without auth (graceful bypass).
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Silent Token Refresh on 401 ──────────────────
api.interceptors.response.use(
  (response) => response, // Pass successful responses through unchanged
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 Unauthorized errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url.includes("/auth/login") || 
      originalRequest.url.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop: if this request was already a retry, reject
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If another refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark this request as a retry and begin the refresh flow
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Send refreshToken from localStorage in the request body.
      // The backend validates it and returns a new accessToken (and optionally
      // a new refreshToken for rotation).
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const { data } = await plainAxios.post("/auth/refresh", {
        refreshToken: storedRefreshToken,
      });

      // Backend response envelope: { success, data: { accessToken, refreshToken? } }
      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      // Persist both tokens. If the backend rotates the refreshToken,
      // the new one replaces the old one automatically.
      localStorage.setItem("accessToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      // Update the Authorization header for the retried request
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      // Drain the queue with the new token so parallel requests can retry
      processQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — refreshToken is expired or revoked.
      // Clear ALL tokens from localStorage to force a clean re-login.
      processQueue(refreshError, null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect to login (window.location is used here because we are
      // outside the React component tree and cannot call useNavigate)
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Named export so authService.refresh() can bypass the 401 interceptor.
// The interceptor must NOT be involved in the refresh call itself —
// a 401 on /auth/refresh means the session is genuinely expired, not
// something that should trigger another refresh attempt.
export { plainAxios };
export default api;

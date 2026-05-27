import axios from "axios";

// ─── Production Base URL ───────────────────────────────────────────────────
const BASE_URL = "https://investsense-ai-investsense-backend.hf.space/api/v1";

// ─── Primary intercepted instance (used by all app services) ──────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Plain instance for token refresh (avoids infinite interceptor loop) ──
// This must NOT use the `api` instance, otherwise a 401 on /auth/refresh
// would trigger the interceptor again, creating an infinite loop.
const plainAxios = axios.create({
  baseURL: BASE_URL,
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
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token available — cannot recover, force logout
        throw new Error("No refresh token available");
      }

      // Call /auth/refresh using the plain instance (bypasses this interceptor)
      const { data } = await plainAxios.post("/auth/refresh", { refreshToken });

      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      // Persist the new token pair
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // Update the Authorization header for the retried request
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      // Drain the queue with the new token so parallel requests can retry
      processQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear all tokens and force the user back to login
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

export default api;
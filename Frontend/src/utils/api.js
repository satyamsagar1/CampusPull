import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CHECK 1: Is it a 401?
    // CHECK 2: Have we already retried?
    // CHECK 3 (CRITICAL): Was the failed request ITSELF a refresh attempt? 
    // If yes, STOP. Don't retry. prevents infinite loop.
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      
      try {
        // Try to get a new token
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data.accessToken;

        if (newToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest); // Retry the original failed request
        }
      } catch (refreshErr) {
        // If refresh fails, DO NOT RELOAD PAGE (window.location.href).
        // Just reject the promise. AuthContext will catch this and set user=null.
        console.error("Session expired:", refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
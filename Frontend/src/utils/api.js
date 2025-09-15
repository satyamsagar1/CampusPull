import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true, // required to send HTTP-only cookies
});

// Optional: interceptor to refresh access token automatically
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // call /refresh to get new access token
      const res = await api.get("/auth/refresh", {
        withCredentials: true
      });
      if (newToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return api(originalRequest);
    }
    return Promise.reject(new Error(error.message || error));
  }
);

export default api;

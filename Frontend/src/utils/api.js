import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
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
      const res = await axios.get("/auth/refresh", {
        withCredentials: true
      });
      // store in memory if needed
      // retry original request
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;

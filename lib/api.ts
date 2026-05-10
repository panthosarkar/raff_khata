import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await api.post("/auth/refresh");
        // caller should retry original request with new token
        return api(original);
      } catch (e) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

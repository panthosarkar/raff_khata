import axios from "axios";
import { getCookie, COOKIE_NAMES, clearAuthCookies } from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8001/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getCookie(COOKIE_NAMES.ACCESS_TOKEN);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(original);
      } catch (e) {
        if (typeof window !== "undefined") {
          clearAuthCookies();
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

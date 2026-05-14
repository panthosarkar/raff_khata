import axios from "axios";
import {
  getCookie,
  COOKIE_NAMES,
  clearAuthCookies,
  setCookie,
} from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8001/api",
  withCredentials: true,
});

let refreshTokenPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");
  const accessToken = response.data?.access_token;

  if (typeof window !== "undefined" && accessToken) {
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, 7);
  }

  return accessToken ?? null;
};

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

    if (
      error.response &&
      error.response.status === 401 &&
      !original?._retry &&
      !String(original?.url || "").includes("/auth/refresh")
    ) {
      original._retry = true;

      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken().finally(() => {
            refreshTokenPromise = null;
          });
        }

        const nextAccessToken = await refreshTokenPromise;
        if (nextAccessToken) {
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${nextAccessToken}`;
        }

        return api(original);
      } catch {
        if (typeof window !== "undefined") {
          clearAuthCookies();
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

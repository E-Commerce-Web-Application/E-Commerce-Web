import { useAuthStore } from "@/stores/auth.store";
import type { RetryableRequest } from "@/types";
import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL:
    (import.meta.env.VITE_SHOP_SERVICE_URL as string) ||
    (import.meta.env.VITE_SERVER as string),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = res.data;

        useAuthStore.getState().setAccessToken(accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed");
        useAuthStore.getState().clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

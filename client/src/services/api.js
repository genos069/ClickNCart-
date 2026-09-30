import axios from "axios";
import { getSession, clearSession } from "./session";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});
API.interceptors.request.use((config) => {
  const user = getSession();
  if (user) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});
API.interceptors.response.use(
  (response) => {
    if (
      response.config.url?.startsWith("/cart") &&
      Array.isArray(response.data.items)
    ) {
      const count = response.data.items.reduce(
        (n, item) => n + item.quantity,
        0,
      );
      localStorage.setItem("cartCount", String(count));
      window.dispatchEvent(new CustomEvent("cart-change", { detail: count }));
    }
    if (
      response.config.url === "/orders" &&
      response.config.method === "post"
    ) {
      localStorage.setItem("cartCount", "0");
      window.dispatchEvent(new CustomEvent("cart-change", { detail: 0 }));
    }
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.startsWith("/auth/")
    ) {
      clearSession();
      window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);
export default API;

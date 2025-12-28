import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor tự động thêm Token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

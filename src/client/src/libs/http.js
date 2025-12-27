import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

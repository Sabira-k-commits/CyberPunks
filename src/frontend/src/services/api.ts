import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Only attach authToken for protected routes (skip login-step1 and login-step2)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && !config.url?.includes("login-step1") && !config.url?.includes("login-step2")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

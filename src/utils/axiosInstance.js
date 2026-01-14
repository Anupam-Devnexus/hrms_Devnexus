import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

//  DO NOT overwrite headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrmsAuthToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

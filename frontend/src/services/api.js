import axios from "axios";
import { clearAdminToken, getAdminToken } from "../utils/adminAuth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8002/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      clearAdminToken();
    }
    return Promise.reject(error);
  }
);

export default api;

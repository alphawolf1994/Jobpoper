import axios from "axios";
import { API_BASE_URL } from "./baseURL";

// Default API instance for JobPoper backend
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth state
      // You might want to dispatch a logout action here
      console.log("Token expired or invalid");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
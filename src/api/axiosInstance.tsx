import axios from "axios";
import { API_BASE_URL } from "./baseURL";

// Default API instance for JobPoper backend
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
  withCredentials: true,
});

const getResolvedRequestURL = (config: any) => {
  const baseURL = config?.baseURL || "";
  const requestURL = config?.url || "";

  try {
    const fullURL = new URL(requestURL, baseURL);

    if (config?.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fullURL.searchParams.append(key, String(value));
        }
      });
    }

    return fullURL.toString();
  } catch {
    return `${baseURL}${requestURL}`;
  }
};

const AUTH_DEBUG_PATHS = ["/auth/check-phone", "/auth/verify-phone"];
const shouldLogAuthRequest = (url: string) =>
  AUTH_DEBUG_PATHS.some((path) => url.includes(path));

// Request interceptor to log the fully resolved API URL.
axiosInstance.interceptors.request.use(
  (config) => {
    const fullURL = getResolvedRequestURL(config);
    console.log("API Request URL:", fullURL);

    if (shouldLogAuthRequest(fullURL)) {
      console.log("Auth Request Payload:", config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
  (response) => {
    const fullURL = getResolvedRequestURL(response.config);

    if (shouldLogAuthRequest(fullURL)) {
      console.log("Auth Success URL:", fullURL);
      console.log("Auth Success Status:", response.status);
      console.log("Auth Success Response:", response.data);
    }

    return response;
  },
  (error) => {
    const fullURL = getResolvedRequestURL(error.config);

    if (shouldLogAuthRequest(fullURL)) {
      console.log("Auth Failed URL:", fullURL);
      console.log("Auth Failed Status:", error.response?.status);
      console.log("Auth Failed Response:", error.response?.data);
      console.log("Auth Failed Message:", error.message);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth state
      // You might want to dispatch a logout action here
      console.log("Token expired or invalid");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };

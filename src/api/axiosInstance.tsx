import axios from "axios";
import { API_BASE_URL } from "./baseURL";

// Default API instance for JobPoper backend
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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

const isVerifyPhoneRequest = (url: string) => url.includes("/auth/verify-phone");

// Request interceptor to log the fully resolved API URL.
axiosInstance.interceptors.request.use(
  (config) => {
    const fullURL = getResolvedRequestURL(config);
    console.log("API Request URL:", fullURL);

    if (isVerifyPhoneRequest(fullURL)) {
      console.log("Verify Phone Request Payload:", config.data);
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

    if (isVerifyPhoneRequest(fullURL)) {
      console.log("Verify Phone Success URL:", fullURL);
      console.log("Verify Phone Success Status:", response.status);
      console.log("Verify Phone Success Response:", response.data);
    }

    return response;
  },
  (error) => {
    const fullURL = getResolvedRequestURL(error.config);

    if (isVerifyPhoneRequest(fullURL)) {
      console.log("Verify Phone Failed URL:", fullURL);
      console.log("Verify Phone Failed Status:", error.response?.status);
      console.log("Verify Phone Failed Response:", error.response?.data);
      console.log("Verify Phone Failed Message:", error.message);
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

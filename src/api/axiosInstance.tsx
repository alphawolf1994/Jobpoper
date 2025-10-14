import axios from "axios";
import { API_BASE_URL, ERP_API_URL } from "./baseURL";
import { store } from "../redux/store";

// Default API instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ERP API instance for authentication (signup, login, logout, refresh)
const erpAuthInstance = axios.create({
  baseURL: ERP_API_URL,
  headers: { 
    "Content-Type": "application/json",
    "accept": "application/json",
    "origin": "http://13.201.161.9:8093",
    "requestfrom": "SHLYAPP"
  },
  withCredentials: true,
});

// ERP API instance for other operations (with static token)
const erpAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach access token dynamically from Redux for both
const attachToken = (config:any) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
// Attach static token for ERP operations
const attachTokenSecond = (config:any) => {
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNzU1NzY3ODk3MDEzLCJzdWIiOiJURVNUVVNFUjAwMSIsInJvbGUiOiJNQU5BR0VSIEZJTkFOQ0UiLCJjb3N0Q2VudGVyIjoiMTAxIiwiaXNzIjoiVEVTVFVTRVIwMDEiLCJlbXBObyI6IjAyMDAiLCJ1c2VyTmFtZSI6IlRFU1QgVVNFUiAwMDEiLCJUb2tlblR5cGUiOiJhdXRoIiwiYXBwbGljYXRpb24iOiJSRVBPUlRTIiwicm9sZU5hbWUiOiJNQUFOR0VSIEZJTkFOQ0UiLCJleHAiOjE3NzM3Njc4OTcsImlhdCI6MTc1NTc2Nzg5NywianRpIjoiVEVTVFVTRVIwMDEifQ.mjCNq4Q-ZsxMjAFcLtiJVlSjYIMWlnUsk-nfhslt1BI';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Attach dynamic token for ERP auth operations
const attachErpAuthToken = (config:any) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.token = token;
  }
  
  // Add loginOn and userId for logout and refresh operations
  const loginOn = store.getState().auth.loginOn;
  const userId = store.getState().auth.userId;
  
  if (loginOn) {
    config.headers.loginOn = loginOn;
  }
  if (userId) {
    config.headers.userId = userId;
  }
  
  return config;
};

axiosInstance.interceptors.request.use(attachToken, (error) => Promise.reject(error));
erpAxiosInstance.interceptors.request.use(attachTokenSecond, (error) => Promise.reject(error));
erpAuthInstance.interceptors.request.use(attachErpAuthToken, (error) => Promise.reject(error));

axiosInstance.interceptors.request.use((config) => {
  const fullUrl = config.baseURL
    ? config.baseURL.replace(/\/+$/, "") + "/" + (config.url || "").replace(/^\/+/, "")
    : config.url;
  return config;
});

erpAxiosInstance.interceptors.request.use((config) => {
  const fullUrl = config.baseURL
    ? config.baseURL.replace(/\/+$/, "") + "/" + (config.url || "").replace(/^\/+/, "")
    : config.url;
  return config;
});

erpAuthInstance.interceptors.request.use((config) => {
  const fullUrl = config.baseURL
    ? config.baseURL.replace(/\/+$/, "") + "/" + (config.url || "").replace(/^\/+/, "")
    : config.url;
  return config;
});

export { axiosInstance, erpAxiosInstance, erpAuthInstance };
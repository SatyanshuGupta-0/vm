// utils/api.js
import axios from "axios";

// Base Axios instance for public/private requests with accessToken
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://vm-ax8k.onrender.com",
  withCredentials: true, // 🟢 Ensures cookies (like refreshToken) are included
});

// Request Interceptor: Attach access token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor: Refresh access token on 401
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/refresh-token`,
          null,
          { withCredentials: true }
        );

        const newToken = refreshRes.data?.accessToken;
        if (newToken) {
          localStorage.setItem("adminToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest); // Retry original request
        }
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("name");
        window.location.href = "/admin-login";
      }
    }

    return Promise.reject(error);
  }
);

// Helper for Authorization headers
const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ========== API Methods ==========
export const postData = async (url, data, isPrivate = false) => {
  const headers = isPrivate ? getAuthHeader() : {};
  const res = await axiosInstance.post(url, data, { headers });
  return res.data;
};

export const fetchDataFromApi = async (url, isPrivate = false) => {
  const headers = isPrivate ? getAuthHeader() : {};
  const res = await axiosInstance.get(url, { headers });
  return res.data;
};

export const putData = async (url, data, isPrivate = false) => {
  const headers =
    data instanceof FormData
      ? getAuthHeader()
      : { ...getAuthHeader(), "Content-Type": "application/json" };
  const res = await axiosInstance.put(url, data, { headers });
  return res.data;
};

export const deleteData = async (url, isPrivate = false) => {
  const res = await axiosInstance.delete(url, {
    headers: isPrivate ? getAuthHeader() : {},
  });
  return res.data;
};

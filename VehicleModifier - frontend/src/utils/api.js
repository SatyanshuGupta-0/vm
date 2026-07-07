import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://vm-ax8k.onrender.com";
// const apiUrl = "http://192.168.31.244:3000";


// Create Axios instance
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Required to send refreshToken cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accesstoken");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// ✅ Request Interceptor – attach access token


// ✅ Response Interceptor – refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // No need to get refresh token manually from cookies
        // Just send request with credentials
        const refreshRes = await api.post(`${apiUrl}/api/auth/refresh-token`, {
          withCredentials: true, // ✅ Must include cookies
        });

        const newAccessToken = refreshRes.data.accessToken;

        // Save new access token
        localStorage.setItem("accesstoken", newAccessToken);

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
        console.error("🔁 Token refresh failed:", err);

        localStorage.removeItem("accesstoken");

        // Optional redirect to login
        // window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const fetchDataFromApi = async (url) => {
  try {
    const res = await api.get(url);
    return res.data;

  } catch (err) {
    if (import.meta.env.MODE !== "production") {
      // console.error(`[API ERROR] GET ${url}:`, err);
    }
    throw err; // 🔥 Still throw so the component can handle it
  }
};


export const postData = async (url, data, config = {}) => {
  try {
    const res = await api.post(url, data, config);
    return res.data;

  } catch (err) {
    if (import.meta.env.MODE !== "production") {
      // console.error(`[API ERROR] GET ${url}:`, err);?
    }
    throw err; // 🔥 Still throw so the component can handle it
  }
};

export const putData = async (url, data) => {
  try {
    const res = await api.put(url, data);
    return res.data;

  } catch (err) {
    if (import.meta.env.MODE !== "production") {
      // console.error(`[API ERROR] GET ${url}:`, err);
    }
    throw err; // 🔥 Still throw so the component can handle it
  }
};

export const deleteData = async (url) => {
  try {
    const res = await api.delete(url);
    return res.data;

  } catch (err) {
    if (import.meta.env.MODE !== "production") {
      // console.error(`[API ERROR] GET ${url}:`, err);
    }
    throw err; // 🔥 Still throw so the component can handle it
  }
};

// ✅ Optional time formatter
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = Math.floor((now - date) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(diff / secondsInUnit);
    if (count >= 1) return rtf.format(-count, unit);
  }

  return "just now";
};

export default api;

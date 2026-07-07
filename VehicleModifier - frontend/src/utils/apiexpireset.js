// import axios from "axios";

// const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.31.244:3000";

// const api = axios.create({
//   baseURL: apiUrl,
//   withCredentials: true, // important if you use cookies
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accesstoken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or unauthorized — clear token and redirect
//       localStorage.removeItem("accesstoken");
//       // If you want to clear cookies on frontend too, you can call a logout API here
//       window.location.href = "/login";
//     }
//     return Promise.reject(error.response?.data || error);
//   }
// );

// export default api;

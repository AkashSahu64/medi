import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://medi-gxxy.onrender.com/api';

  console.log('🔧 API Base URL:', BASE_URL); 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/* ================= REQUEST ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE ================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // ❌ Auth APIs par redirect mat karo
    const isAuthApi =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/me');

    if (status === 401 && !isAuthApi) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;

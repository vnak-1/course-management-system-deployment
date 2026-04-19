import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes('/user');
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';
    const isRegisterPage = typeof window !== 'undefined' && window.location.pathname === '/register';

    if (error.response?.status === 401 && !isAuthCheck && !isLoginPage && !isRegisterPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

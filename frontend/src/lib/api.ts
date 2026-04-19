import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes('/user');
    const isLoginPage = window.location.pathname === '/login';
    const isRegisterPage = window.location.pathname === '/register';

    if (error.response?.status === 401 && !isAuthCheck && !isLoginPage && !isRegisterPage) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

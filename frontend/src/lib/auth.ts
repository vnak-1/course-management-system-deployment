import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export async function loginUser(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  const { user, token } = res.data.data;
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
  }
  return user;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await api.post('/auth/register', { name, email, password });
  const { user, token } = res.data.data;
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
  }
  return user;
}

export async function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get('/user');
  return res.data.data ?? res.data;
}

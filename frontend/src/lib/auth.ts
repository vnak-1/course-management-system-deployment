import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export async function loginUser(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data.user ?? res.data;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data.data?.user ?? res.data;
}

export async function logoutUser() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get('/user');
  return res.data.data ?? res.data;
}

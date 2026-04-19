import api from './api';

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  discount: number;
  discountQuantity: number;
  lessons: Lesson[];
  createdAt: string;
}

export async function getCourses(): Promise<Course[]> {
  const res = await api.get('/courses');
  return res.data.data ?? res.data ?? [];
}

export async function getCourse(id: string): Promise<Course> {
  const res = await api.get(`/courses/${id}`);
  return res.data.data ?? res.data;
}

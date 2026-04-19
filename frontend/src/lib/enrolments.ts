import api from './api';
import { Course } from './courses';

export interface Enrolment {
  id: string;
  courseId: string;
  status: 'pending' | 'success' | 'cancelled';
  progress: number;
  enrolledAt: string;
  course: Course;
}

export async function getMyCourses(): Promise<Enrolment[]> {
  const res = await api.get('/enrolments/my-courses');
  return res.data.data ?? [];
}

import api from "./api";

export type Stats = {
  totalIncome: string;
  totalEnrolments: number;
};

export type CourseSummary = {
  id: string;
  title: string;
  thumbnail: string;
  totalIncome: number;
  totalEnrolments: number;
};

export type Enrolment = {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  priceAtSale: number;
  status: "pending" | "success" | "cancelled";
  enrolledAt: string;
};

export async function getStats(): Promise<Stats> {
  const res = await api.get("/analytics/stats");
  return res.data.data;
}

export async function getSalesSummary(): Promise<CourseSummary[]> {
  const res = await api.get("/sales/summary");
  return res.data.data;
}

export async function getAllEnrolments(): Promise<Enrolment[]> {
  const res = await api.get("/enrolments/all");
  return res.data.data;
}

"use client";

import { useEffect, useState } from "react";
import { getStats, getSalesSummary, getAllEnrolments } from "@/lib/analytics";
import type { Stats, CourseSummary, Enrolment } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, BookOpen } from "lucide-react";

const statusVariant: Record<Enrolment["status"], "default" | "secondary" | "destructive"> = {
  success: "default",
  pending: "secondary",
  cancelled: "destructive",
};

export default function EnrolmentsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [summary, setSummary] = useState<CourseSummary[]>([]);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, sm, en] = await Promise.all([
          getStats(),
          getSalesSummary(),
          getAllEnrolments(),
        ]);
        console.log("stats:", s);
        console.log("summary:", sm);
        console.log("enrolments:", en);
        setStats(s);
        setSummary(sm);
        setEnrolments(en);
      } catch (err: any) {
        console.error("Failed to load enrolments data", err);
        if (err?.response) console.error("Response:", err.response.status, err.response.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Enrolments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard icon={<DollarSign className="w-5 h-5 text-muted-foreground" />} label="Total Revenue" value={`$${Number(stats?.totalIncome ?? 0).toFixed(2)}`} />
            <StatCard icon={<Users className="w-5 h-5 text-muted-foreground" />} label="Total Enrolments" value={String(stats?.totalEnrolments ?? 0)} />
            <StatCard icon={<BookOpen className="w-5 h-5 text-muted-foreground" />} label="Total Courses" value={String(summary.length)} />
          </>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Revenue by Course</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-40 w-full" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-right">{c.totalEnrolments}</TableCell>
                    <TableCell className="text-right">${Number(c.totalIncome ?? 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Enrolments</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-60 w-full" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolments.map((e, i) => (
                  <TableRow key={e.id ?? i}>
                    <TableCell>
                      <div className="font-medium">{e.studentName}</div>
                      <div className="text-sm text-muted-foreground">{e.studentEmail}</div>
                    </TableCell>
                    <TableCell>{e.courseTitle}</TableCell>
                    <TableCell>${Number(e.priceAtSale ?? 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[e.status]}>{e.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(e.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6 flex items-center gap-4">
        <div className="p-2 rounded-md bg-muted">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

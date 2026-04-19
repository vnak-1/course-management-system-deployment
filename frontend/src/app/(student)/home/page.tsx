'use client';

import { useEffect, useState } from 'react';
import { getCourses, Course } from '@/lib/courses';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseCardSkeleton } from '@/components/courses/CourseCardSkeleton';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { BookOpen, PlayCircle, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const [featured, setFeatured] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setFeatured(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Learn Without Limits
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Browse our courses, purchase securely with KHQR Bakong, and start learning at your own pace.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                Browse Courses
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold text-lg">Quality Courses</h3>
            <p className="text-muted-foreground text-sm">
              Expertly crafted courses covering a wide range of topics and skill levels.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="font-semibold text-lg">Learn at Your Pace</h3>
            <p className="text-muted-foreground text-sm">
              Watch lessons anytime, track your progress, and pick up where you left off.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-semibold text-lg">Secure Payments</h3>
            <p className="text-muted-foreground text-sm">
              Pay safely with KHQR Bakong — Cambodia's trusted payment platform.
            </p>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground mt-1">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses">
              <Button variant="outline">View All →</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
              : featured.map((course) => <CourseCard key={course.id} course={course} />)
            }
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-blue-700 text-white mt-auto">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="text-blue-100">Join students already learning on our platform.</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold mt-2">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        © 2026 CoursePlatform. Built with Next.js + KHQR Bakong.
      </footer>
    </div>
  );
}

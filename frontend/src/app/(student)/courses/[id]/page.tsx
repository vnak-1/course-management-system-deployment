'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCourse, Course } from '@/lib/courses';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Image from 'next/image';
import { PlayCircle, BookOpen, Clock, Lock, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

function isValidUrl(url: string) {
  return url?.startsWith('http://') || url?.startsWith('https://') || url?.startsWith('/');
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolmentId, setEnrolmentId] = useState<string | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourse(id);
        setCourse(courseData);

        // Check if student is enrolled
        if (user?.role === 'student') {
          try {
            const enrolRes = await api.get('/enrolments/my-courses');
            const enrolments = enrolRes.data.data ?? enrolRes.data ?? [];
            const found = enrolments.find((e: any) => e.courseId === id && e.status === 'success');
            if (found) {
              setIsEnrolled(true);
              setEnrolmentId(found.id);
            }
          } catch {}
        }

        // Fetch related courses
        try {
          const allRes = await api.get('/courses');
          const all = allRes.data.data ?? allRes.data ?? [];
          setRelatedCourses(all.filter((c: Course) => c.id !== id).slice(0, 3));
        } catch {}

      } catch {
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleEnrol = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/checkout/${id}`);
  };

  const discountedPrice = course?.discount
    ? course.price - (course.price * Number(course.discount)) / 100
    : null;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="w-full h-64 rounded-lg" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-20 text-muted-foreground">Course not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — course info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
            {isValidUrl(course.thumbnail) ? (
              <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
            {isEnrolled && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-green-500 text-white gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Enrolled
                </Badge>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-3xl font-bold">{course.title}</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons?.length ?? 0} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Lifetime access</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-3">{course.description}</p>
          </div>

          <Separator />

          {/* Lessons list */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-xl font-semibold">
                Course Content ({course.lessons?.length ?? 0} lessons)
              </h2>
            </div>

            {course.lessons?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No lessons yet.</p>
            ) : (
              <div className="space-y-2">
                {course.lessons?.map((lesson, index) => (
                  <div key={lesson.id}>
                    {isEnrolled ? (
                      <Link href={`/learn/${id}/${lesson.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer">
                          <PlayCircle className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-sm font-medium">{index + 1}. {lesson.title}</span>
                          <Badge variant="outline" className="ml-auto text-xs text-blue-500 border-blue-200">Watch</Badge>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                        {index === 0
                          ? <PlayCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                          : <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                        }
                        <span className="text-sm font-medium">{index + 1}. {lesson.title}</span>
                        {index === 0 && (
                          <Badge variant="outline" className="ml-auto text-xs">Preview</Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — enrol card */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-8">
            {isEnrolled ? (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">You're enrolled!</span>
                </div>
                <Link href={`/learn/${id}/${course.lessons?.[0]?.id}`}>
                  <Button className="w-full" size="lg">
                    <PlayCircle className="w-4 h-4 mr-2" /> Continue Learning
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  {discountedPrice ? (
                    <>
                      <div className="text-3xl font-bold">${discountedPrice.toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground line-through">${course.price}</span>
                        <Badge variant="destructive">-{course.discount}%</Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold">
                      {Number(course.price) === 0 ? 'Free' : `$${course.price}`}
                    </div>
                  )}
                </div>

                {course.discountQuantity > 0 && (
                  <p className="text-sm text-orange-500">
                    Only {course.discountQuantity} spots left at this price!
                  </p>
                )}

                <Button className="w-full" size="lg" onClick={handleEnrol}>
                  {Number(course.price) === 0 ? 'Enrol for Free' : 'Enrol Now'}
                </Button>
              </>
            )}

            <Separator />

            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons?.length ?? 0} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Full lifetime access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <div>
          <Separator className="mb-8" />
          <h2 className="text-2xl font-bold mb-6">More Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedCourses.map((related) => (
              <Link key={related.id} href={`/courses/${related.id}`}>
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative w-full h-36 bg-muted">
                    {isValidUrl(related.thumbnail) ? (
                      <Image src={related.thumbnail} alt={related.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm line-clamp-2">{related.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Number(related.price) === 0 ? 'Free' : `$${related.price}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

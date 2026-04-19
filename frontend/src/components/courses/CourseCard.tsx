import { Course } from '@/lib/courses';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

function isValidUrl(url: string) {
  return url?.startsWith('http://') || url?.startsWith('https://') || url?.startsWith('/');
}

export function CourseCard({ course }: { course: Course }) {
  const discountedPrice = course.discount
    ? course.price - (course.price * course.discount) / 100
    : null;

  const thumbnail = isValidUrl(course.thumbnail) ? course.thumbnail : null;

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {course.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              -{course.discount}%
            </Badge>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {course.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          {discountedPrice ? (
            <>
              <span className="font-bold text-lg">${discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${course.price}</span>
            </>
          ) : (
            <span className="font-bold text-lg">${course.price}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

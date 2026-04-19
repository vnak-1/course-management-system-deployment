import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/home', '/login', '/register', '/courses'];
const adminRoutes = ['/admin'];
const protectedRoutes = ['/checkout', '/learn', '/my-courses'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Always allow public routes
  if (publicRoutes.some((r) => pathname === r || pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated on protected routes
  if (!token && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Block non-admins from admin routes
  if (adminRoutes.some((r) => pathname.startsWith(r)) && role !== 'admin') {
    return NextResponse.redirect(new URL('/courses', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // Protect admin routes — only block if we know role is not admin
  // If role cookie missing, let the page load and let useAuth handle redirect
  if (pathname.startsWith('/admin') && role && role !== 'admin') {
    return NextResponse.redirect(new URL('/courses', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

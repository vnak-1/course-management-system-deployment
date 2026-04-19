'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="w-5 h-5" />
          CoursePlatform
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">
            Courses
          </Link>
          {user ? (
            <>
              <Link href="/my-courses" className="text-sm text-muted-foreground hover:text-foreground">
                My Courses
              </Link>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link href="/register"><Button size="sm">Register</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

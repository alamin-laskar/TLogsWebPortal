'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import LoginForm from '@/components/loginForm';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </main>
    );
  }

  if (user) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left side: Branding / Copy */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Welcome to <span className="text-blue-600">TLogs</span> Admin Panel
          </h1>
          <p className="text-lg text-gray-600">
            Log in to access Admin Panel</p>
        </div>

        {/* Right side: The Login Form */}
        <div className="flex justify-center md:justify-end">
          <LoginForm />
        </div>

      </div>
    </main>
  );
}
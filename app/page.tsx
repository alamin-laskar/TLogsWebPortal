'use client';

import { useAuth } from '@/components/context/AuthContext';
import LoginForm from '@/components/loginForm';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Checking authentication...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Welcome to <span className="text-blue-600">TLogs</span> Admin Panel
          </h1>
          <p className="text-lg text-gray-600">Log in to access the admin dashboard.</p>
        </div>

        <div className="flex justify-center md:justify-end">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // 1. Delete your custom auth cookie
    // Change 'auth-token' to whatever name you used when setting the cookie during login
    cookieStore.delete('auth-token');

    // Note: If you are using Supabase SSR cookies, you would delete their specific cookie name, e.g.:
    // cookieStore.delete('sb-[YOUR_PROJECT_REF]-auth-token');

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to log out properly' },
      { status: 500 }
    );
  }
}
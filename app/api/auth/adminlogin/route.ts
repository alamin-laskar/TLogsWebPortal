import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validate that both fields were provided
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Fetch the credentials from the environment variables
    const adminEmail = process.env.TLOGS_ADMIN_EMAIL;
    const adminPassword = process.env.TLOGS_ADMIN_PASSWORD;

    // 3. Verify the environment variables are actually set to prevent accidental lockouts/bypasses
    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials are not set in the environment variables.');
      return NextResponse.json(
        { error: 'Internal server configuration error' },
        { status: 500 }
      );
    }

    // 4. Compare the provided credentials
    if (email === adminEmail && password === adminPassword) {
      
      // SUCCESS: Here you would typically generate a JWT or set an HTTP-Only cookie.
      // For this example, we return a success response and a mock token.
      
      return NextResponse.json(
        { 
          message: 'Login successful', 
          // In a real app, replace this with an actual signed JWT
          token: 'mock-admin-jwt-token-12345' 
        },
        { status: 200 }
      );
    }

    // 5. Credentials did not match
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Malformed request' },
      { status: 400 }
    );
  }
}
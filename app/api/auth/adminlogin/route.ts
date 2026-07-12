import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, signJwt, verifyPassword } from '@/lib/auth';
import { AdminModel } from '@/models/admin';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'admin@tlogs.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    let admin = await AdminModel.findOne({ email }).lean();

    if (!admin && email === adminEmail) {
      const passwordHash = await hashPassword(adminPassword);
      admin = await AdminModel.create({
        email: adminEmail,
        name: 'Admin',
        role: 'superAdmin',
        passwordHash,
      });
    }

    if (!admin) {
      return NextResponse.json({ error: 'User does not exist.' }, { status: 404 });
    }

    if (!admin.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, admin.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signJwt({ sub: admin._id.toString(), email: admin.email, role: admin.role });

    const cookieStore = await cookies();
    cookieStore.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
  }
}
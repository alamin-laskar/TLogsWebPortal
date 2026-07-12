import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyJwt } from '@/lib/auth';
import { AdminModel } from '@/models/admin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-session')?.value;

    if (!token) {
      return NextResponse.json({ profile: null, user: null }, { status: 401 });
    }

    const payload = verifyJwt(token);
    await connectToDatabase();
    const admin = await AdminModel.findById(payload.sub).lean();

    if (!admin) {
      cookieStore.delete('admin-session');
      return NextResponse.json({ profile: null, user: null }, { status: 401 });
    }

    return NextResponse.json({
      profile: {
        id: admin._id.toString(),
        name: admin.name ?? null,
        role: admin.role ?? null,
        email: admin.email ?? null,
      },
      user: {
        id: admin._id.toString(),
        name: admin.name ?? null,
        role: admin.role ?? null,
        email: admin.email ?? null,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ profile: null, user: null }, { status: 500 });
  }
}

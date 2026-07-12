import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { AdminModel } from '@/models/admin';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: 'An admin with that email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const admin = await AdminModel.create({
      name,
      email,
      passwordHash,
      role: 'admin',
    });

    return NextResponse.json(
      {
        ok: true,
        admin: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin failed:', error);
    return NextResponse.json({ error: 'Failed to create admin.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import { TLogsUserModel } from '@/models/tlogs_user';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const isSubscribed = Boolean(body?.isSubscribed);
    const isStudent = Boolean(body?.isStudent);
    const subsPlan = body?.subsPlan ? Number(body.subsPlan) : null;

    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'Email, password, name, and phone are required fields.' },
        { status: 400 }
      );
    }

    const existingUser = await TLogsUserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'A user with that email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await TLogsUserModel.create({
      name,
      email,
      phone,
      passwordHash,
      isSubscribed,
      isStudent,
      subsPlan,
    });

    return NextResponse.json(
      { message: 'User registered successfully!', userId: user._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration lifecycle error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
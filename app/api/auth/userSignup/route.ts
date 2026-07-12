import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Signup endpoint is not implemented yet.' },
    { status: 501 }
  );
}

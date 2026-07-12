import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
  process.env.NEXT_SUPABASE_PROJECT_URL ||
  '';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISH_KEY ||
  process.env.NEXT_SUPABASE_PUBLISH_KEY ||
  '';

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ profile: null }, { status: 500 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      return NextResponse.json({ profile: null }, { status: 401 });
    }

    const { data, error: profileError } = await supabase
      .from('admin_Profile')
      .select('name, role, email')
      .eq('email', user.email)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({
      profile: data
        ? {
            name: data.name ?? null,
            role: data.role ?? null,
            email: data.email ?? null,
          }
        : null,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ profile: null }, { status: 500 });
  }
}

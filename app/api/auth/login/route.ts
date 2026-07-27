import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = body.password;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    await setSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import { getSessionCookieOptions } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...getSessionCookieOptions(),
    value: '',
    maxAge: 0,
  });
  return response;
}

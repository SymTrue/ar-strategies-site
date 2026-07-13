import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionToken,
  getSessionCookieOptions,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
  }

  const payload: unknown = await req.json();
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { email, password } = payload as { email?: unknown; password?: unknown };
  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalizedEmail) || password.length > 256) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (!verifyAdminCredentials(normalizedEmail, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createAdminSessionToken(normalizedEmail);
  if (!token) {
    return NextResponse.json({ error: 'Admin auth is not configured' }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...getSessionCookieOptions(),
    value: token,
  });
  return response;
}

import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionToken,
  getSessionCookieOptions,
  verifyAdminCredentials,
} from '@/lib/admin-auth';
import { checkLeadRateLimit } from '@/lib/db';
import {
  acceptsJson,
  getRequestIp,
  isSameOriginRequest,
  readJsonObject,
} from '@/lib/request-security';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!acceptsJson(req)) {
      return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
    }

    const body = await readJsonObject(req);
    if (!body.ok) {
      return NextResponse.json(
        { error: body.status === 413 ? 'Request too large' : 'Invalid request' },
        { status: body.status },
      );
    }

    if (!(await checkLeadRateLimit(`admin-login:${getRequestIp(req)}`, 5, 900))) {
      return NextResponse.json({ error: 'Too many login attempts' }, { status: 429 });
    }

    const { email, password } = body.data;
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
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Unable to process login' }, { status: 500 });
  }
}

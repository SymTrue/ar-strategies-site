import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookieOptions } from '@/lib/admin-auth';
import { isSameOriginRequest } from '@/lib/request-security';

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...getSessionCookieOptions(),
    value: '',
    maxAge: 0,
  });
  return response;
}

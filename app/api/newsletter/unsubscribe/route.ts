import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeNewsletter } from '@/lib/db';
import { readUnsubscribeToken } from '@/lib/newsletter';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const email = readUnsubscribeToken(token);

  if (!email) {
    return NextResponse.redirect(new URL('/newsletter/unsubscribed?error=1', req.url));
  }

  try {
    await unsubscribeNewsletter(email);
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.redirect(new URL('/newsletter/unsubscribed?error=1', req.url));
  }

  return NextResponse.redirect(new URL('/newsletter/unsubscribed', req.url));
}

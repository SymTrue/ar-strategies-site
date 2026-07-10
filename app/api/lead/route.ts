import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;

  if (!apiKey || !notifyTo) {
    console.error('Lead capture misconfigured: missing RESEND_API_KEY or LEAD_NOTIFY_EMAIL');
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AR Strategies <leads@arstrategists.com>',
      to: notifyTo,
      reply_to: email,
      subject: 'New free audit request',
      text: `New lead from the site: ${email}`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Resend error:', body);
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

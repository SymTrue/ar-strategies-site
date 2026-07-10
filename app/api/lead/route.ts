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

  // Email 1: Notification to you
  const notificationRes = await fetch('https://api.resend.com/emails', {
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

  if (!notificationRes.ok) {
    const body = await notificationRes.text();
    console.error('Resend notification error:', body);
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  }

  // Email 2: Confirmation to the lead
  const confirmationRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AR Strategies <leads@arstrategists.com>',
      to: email,
      subject: 'Your free audit request received',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000; margin-bottom: 16px;">Thanks for reaching out</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 12px;">
            We received your request for a free advertising audit. Our team will review your current campaigns and get back to you within 24 hours with specific recommendations.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 12px;">
            In the meantime, if you have any questions, reply to this email or reach out directly at <strong>hello@arstrategists.com</strong>.
          </p>
          <p style="color: #999; font-size: 14px; margin-top: 24px;">
            — AR Strategies
          </p>
        </div>
      `,
    }),
  });

  if (!confirmationRes.ok) {
    const body = await confirmationRes.text();
    console.error('Resend confirmation error:', body);
    // Don't fail if confirmation email fails — notification was sent
    console.warn('Confirmation email failed but notification sent');
  }

  return NextResponse.json({ ok: true });
}

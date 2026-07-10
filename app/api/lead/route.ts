import { NextRequest, NextResponse } from 'next/server';
import { saveLead, updateLeadStatus } from '@/lib/db';

// Simple in-memory rate limiter (per IP, 5 requests per hour)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour
    return true;
  }

  if (record.count >= 5) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { email, website } = await req.json();

    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Rate limit check
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Honeypot check: 'website' field should be empty
    if (website && website.trim() !== '') {
      console.warn(`Honeypot triggered from IP: ${ip}`);
      // Return success to not reveal the trap, but don't process
      return NextResponse.json({ ok: true });
    }

    // Validate email
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL;

    if (!apiKey || !notifyTo) {
      console.error('Lead capture misconfigured: missing RESEND_API_KEY or LEAD_NOTIFY_EMAIL');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Store lead in database FIRST (before sending emails)
    let leadId: string;
    try {
      leadId = await saveLead(email);
      if (!leadId) {
        console.error('Failed to get lead ID');
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
      }
    } catch (err) {
      console.error('Database error:', err);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
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
        subject: `new audit request from ${email}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
            <p><strong>${email}</strong> just booked a free audit.</p>
            <p style="color: #666; font-size: 14px;">Deliver: Full campaign audit + Ad Waste Checklist within 24 hours. No pressure, no lock-in.</p>
            <p style="margin-top: 12px;">Reply to this email to reach them, or forward to your team.</p>
          </div>
        `,
      }),
    });

    if (!notificationRes.ok) {
      const body = await notificationRes.text();
      console.error('Resend notification error:', body);
      // Mark lead as notification failed but don't fail the request
      await updateLeadStatus(leadId, 'notification_failed');
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
        subject: 'your free audit request',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
            <p>Thanks for scheduling your free audit — we'll dig into your current campaigns and send you a detailed breakdown within 24 hours.</p>
            <p><strong>What's included:</strong></p>
            <ul style="color: #666; margin: 12px 0; padding-left: 20px;">
              <li>Full campaign audit with waste analysis</li>
              <li>Our Ad Waste Checklist ($47 value)</li>
              <li>Specific recommendations for your business</li>
            </ul>
            <p style="color: #666; margin-top: 12px;">No credit card required. No pressure. No cold calls. If we don't find 3+ improvements, we'll extend your audit free.</p>
            <p style="margin-top: 16px;">Questions before we dive in? Just reply to this email or reach out to <strong>hello@arstrategists.com</strong>.</p>
            <p style="margin-top: 24px; color: #999; font-size: 14px;">— AR Strategies</p>
          </div>
        `,
      }),
    });

    if (!confirmationRes.ok) {
      const body = await confirmationRes.text();
      console.error('Resend confirmation error:', body);
    }

    // Mark lead as confirmed
    await updateLeadStatus(leadId, 'confirmed');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

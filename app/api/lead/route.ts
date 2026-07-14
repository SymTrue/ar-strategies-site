import { NextRequest, NextResponse } from 'next/server';
import { checkLeadRateLimit, saveLead, updateLeadStatus } from '@/lib/db';
import {
  acceptsJson,
  getRequestIp,
  isSameOriginRequest,
  readJsonObject,
} from '@/lib/request-security';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };

    return entities[character];
  });
}

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

    const { email, website } = body.data;

    const ip = getRequestIp(req);

    // Rate limit check
    const rateKey = `lead:${ip}`;
    if (!(await checkLeadRateLimit(rateKey, 5, 3600))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Honeypot check: 'website' field should be empty
    if (typeof website === 'string' && website.trim() !== '') {
      console.warn(`Honeypot triggered from IP: ${ip}`);
      // Return success to not reveal the trap, but don't process
      return NextResponse.json({ ok: true });
    }

    // Validate email
    if (typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const escapedEmail = escapeHtml(normalizedEmail);

    const apiKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL;

    if (!apiKey || !notifyTo) {
      console.error('Lead capture misconfigured: missing RESEND_API_KEY or LEAD_NOTIFY_EMAIL');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Store lead in database FIRST (before sending emails)
    let leadId: string | null;
    try {
      leadId = await saveLead(normalizedEmail);
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
        reply_to: normalizedEmail,
        subject: `new audit request from ${normalizedEmail}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
            <p><strong>${escapedEmail}</strong> just booked a free audit.</p>
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
        to: normalizedEmail,
        subject: 'your free audit request',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
            <p>Thanks for scheduling your free audit. We will dig into your current campaigns and send you a detailed breakdown within 24 hours.</p>
            <p><strong>What's included:</strong></p>
            <ul style="color: #666; margin: 12px 0; padding-left: 20px;">
              <li>Full campaign audit with waste analysis</li>
              <li>Our Ad Waste Checklist ($47 value)</li>
              <li>Specific recommendations for your business</li>
            </ul>
            <p style="color: #666; margin-top: 12px;">No credit card required. No pressure. No cold calls. If we don't find 3+ improvements, we'll extend your audit free.</p>
            <p style="margin-top: 16px;">Questions before we dive in? Just reply to this email or reach out to <strong>hello@arstrategists.com</strong>.</p>
            <p style="margin-top: 24px; color: #999; font-size: 14px;">- AR Strategies</p>
          </div>
        `,
      }),
    });

    if (!confirmationRes.ok) {
      const body = await confirmationRes.text();
      console.error('Resend confirmation error:', body);
    }

    // Mark lead as confirmed only when the owner notification was delivered.
    if (notificationRes.ok) {
      await updateLeadStatus(leadId, 'confirmed');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { checkLeadRateLimit, saveLead, updateLeadStatus } from '@/lib/db';
import { addToNewsletterAudience } from '@/lib/resend';
import {
  acceptsJson,
  getRequestIp,
  isSameOriginRequest,
  readJsonObject,
} from '@/lib/request-security';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_URL = 'https://www.arstrategists.com';

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

function cleanField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

interface ApplicationFields {
  firstName: string;
  lastName: string;
  phone: string;
  industry: string;
  spend: string;
  help: string;
}

function applicationRows(fields: ApplicationFields): string {
  const rows: Array<[string, string]> = [
    ['Name', `${fields.firstName} ${fields.lastName}`.trim()],
    ['Phone', fields.phone],
    ['Industry', fields.industry],
    ['Current marketing spend', fields.spend],
    ['Needs help with', fields.help],
  ];

  return rows
    .filter(([, value]) => value !== '')
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 4px 12px 4px 0; color: #999; vertical-align: top; white-space: nowrap;">${label}</td><td style="padding: 4px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
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

    const { email, website, type } = body.data;
    const isApplication = type === 'application';

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

    const application: ApplicationFields = {
      firstName: cleanField(body.data.firstName, 100),
      lastName: cleanField(body.data.lastName, 100),
      phone: cleanField(body.data.phone, 40),
      industry: cleanField(body.data.industry, 120),
      spend: cleanField(body.data.spend, 120),
      help: cleanField(body.data.help, 2000),
    };

    if (isApplication && (application.firstName === '' || application.help === '')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL;

    if (!apiKey || !notifyTo) {
      console.error('Lead capture misconfigured: missing RESEND_API_KEY or LEAD_NOTIFY_EMAIL');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Store lead in database FIRST (before sending emails)
    const storedDetails = isApplication
      ? Object.fromEntries(Object.entries(application).filter(([, v]) => v !== ''))
      : null;

    let leadId: string | null;
    try {
      leadId = await saveLead(
        normalizedEmail,
        isApplication ? 'application' : 'newsletter',
        storedDetails,
      );
      if (!leadId) {
        console.error('Failed to get lead ID');
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
      }
    } catch (err) {
      console.error('Database error:', err);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    if (!isApplication) {
      await addToNewsletterAudience(normalizedEmail);
    }

    const notificationSubject = isApplication
      ? `new application from ${normalizedEmail}`
      : `new newsletter signup: ${normalizedEmail}`;

    const notificationHtml = isApplication
      ? `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
          <p><strong>${escapedEmail}</strong> sent in an application to work with you.</p>
          <table style="margin: 12px 0; font-size: 14px; border-collapse: collapse;">${applicationRows(application)}</table>
          <p style="margin-top: 12px;">Reply to this email to reach them and schedule the call.</p>
        </div>
      `
      : `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
          <p><strong>${escapedEmail}</strong> joined the weekly list.</p>
          <p style="margin-top: 12px;">Reply to this email to reach them directly.</p>
        </div>
      `;

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
        subject: notificationSubject,
        html: notificationHtml,
      }),
    });

    if (!notificationRes.ok) {
      const body = await notificationRes.text();
      console.error('Resend notification error:', body);
      // Mark lead as notification failed but don't fail the request
      await updateLeadStatus(leadId, 'notification_failed');
    }

    const confirmationSubject = isApplication ? 'we got your application' : "you're on the list";

    const confirmationHtml = isApplication
      ? `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
          <p>Thanks for sending in your application. We read every one personally.</p>
          <p>If it looks like a good fit, we will reach back out to schedule a call. Either way you will hear from us.</p>
          <p style="color: #666; margin-top: 12px;">In the meantime, the free 3-second test shows you how your business reads to a stranger: <a href="${SITE_URL}/tools/three-second-test">${SITE_URL}/tools/three-second-test</a></p>
          <p style="margin-top: 16px;">Questions? Just reply to this email or reach out to <strong>hello@arstrategists.com</strong>.</p>
          <p style="margin-top: 24px; color: #999; font-size: 14px;">- AR Strategies</p>
        </div>
      `
      : `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
          <p>You're in. Every week you get one specific fix that helps local businesses get found first: real examples, exact steps, about five minutes to read.</p>
          <p style="color: #666; margin-top: 12px;">Want a head start? The free 3-second test scores how your business reads to a stranger, in about two minutes: <a href="${SITE_URL}/tools/three-second-test">${SITE_URL}/tools/three-second-test</a></p>
          <p style="color: #666; margin-top: 12px;">One email a week. No spam, unsubscribe anytime with one click.</p>
          <p style="margin-top: 16px;">Questions? Just reply to this email or reach out to <strong>hello@arstrategists.com</strong>.</p>
          <p style="margin-top: 24px; color: #999; font-size: 14px;">- AR Strategies</p>
        </div>
      `;

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
        subject: confirmationSubject,
        html: confirmationHtml,
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

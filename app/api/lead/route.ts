import { NextRequest, NextResponse } from 'next/server';
import {
  checkLeadRateLimit,
  enqueueEmailDelivery,
  isLeadSource,
  recordLeadEvent,
  saveLead,
  type LeadAttribution,
  type LeadSource,
} from '@/lib/db';
import { processQueuedEmailDeliveries } from '@/lib/email-delivery';
import { addToNewsletterAudience } from '@/lib/resend';
import {
  acceptsJson,
  getRequestIp,
  isSameOriginRequest,
  readJsonObject,
} from '@/lib/request-security';
import {
  applicationRows,
  escapeHtml,
  isApplicationComplete,
  isHoneypotTriggered,
  normalizeEmail,
  parseApplicationFields,
} from '@/lib/lead-validation';
import { createUnsubscribeUrl } from '@/lib/newsletter';

const SITE_URL = 'https://www.arstrategists.com';

function getSource(data: Record<string, unknown>): LeadSource {
  if (data.type === 'application') return 'application';
  if (isLeadSource(data.source)) return data.source;
  return 'newsletter';
}

function getAttribution(request: NextRequest): LeadAttribution {
  const referrer = request.headers.get('referer');
  if (!referrer) return { landingPath: null, referrer: null, utm: null };

  try {
    const url = new URL(referrer);
    const utm = Object.fromEntries(
      [...url.searchParams.entries()].filter(([key]) => key.startsWith('utm_')),
    );
    return {
      landingPath: `${url.pathname}${url.search}`.slice(0, 500),
      referrer: url.origin === SITE_URL ? null : url.origin,
      utm: Object.keys(utm).length > 0 ? utm : null,
    };
  } catch {
    return { landingPath: null, referrer: null, utm: null };
  }
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
    const source = getSource(body.data);

    const ip = getRequestIp(req);

    // Rate limit check
    const rateKey = `lead:${ip}`;
    if (!(await checkLeadRateLimit(rateKey, 5, 3600))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Honeypot check: 'website' field should be empty
    if (isHoneypotTriggered(website)) {
      console.warn(`Honeypot triggered from IP: ${ip}`);
      // Return success to not reveal the trap, but don't process
      return NextResponse.json({ ok: true });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const escapedEmail = escapeHtml(normalizedEmail);

    const application = parseApplicationFields(body.data);
    if (source === 'application' && !isApplicationComplete(application)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notifyTo = process.env.LEAD_NOTIFY_EMAIL;

    if (!process.env.RESEND_API_KEY || !notifyTo) {
      console.error('Lead capture misconfigured: missing RESEND_API_KEY or LEAD_NOTIFY_EMAIL');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Store lead in database FIRST (before enqueueing emails)
    const storedDetails = source === 'application'
      ? Object.fromEntries(Object.entries(application).filter(([, v]) => v !== ''))
      : null;

    let saved: { id: string; created: boolean } | null;
    try {
      saved = await saveLead(
        normalizedEmail,
        source,
        storedDetails,
        getAttribution(req),
      );
      if (!saved) {
        console.error('Failed to get lead ID');
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
      }
    } catch (err) {
      console.error('Database error:', err);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    await recordLeadEvent(saved.id, saved.created ? 'lead.created' : 'lead.resubmitted', { source });

    if (source === 'newsletter') {
      // Best-effort: a missing/misconfigured Audience must never block signup.
      void addToNewsletterAudience(normalizedEmail);
    }

    const notificationSubject = source === 'application'
      ? `new application from ${normalizedEmail}`
      : `new newsletter signup: ${normalizedEmail}`;

    const notificationHtml = source === 'application'
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

    const confirmationSubject = source === 'application' ? 'we got your application' : "you're on the list";

    const unsubscribeUrl = source === 'newsletter' ? createUnsubscribeUrl(normalizedEmail) : null;
    const confirmationHtml = source === 'application'
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
          <p style="color: #666; margin-top: 12px;">One email a week. No spam. ${unsubscribeUrl ? `<a href="${unsubscribeUrl}">Unsubscribe with one click.</a>` : 'Reply to unsubscribe.'}</p>
          <p style="margin-top: 16px;">Questions? Just reply to this email or reach out to <strong>hello@arstrategists.com</strong>.</p>
          <p style="margin-top: 24px; color: #999; font-size: 14px;">- AR Strategies</p>
        </div>
      `;

    // Both emails go through the durable outbox (email_deliveries) rather than
    // a direct Resend call tied to this one request's lifecycle: a Resend
    // hiccup here gets retried by the cron worker instead of silently losing
    // the notification or confirmation.
    await enqueueEmailDelivery({
      leadId: saved.id,
      deliveryType: 'owner_notification',
      recipient: notifyTo,
      replyTo: normalizedEmail,
      subject: notificationSubject,
      html: notificationHtml,
    });
    await enqueueEmailDelivery({
      leadId: saved.id,
      deliveryType: 'lead_confirmation',
      recipient: normalizedEmail,
      replyTo: null,
      subject: confirmationSubject,
      html: confirmationHtml,
    });

    // Attempt immediate delivery so the common case still feels instant;
    // any failure here is silently picked up by the next cron sweep.
    try {
      await processQueuedEmailDeliveries(2);
    } catch (err) {
      console.error('Immediate email delivery attempt failed (will retry via cron):', err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

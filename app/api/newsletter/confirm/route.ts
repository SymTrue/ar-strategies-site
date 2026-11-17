import { NextRequest, NextResponse } from 'next/server';
import { confirmNewsletterSignup, enqueueEmailDelivery } from '@/lib/db';
import { processQueuedEmailDeliveries } from '@/lib/email-delivery';
import { createUnsubscribeUrl, readConfirmToken } from '@/lib/newsletter';
import { ownerNewsletterHtml, welcomeHtml } from '@/lib/newsletter-emails';
import { addToNewsletterAudience } from '@/lib/resend';

function redirectTo(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, req.url));
}

// Second half of the double opt-in. Only a valid, unexpired, signed token can
// reach the side effects below, and a repeat click is a no-op.
export async function GET(req: NextRequest) {
  const email = readConfirmToken(req.nextUrl.searchParams.get('token'));
  if (!email) return redirectTo(req, '/newsletter/confirmed?error=1');

  try {
    const confirmed = await confirmNewsletterSignup(email);
    if (!confirmed) return redirectTo(req, '/newsletter/confirmed?error=1');

    if (confirmed.firstTime) {
      void addToNewsletterAudience(email);

      const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
      if (notifyTo) {
        await enqueueEmailDelivery({
          leadId: confirmed.leadId,
          deliveryType: 'owner_notification',
          recipient: notifyTo,
          replyTo: email,
          subject: `new newsletter signup: ${email}`,
          html: ownerNewsletterHtml(email),
        });
      }
      await enqueueEmailDelivery({
        leadId: confirmed.leadId,
        deliveryType: 'lead_confirmation',
        recipient: email,
        replyTo: null,
        subject: "you're on the list",
        html: welcomeHtml(createUnsubscribeUrl(email)),
      });

      try {
        await processQueuedEmailDeliveries(2);
      } catch (err) {
        console.error('Immediate email delivery attempt failed (will retry via cron):', err);
      }
    }
  } catch (err) {
    console.error('Newsletter confirm error:', err);
    return redirectTo(req, '/newsletter/confirmed?error=1');
  }

  return redirectTo(req, '/newsletter/confirmed');
}

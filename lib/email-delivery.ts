import {
  claimEmailDeliveries,
  markEmailDeliveryFailed,
  markEmailDeliverySent,
} from '@/lib/db';
import { sendResendEmail } from '@/lib/resend';

export async function processQueuedEmailDeliveries(limit: number = 10): Promise<number> {
  const deliveries = await claimEmailDeliveries(limit);

  for (const delivery of deliveries) {
    const result = await sendResendEmail({
      to: delivery.recipient,
      replyTo: delivery.replyTo,
      subject: delivery.subject,
      html: delivery.html,
    });

    if (result.ok) {
      await markEmailDeliverySent(delivery);
    } else {
      await markEmailDeliveryFailed(delivery, result.error);
    }
  }

  return deliveries.length;
}

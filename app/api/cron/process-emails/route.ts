import { NextRequest, NextResponse } from 'next/server';
import { processQueuedEmailDeliveries } from '@/lib/email-delivery';
import { isAuthorizedCronRequest } from '@/lib/request-security';

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const processed = await processQueuedEmailDeliveries(25);
    return NextResponse.json({ ok: true, processed });
  } catch (err) {
    console.error('Cron process-emails error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

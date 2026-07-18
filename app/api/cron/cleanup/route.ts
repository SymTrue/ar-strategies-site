import { NextRequest, NextResponse } from 'next/server';
import { cleanOperationalRecords } from '@/lib/db';
import { isAuthorizedCronRequest } from '@/lib/request-security';

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await cleanOperationalRecords();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Cron cleanup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

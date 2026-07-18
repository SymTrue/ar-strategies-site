import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { listLeadEvents } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id || id.length > 128) {
    return NextResponse.json({ error: 'Invalid lead' }, { status: 400 });
  }

  const events = await listLeadEvents(id);
  return NextResponse.json({ events });
}

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { isLeadPriority, isLeadStatus, updateLeadCRM } from '@/lib/db';

function normalizeNullableDate(value: unknown): string | null {
  if (value === null || value === '') return null;
  if (typeof value !== 'string') return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
  }

  const payload: unknown = await req.json();
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { id } = await context.params;
  const { status, priority, notes, nextFollowUpAt, markContacted } = payload as {
    status?: unknown;
    priority?: unknown;
    notes?: unknown;
    nextFollowUpAt?: unknown;
    markContacted?: unknown;
  };

  if (!isLeadStatus(status) || !isLeadPriority(priority)) {
    return NextResponse.json({ error: 'Invalid lead fields' }, { status: 400 });
  }

  const cleanNotes = typeof notes === 'string' ? notes.trim().slice(0, 5000) || null : null;
  const updated = await updateLeadCRM(id, {
    status,
    priority,
    notes: cleanNotes,
    nextFollowUpAt: normalizeNullableDate(nextFollowUpAt),
    markContacted: markContacted === true,
  });

  if (!updated) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  return NextResponse.json({ lead: updated });
}

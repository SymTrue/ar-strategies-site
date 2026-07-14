import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { isLeadPriority, isLeadStatus, updateLeadCRM } from '@/lib/db';
import { acceptsJson, isSameOriginRequest, readJsonObject } from '@/lib/request-security';

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

  const { id } = await context.params;
  if (!id || id.length > 128) {
    return NextResponse.json({ error: 'Invalid lead' }, { status: 400 });
  }

  const { status, priority, notes, nextFollowUpAt, markContacted } = body.data;

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

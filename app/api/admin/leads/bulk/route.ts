import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { bulkUpdateLeadStatus, isLeadStatus } from '@/lib/db';
import { acceptsJson, isSameOriginRequest, readJsonObject } from '@/lib/request-security';

const MAX_BULK_IDS = 200;

export async function PATCH(req: NextRequest) {
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

  const { ids, status } = body.data;
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_BULK_IDS) {
    return NextResponse.json({ error: 'Invalid lead selection' }, { status: 400 });
  }
  if (!ids.every((id) => typeof id === 'string' && id.length <= 128)) {
    return NextResponse.json({ error: 'Invalid lead selection' }, { status: 400 });
  }
  if (!isLeadStatus(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await bulkUpdateLeadStatus(ids as string[], status);
  return NextResponse.json({ ok: true, updated });
}

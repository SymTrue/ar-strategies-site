import type { NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

const MAX_JSON_BODY_BYTES = 16 * 1024;

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET` on scheduled
// invocations. Reject anything else so the endpoint can't be triggered by a
// random request to a guessed URL.
export function isAuthorizedCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  const provided = Buffer.from(header);
  const expectedBuf = Buffer.from(expected);
  return provided.length === expectedBuf.length && timingSafeEqual(provided, expectedBuf);
}

type JsonObjectResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: 400 | 413 };

export function acceptsJson(request: NextRequest): boolean {
  return request.headers.get('content-type')?.includes('application/json') ?? false;
}

export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (origin === null || origin === request.nextUrl.origin) return true;

  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const forwardedProtocol = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol;
  if (!forwardedHost) return false;

  const protocol = forwardedProtocol.split(',')[0].trim().replace(/:$/, '');
  const host = forwardedHost.split(',')[0].trim();
  return origin === `${protocol}://${host}`;
}

export function getRequestIp(request: NextRequest): string {
  const forwardedFor =
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip');

  return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export async function readJsonObject(request: NextRequest): Promise<JsonObjectResult> {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BODY_BYTES) {
    return { ok: false, status: 413 };
  }

  try {
    const payload: unknown = await request.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return { ok: false, status: 400 };
    }

    return { ok: true, data: payload as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400 };
  }
}

import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { acceptsJson, getRequestIp, isSameOriginRequest, readJsonObject } from './request-security';

function makeRequest(url: string, headers: Record<string, string> = {}, body?: string) {
  return new NextRequest(url, {
    method: 'POST',
    headers,
    ...(body !== undefined ? { body } : {}),
  });
}

describe('isSameOriginRequest', () => {
  it('allows a request with no Origin header (same-tab navigations, curl)', () => {
    const req = makeRequest('https://www.arstrategists.com/api/lead');
    expect(isSameOriginRequest(req)).toBe(true);
  });

  it('allows a request whose Origin matches the request URL', () => {
    const req = makeRequest('https://www.arstrategists.com/api/lead', {
      origin: 'https://www.arstrategists.com',
    });
    expect(isSameOriginRequest(req)).toBe(true);
  });

  it('blocks a cross-origin Origin header (the actual CSRF case this guards)', () => {
    const req = makeRequest('https://www.arstrategists.com/api/lead', {
      origin: 'https://evil.example',
    });
    expect(isSameOriginRequest(req)).toBe(false);
  });

  it('allows Origin matching the forwarded host behind a proxy', () => {
    const req = makeRequest('http://localhost:3000/api/lead', {
      origin: 'https://www.arstrategists.com',
      'x-forwarded-host': 'www.arstrategists.com',
      'x-forwarded-proto': 'https',
    });
    expect(isSameOriginRequest(req)).toBe(true);
  });

  it('blocks when Origin does not match the forwarded host either', () => {
    const req = makeRequest('http://localhost:3000/api/lead', {
      origin: 'https://evil.example',
      'x-forwarded-host': 'www.arstrategists.com',
      'x-forwarded-proto': 'https',
    });
    expect(isSameOriginRequest(req)).toBe(false);
  });
});

describe('acceptsJson', () => {
  it('accepts an exact application/json content-type', () => {
    const req = makeRequest('https://x.test/api/lead', { 'content-type': 'application/json' });
    expect(acceptsJson(req)).toBe(true);
  });

  it('accepts application/json with a charset suffix', () => {
    const req = makeRequest('https://x.test/api/lead', {
      'content-type': 'application/json; charset=utf-8',
    });
    expect(acceptsJson(req)).toBe(true);
  });

  it('rejects a missing or non-JSON content-type', () => {
    expect(acceptsJson(makeRequest('https://x.test/api/lead'))).toBe(false);
    expect(
      acceptsJson(makeRequest('https://x.test/api/lead', { 'content-type': 'text/plain' })),
    ).toBe(false);
  });
});

describe('getRequestIp', () => {
  it('prefers x-vercel-forwarded-for over x-forwarded-for', () => {
    const req = makeRequest('https://x.test/api/lead', {
      'x-vercel-forwarded-for': '1.1.1.1',
      'x-forwarded-for': '2.2.2.2',
    });
    expect(getRequestIp(req)).toBe('1.1.1.1');
  });

  it('takes the first address from a comma-separated forwarded-for chain', () => {
    const req = makeRequest('https://x.test/api/lead', {
      'x-forwarded-for': '3.3.3.3, 4.4.4.4',
    });
    expect(getRequestIp(req)).toBe('3.3.3.3');
  });

  it('falls back to "unknown" with no IP headers, never throws', () => {
    expect(getRequestIp(makeRequest('https://x.test/api/lead'))).toBe('unknown');
  });
});

describe('readJsonObject', () => {
  it('parses a valid JSON object body', async () => {
    const req = makeRequest(
      'https://x.test/api/lead',
      { 'content-type': 'application/json' },
      JSON.stringify({ email: 'a@b.com' }),
    );
    const result = await readJsonObject(req);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual({ email: 'a@b.com' });
  });

  it('rejects a JSON array body (not an object)', async () => {
    const req = makeRequest(
      'https://x.test/api/lead',
      { 'content-type': 'application/json' },
      JSON.stringify([1, 2, 3]),
    );
    const result = await readJsonObject(req);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it('rejects malformed JSON', async () => {
    const req = makeRequest(
      'https://x.test/api/lead',
      { 'content-type': 'application/json' },
      '{not json',
    );
    const result = await readJsonObject(req);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it('rejects a body over the size cap via content-length, before reading it', async () => {
    const req = makeRequest(
      'https://x.test/api/lead',
      { 'content-type': 'application/json', 'content-length': String(17 * 1024) },
      JSON.stringify({ email: 'a@b.com' }),
    );
    const result = await readJsonObject(req);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(413);
  });
});

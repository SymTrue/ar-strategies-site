import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstile } from './turnstile';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function mockFetchOnce(body: unknown, ok = true) {
  const fn = vi.fn().mockResolvedValue({ ok, json: async () => body });
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('verifyTurnstile', () => {
  beforeEach(() => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('accepts a token Cloudflare reports as successful', async () => {
    const fetchMock = mockFetchOnce({ success: true });
    await expect(verifyTurnstile('tok', '203.0.113.9')).resolves.toBe(true);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(SITEVERIFY);
    const sent = JSON.parse(init.body as string);
    expect(sent).toMatchObject({ secret: 'test-secret', response: 'tok', remoteip: '203.0.113.9' });
  });

  it('omits remoteip when the IP is unknown', async () => {
    const fetchMock = mockFetchOnce({ success: true });
    await verifyTurnstile('tok', 'unknown');
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(sent.remoteip).toBeUndefined();
  });

  it('rejects when Cloudflare says the token is invalid or reused', async () => {
    mockFetchOnce({ success: false, 'error-codes': ['timeout-or-duplicate'] });
    await expect(verifyTurnstile('tok', '203.0.113.9')).resolves.toBe(false);
  });

  it('rejects a missing, empty, non-string or oversized token without calling Cloudflare', async () => {
    const fetchMock = mockFetchOnce({ success: true });
    await expect(verifyTurnstile(undefined, 'ip')).resolves.toBe(false);
    await expect(verifyTurnstile('', 'ip')).resolves.toBe(false);
    await expect(verifyTurnstile(42, 'ip')).resolves.toBe(false);
    await expect(verifyTurnstile('x'.repeat(2049), 'ip')).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails closed when the secret is not configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    const fetchMock = mockFetchOnce({ success: true });
    await expect(verifyTurnstile('tok', 'ip')).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails closed on a network error, a non-OK response or a malformed body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    await expect(verifyTurnstile('tok', 'ip')).resolves.toBe(false);

    mockFetchOnce({ success: true }, false);
    await expect(verifyTurnstile('tok', 'ip')).resolves.toBe(false);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new Error('bad json'); } }));
    await expect(verifyTurnstile('tok', 'ip')).resolves.toBe(false);
  });
});

// Server-side Cloudflare Turnstile token check. Fails closed: any problem
// (missing secret, network error, bad response) counts as "not verified".
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_TOKEN_LENGTH = 2048;
const REQUEST_TIMEOUT_MS = 5000;

export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Turnstile misconfigured: TURNSTILE_SECRET_KEY is not set');
    return false;
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return false;
  }

  const payload: Record<string, string> = { secret, response: token };
  if (ip && ip !== 'unknown') payload.remoteip = ip;

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return false;
    const result = (await res.json()) as { success?: unknown };
    return result.success === true;
  } catch (err) {
    console.error('Turnstile verification failed:', err);
    return false;
  }
}

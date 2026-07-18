import { createHmac, timingSafeEqual } from 'node:crypto';

const SITE_URL = 'https://www.arstrategists.com';

function getSecret(): string | null {
  return process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? null;
}

function signature(email: string): string | null {
  const secret = getSecret();
  return secret ? createHmac('sha256', secret).update(email).digest('base64url') : null;
}

export function createUnsubscribeUrl(email: string): string | null {
  const signed = signature(email);
  if (!signed) return null;

  const token = `${Buffer.from(email).toString('base64url')}.${signed}`;
  return `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function readUnsubscribeToken(token: string | null): string | null {
  if (!token) return null;
  const [encodedEmail, providedSignature] = token.split('.');
  const expectedSignature = encodedEmail
    ? signature(Buffer.from(encodedEmail, 'base64url').toString('utf8'))
    : null;
  if (!encodedEmail || !providedSignature || !expectedSignature) return null;

  const actual = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  const email = Buffer.from(encodedEmail, 'base64url').toString('utf8').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

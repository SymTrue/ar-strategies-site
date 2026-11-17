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

// Double opt-in. The confirm token is namespaced ("confirm:" in the signed
// payload) and expires, so an unsubscribe link can never confirm a signup and
// an old link can never be replayed.
const CONFIRM_TTL_SECONDS = 7 * 24 * 60 * 60;

function confirmSignature(email: string, exp: number): string | null {
  const secret = getSecret();
  return secret
    ? createHmac('sha256', secret).update(`confirm:${email}:${exp}`).digest('base64url')
    : null;
}

export function createConfirmUrl(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  const exp = Math.floor(Date.now() / 1000) + CONFIRM_TTL_SECONDS;
  const signed = confirmSignature(normalized, exp);
  if (!signed) return null;

  const token = `${Buffer.from(normalized).toString('base64url')}.${exp}.${signed}`;
  return `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
}

export function readConfirmToken(token: string | null): string | null {
  if (!token) return null;
  const [encodedEmail, expRaw, providedSignature] = token.split('.');
  if (!encodedEmail || !expRaw || !providedSignature) return null;

  const exp = Number(expRaw);
  if (!Number.isInteger(exp) || exp < Math.floor(Date.now() / 1000)) return null;

  const email = Buffer.from(encodedEmail, 'base64url').toString('utf8').trim().toLowerCase();
  const expectedSignature = confirmSignature(email, exp);
  if (!expectedSignature) return null;

  const actual = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

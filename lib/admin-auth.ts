import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'ar_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const PASSWORD_HASH_PREFIX = 'scrypt';

export type AdminSession = {
  email: string;
  exp: number;
};

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string): Buffer {
  return Buffer.from(value, 'base64url');
}

function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

function sign(value: string): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString('base64url');
  const hash = scryptSync(password, salt, 64).toString('base64url');
  return `${PASSWORD_HASH_PREFIX}:${salt}:${hash}`;
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedEmail || !passwordHash) return false;
  if (email.trim().toLowerCase() !== expectedEmail) return false;

  const [scheme, salt, expectedHash] = passwordHash.split(':');
  if (scheme !== PASSWORD_HASH_PREFIX || !salt || !expectedHash) return false;

  const actual = scryptSync(password, salt, 64);
  const expected = base64UrlDecode(expectedHash);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createAdminSessionToken(email: string): string | null {
  const payload: AdminSession = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(body);
  return signature ? `${body}.${signature}` : null;
}

export function verifyAdminSessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expectedSignature = sign(body);
  if (!expectedSignature) return null;

  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    const session = JSON.parse(base64UrlDecode(body).toString('utf8')) as AdminSession;
    const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (
      !expectedEmail ||
      session.email !== expectedEmail ||
      session.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}

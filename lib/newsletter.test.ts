import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createConfirmUrl,
  createUnsubscribeUrl,
  readConfirmToken,
  readUnsubscribeToken,
} from './newsletter';

const tokenOf = (url: string | null) => new URL(url as string).searchParams.get('token');

describe('newsletter confirm token', () => {
  beforeEach(() => {
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET = 'test-secret-value';
    vi.useRealTimers();
  });

  it('round-trips the email for a fresh token', () => {
    const token = tokenOf(createConfirmUrl('Person@Example.com'));
    expect(readConfirmToken(token)).toBe('person@example.com');
  });

  it('rejects a token after its expiry', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-17T00:00:00Z'));
    const token = tokenOf(createConfirmUrl('person@example.com'));
    vi.setSystemTime(new Date('2026-11-25T00:00:00Z'));
    expect(readConfirmToken(token)).toBeNull();
  });

  it('rejects a tampered email', () => {
    const token = tokenOf(createConfirmUrl('person@example.com')) as string;
    const [, exp, sig] = token.split('.');
    const forged = `${Buffer.from('victim@example.com').toString('base64url')}.${exp}.${sig}`;
    expect(readConfirmToken(forged)).toBeNull();
  });

  it('does not accept an unsubscribe token as a confirm token, or the reverse', () => {
    const unsub = tokenOf(createUnsubscribeUrl('person@example.com'));
    const confirm = tokenOf(createConfirmUrl('person@example.com'));
    expect(readConfirmToken(unsub)).toBeNull();
    expect(readUnsubscribeToken(confirm)).toBeNull();
  });

  it('returns null without a secret or a token', () => {
    delete process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
    expect(createConfirmUrl('person@example.com')).toBeNull();
    expect(readConfirmToken(null)).toBeNull();
  });
});

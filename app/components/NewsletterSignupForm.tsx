'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

export function NewsletterSignupForm({ placement }: { placement: string }) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: honeypot }),
      });
      if (!res.ok) throw new Error('failed');
      track('newsletter_signup', { placement });
      setState('success');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <p className="text-green-500 text-sm border border-dashed border-[var(--border)] rounded-lg px-6 py-4" role="alert">
        You&apos;re in. Your first fix lands this week.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <label htmlFor={`newsletter-email-${placement}`} className="sr-only">Email address</label>
      <input
        id={`newsletter-email-${placement}`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@email.com"
        required
        disabled={state === 'loading'}
        className="flex-1 px-5 py-3.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/50 transition disabled:opacity-50"
      />
      <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary active:scale-[0.97] px-7 py-3.5 rounded-full transition-colors whitespace-nowrap disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
      >
        {state === 'loading' ? 'Sending…' : 'Get the Weekly Fix'}
      </button>
      {state === 'error' && (
        <p className="text-sm text-red-500 sm:basis-full" role="alert">
          That didn&apos;t go through. Try again, or email{' '}
          <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
        </p>
      )}
    </form>
  );
}

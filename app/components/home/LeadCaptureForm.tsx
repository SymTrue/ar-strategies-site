'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

type LeadFormState = 'idle' | 'loading' | 'success' | 'error';

interface LeadCaptureFormProps {
  placement: string;
  idPrefix: string;
  revealAttr: 'data-intro' | 'data-reveal';
  formClassName: string;
  successClassName: string;
  errorClassName: string;
  /** Rendered between the form and the success/error message, matching the
      original DOM order (form -> static note -> state-dependent message). */
  noteBelow?: React.ReactNode;
}

/* Isolates the email/submit-state useState pair that previously lived in
   Home(), where every keystroke re-rendered the entire homepage tree
   (measured with React Scan: 163 render events across 45 components,
   including both WebGL canvases, on a single character typed). Keeping
   this state here means a keystroke only re-renders this form. */
export function LeadCaptureForm({
  placement,
  idPrefix,
  revealAttr,
  formClassName,
  successClassName,
  errorClassName,
  noteBelow,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<LeadFormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      // Check honeypot before submitting
      const form = e.currentTarget as HTMLFormElement;
      const websiteField = form.querySelector('input[name="website"]') as HTMLInputElement;
      if (websiteField && websiteField.value.trim() !== '') {
        setState('success');
        setEmail('');
        return;
      }

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: '' }),
      });
      if (!res.ok) throw new Error('failed');
      track('newsletter_signup', { placement });
      setState('success');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  const revealProps = revealAttr === 'data-intro' ? { 'data-intro': '' } : { 'data-reveal': '' };

  return (
    <>
      <form onSubmit={handleSubmit} {...revealProps} className={formClassName}>
        <label htmlFor={`${idPrefix}-email`} className="sr-only">Email address</label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@email.com"
          required
          disabled={state === 'loading'}
          className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/50 transition disabled:opacity-50"
        />
        {/* Honeypot field - hidden from users, prevents automated form submission */}
        <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button
          type="submit"
          aria-label="Get the weekly fix"
          disabled={state === 'loading'}
          className="btn-primary active:scale-[0.97] px-7 py-3.5 rounded-full transition-colors whitespace-nowrap disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          {state === 'loading' ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending
            </span>
          ) : (
            'Get the Weekly Fix'
          )}
        </button>
      </form>
      {noteBelow}
      {state === 'success' && (
        <p className={successClassName} role="alert">You&apos;re in. Your first fix lands this week.</p>
      )}
      {state === 'error' && (
        <p className={errorClassName} role="alert">
          Something went wrong. Email us directly at{' '}
          <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
        </p>
      )}
    </>
  );
}

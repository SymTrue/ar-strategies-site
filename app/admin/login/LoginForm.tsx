'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type LoginState = 'idle' | 'loading' | 'error';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<LoginState>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('loading');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setState('error');
      return;
    }

    router.replace('/admin');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={state === 'loading'}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-brand"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={state === 'loading'}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-brand"
        />
      </div>
      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm transition-colors disabled:opacity-60"
      >
        {state === 'loading' ? 'Signing in' : 'Open CRM'}
      </button>
      {state === 'error' && (
        <p className="text-sm text-red-400" role="alert">
          Login failed. Check the admin email/password hash configuration.
        </p>
      )}
    </form>
  );
}

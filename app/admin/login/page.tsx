import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login: AR Strategies',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="site-shell min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section>
            <Link href="/" className="mb-12 inline-flex items-center gap-3">
              <Image src="/logo.png" alt="AR Strategies" width={42} height={42} className="site-logo h-10 w-auto" />
              <span className="font-display text-xl tracking-wide">AR STRATEGIES</span>
            </Link>
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-brand">Founder console</p>
            <h1 className="font-display max-w-xl text-5xl uppercase leading-none md:text-7xl">
              Lead intelligence, not inbox archaeology.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--text-secondary)]">
              Review audit requests, prioritize follow-up, and keep every prospect moving through the same disciplined operating system.
            </p>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl md:p-8">
            <div className="mb-8 border-b border-dashed border-[var(--border)] pb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Secure access</p>
              <h2 className="mt-2 font-display text-3xl uppercase">Admin Login</h2>
            </div>
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}

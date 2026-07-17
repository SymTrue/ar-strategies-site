'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ui/theme-toggle';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Work With Us', href: '/work-with-us' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Mechanisms', href: '/mechanisms' },
  { label: 'FAQ', href: '/#faq' },
];

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}

/* Shared header for subpages (the homepage keeps its scrollspy-enabled nav).
   Same visual language: sticky, blurred, hairline border, scroll progress. */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="site-header sticky top-0 z-50 bg-[var(--nav-background)] backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image src="/logo.png" alt="AR Strategies" width={40} height={40} className="site-logo h-10 w-auto" />
          <span className="font-display text-xl tracking-wide text-[var(--text-primary)]">AR STRATEGIES</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                isActive(link.href)
                  ? 'text-[var(--text-primary)] underline decoration-brand decoration-2 underline-offset-8'
                  : 'hover:text-[var(--text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/work-with-us#apply"
            className="btn-primary hidden md:inline-flex items-center active:scale-[0.97] px-5 py-2 rounded-full text-sm transition-colors"
          >
            Apply Now
          </Link>
          <ThemeToggle />
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="touch-target md:hidden flex flex-col gap-1.5"
          >
            <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] px-6 py-4 flex flex-col gap-4 text-[var(--text-secondary)]">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="hover:text-[var(--text-primary)] transition-colors">
              {link.label}
            </Link>
          ))}
          <Link
            href="/work-with-us#apply"
            onClick={() => setMenuOpen(false)}
            className="btn-primary text-center px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            Apply Now
          </Link>
        </div>
      )}
      <ScrollProgress />
    </nav>
  );
}

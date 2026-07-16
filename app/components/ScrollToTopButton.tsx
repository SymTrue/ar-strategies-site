'use client';

import { useEffect, useState } from 'react';

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.scrollingElement;
      const shell = document.querySelector('.site-shell');
      const top = Math.max(doc?.scrollTop ?? 0, shell?.scrollTop ?? 0, window.scrollY);
      setVisible(top > 560);
    };
    onScroll();
    // Capture phase catches scrolls on nested containers too: .site-shell is
    // a scroll container (its overflow-x clip makes overflow-y compute to
    // auto), so window scroll events alone miss some scrolling.
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 'instant', not 'auto': 'auto' defers to the CSS scroll-behavior, which
    // is smooth on this site, defeating the reduced-motion intent.
    const behavior: ScrollBehavior = reduced ? 'instant' : 'smooth';
    window.scrollTo({ top: 0, behavior });
    document.querySelectorAll('.site-shell').forEach((el) => {
      if (el.scrollTop > 0) el.scrollTo({ top: 0, behavior });
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] backdrop-blur transition-all duration-300 hover:border-brand hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[var(--background)] ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

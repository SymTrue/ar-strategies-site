'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from '../providers';

const MagicDust = dynamic(() => import('./ui/magic-dust').then((m) => m.MagicDust), {
  ssr: false,
});

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

/* Particle band for the about page: the studio's three outcomes assemble
   from dust and scatter again. Decorative, so it renders nothing under
   reduced motion. The canvas sits on a dark panel in both themes because
   the particles use additive blending, which disappears on white. */
export function AboutDust() {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fontFamily, setFontFamily] = useState<'pending' | string>('pending');

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Resolve the hashed next/font family name so the particle rasterizer
    // draws real Anton, then wait for it to actually load: rasterizing
    // before the font arrives would scatter particles into fallback glyphs.
    const probe = document.createElement('span');
    probe.className = 'font-display';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily || 'Impact, sans-serif';
    probe.remove();

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      setFontFamily(family);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-dashed px-6 py-16 md:py-24" aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        <p className="text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)] mb-6" style={mono}>
          Fig. 02, The three jobs of local marketing
        </p>
        <div className="relative h-[380px] md:h-[440px] rounded-lg border border-[var(--border)] overflow-hidden bg-[#0a0806]">
          {reduced ? (
            <div className="flex h-full items-center justify-center px-6">
              <p className="font-display uppercase text-3xl md:text-5xl text-center leading-snug text-balance" style={{ color: '#f97316' }}>
                Get noticed. Get remembered. Get chosen.
              </p>
            </div>
          ) : (
            ready &&
            fontFamily !== 'pending' && (
              <MagicDust
                key={theme}
                sequence={[
                  { type: 'text', text: 'GET NOTICED' },
                  { type: 'text', text: 'GET REMEMBERED' },
                  { type: 'text', text: 'GET CHOSEN' },
                ]}
                particleColor={theme === 'dark' ? '#f97316' : '#fb923c'}
                fontFamily={fontFamily}
                particleCount={7000}
                holdDuration={3.5}
              />
            )
          )}
        </div>
        <p className="mt-6 max-w-xl text-sm text-[var(--text-tertiary)]">
          Everything the studio builds serves one of three jobs: get the business noticed,
          keep it remembered, and make it the obvious choice when the customer decides.
        </p>
      </div>
    </section>
  );
}

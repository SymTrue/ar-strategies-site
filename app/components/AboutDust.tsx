'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from '../providers';
import { usePrefersReducedMotion } from './useClientEnv';
import type { SequenceItem } from './ui/magic-dust';

const MagicDust = dynamic(() => import('./ui/magic-dust').then((m) => m.MagicDust), {
  ssr: false,
});

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

// The three jobs, in the order the brand argues them: a business has to be
// noticed before it can be remembered, and it gets chosen because it is the
// one remembered at the moment of need (see the Mental Availability
// mechanism). The animation, the step row and the reduced-motion fallback
// all read from this one list so they can never drift out of order again.
const JOBS = ['Noticed', 'Remembered', 'Chosen'] as const;

const SEQUENCE: SequenceItem[] = JOBS.map((job) => ({
  type: 'text',
  text: job.toUpperCase(),
  textSize: 20,
}));

const STATIC_SENTENCE = JOBS.map((job) => `Get ${job.toLowerCase()}.`).join(' ');

/* Particle band for the about page: the studio's three outcomes assemble
   from dust and scatter again. The canvas sits on a dark panel in both themes
   because the particles use additive blending, which disappears on white.

   The step row under the panel tracks which job is forming, so a visitor who
   arrives mid-cycle still reads it as one three-part idea rather than a lone
   word. It and the canvas are aria-hidden as visual duplicates; the figure
   label and the caption carry the same meaning for screen readers. (The whole
   section used to be aria-hidden, which also silenced the caption.) */
export function AboutDust() {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();
  const [fontFamily, setFontFamily] = useState<'pending' | string>('pending');
  const [activeJob, setActiveJob] = useState(0);

  useEffect(() => {
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
    <section className="section-dashed px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)] mb-6" style={mono}>
          Fig. 01, The three jobs of local marketing
        </p>
        {/* Shorter on phones: the canvas sizes the word to the panel's width,
            so a narrow panel gets a small word, and at 380px tall most of it
            was empty space. Width-driven, so this changes no word size. */}
        <div
          className="relative h-[280px] sm:h-[380px] md:h-[440px] rounded-lg border border-[var(--border)] overflow-hidden bg-[#07090d]"
          aria-hidden="true"
        >
          {reduced ? (
            <div className="flex h-full items-center justify-center px-6">
              <p className="font-display uppercase text-3xl md:text-5xl text-center leading-snug text-balance" style={{ color: '#7daed4' }}>
                {STATIC_SENTENCE}
              </p>
            </div>
          ) : (
            ready &&
            fontFamily !== 'pending' && (
              <MagicDust
                key={theme}
                sequence={SEQUENCE}
                particleColor={theme === 'dark' ? '#7daed4' : '#a8cbe6'}
                fontFamily={fontFamily}
                particleCount={9000}
                particleSize={0.04}
                holdDuration={3.5}
                onItemChange={setActiveJob}
              />
            )
          )}
        </div>
        <ol className="mt-5 grid grid-cols-3 gap-3 md:gap-6" aria-hidden="true">
          {JOBS.map((job, i) => {
            const active = !reduced && i === activeJob;
            return (
              <li
                key={job}
                data-active={active}
                className="group border-t-2 border-[var(--border)] pt-3 transition-colors duration-300 data-[active=true]:border-[var(--brand)]"
              >
                <span className="block text-[11px] tracking-[0.16em] text-[var(--text-tertiary)]" style={mono}>
                  0{i + 1}
                </span>
                <span
                  className="mt-1 block text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-tertiary)] transition-colors duration-300 group-data-[active=true]:text-[var(--text-primary)]"
                  style={mono}
                >
                  {job}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 max-w-xl text-sm text-[var(--text-tertiary)]">
          Everything the studio builds serves one of three jobs: get the business noticed,
          keep it remembered, and make it the obvious choice when the customer decides.
        </p>
      </div>
    </section>
  );
}

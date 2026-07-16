'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

interface Question {
  text: string;
  fix: string;
}

interface Surface {
  code: string;
  name: string;
  hint: string;
  questions: Question[];
}

const SURFACES: Surface[] = [
  {
    code: 'S1',
    name: 'Search result',
    hint: 'Google your main service plus your area. Find your listing. Look at it the way a stranger scanning ten results would.',
    questions: [
      {
        text: 'Does the title say what you do and where, not just your name?',
        fix: 'Rewrite the page title: service and area first, brand name second.',
      },
      {
        text: 'Does the description give a reason to click, not a slogan?',
        fix: 'Replace the slogan with one specific, checkable claim.',
      },
      {
        text: 'Would it stand out next to the results above and below it?',
        fix: 'Add the one detail competitors can’t copy: hours, niche, or proof.',
      },
    ],
  },
  {
    code: 'S2',
    name: 'Google profile',
    hint: 'Open your Business Profile as a customer sees it on Maps. First photo, category line, latest review.',
    questions: [
      {
        text: 'Is the first photo real, recent, and yours, not a logo or stock?',
        fix: 'Lead with a real interior or team photo. Save the logo for last.',
      },
      {
        text: 'Do the category and description name your exact niche?',
        fix: 'Set the most specific primary category that honestly fits.',
      },
      {
        text: 'Has a review been answered within the last two weeks?',
        fix: 'Reply to every review. Prospects read your replies, not just the stars.',
      },
    ],
  },
  {
    code: 'S3',
    name: 'Homepage',
    hint: 'Load your site on a phone. Everything above the fold, before any scrolling, is the surface being judged.',
    questions: [
      {
        text: 'Is there one sentence a stranger could repeat back?',
        fix: 'Write one line above the fold: who it’s for plus the outcome.',
      },
      {
        text: 'Is there exactly one obvious next step, not three competing buttons?',
        fix: 'Demote secondary actions to quiet links. One primary button.',
      },
      {
        text: 'Could they tell you apart from the competitor next door?',
        fix: 'Name the thing only you can claim, and lead with it.',
      },
    ],
  },
  {
    code: 'S4',
    name: 'Storefront',
    hint: 'Stand across the street, or pull up your street view. Three seconds of glance, the way traffic actually sees you.',
    questions: [
      {
        text: 'From across the street, does it say what happens inside?',
        fix: 'Put the category on the sign: what you are, not just your name.',
      },
      {
        text: 'Are hours and contact visible without entering?',
        fix: 'Post hours and a phone number at eye level on the door.',
      },
      {
        text: 'Does it look actively run: lighting, cleanliness, current posters?',
        fix: 'Replace anything faded. Dead signage reads as a dead business.',
      },
    ],
  },
];

type Answer = boolean | null;

const VERDICTS = {
  sharp: {
    word: 'Sharp',
    line: 'Strangers can read you. Your three seconds are working, so the next lever is reach, not clarity.',
  },
  leaking: {
    word: 'Leaking',
    line: 'You’re readable in places and invisible in others. Fix the failed surfaces first: they meet customers before the strong ones do.',
  },
  invisible: {
    word: 'Invisible',
    line: 'Your business is clearer in your head than on any surface a customer meets. The good news: every fix below is free.',
  },
} as const;

function YesNo({
  value,
  onChange,
  label,
}: {
  value: Answer;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div
      className="flex shrink-0 rounded-full border border-[var(--border)] overflow-hidden"
      role="group"
      aria-label={label}
    >
      {([true, false] as const).map((v) => {
        const active = value === v;
        return (
          <button
            key={String(v)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(v)}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors duration-150 ${
              active
                ? v
                  ? 'bg-brand text-black font-bold'
                  : 'bg-[var(--text-primary)] text-[var(--background)] font-bold'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
            style={mono}
          >
            {v ? 'Yes' : 'No'}
          </button>
        );
      })}
    </div>
  );
}

export default function ThreeSecondTest() {
  const [answers, setAnswers] = useState<Answer[][]>(
    SURFACES.map((s) => s.questions.map(() => null)),
  );
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [leadState, setLeadState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const setAnswer = (si: number, qi: number, v: boolean) => {
    setAnswers((prev) =>
      prev.map((row, i) => (i === si ? row.map((a, j) => (j === qi ? v : a)) : row)),
    );
  };

  const { answered, score, surfaceScores, fixes } = useMemo(() => {
    let answeredCount = 0;
    let total = 0;
    const perSurface: number[] = [];
    const failedFixes: Array<{ code: string; name: string; fix: string }> = [];
    answers.forEach((row, si) => {
      let s = 0;
      row.forEach((a, qi) => {
        if (a !== null) answeredCount += 1;
        if (a === true) {
          s += 1;
          total += 1;
        }
        if (a === false) {
          failedFixes.push({
            code: SURFACES[si].code,
            name: SURFACES[si].name,
            fix: SURFACES[si].questions[qi].fix,
          });
        }
      });
      perSurface.push(s);
    });
    return { answered: answeredCount, score: total, surfaceScores: perSurface, fixes: failedFixes };
  }, [answers]);

  const complete = answered === 12;
  const verdict = complete
    ? score >= 10
      ? VERDICTS.sharp
      : score >= 6
        ? VERDICTS.leaking
        : VERDICTS.invisible
    : null;

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadState === 'sending') return;
    setLeadState('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, website: honeypot }),
      });
      setLeadState(res.ok ? 'done' : 'error');
    } catch {
      setLeadState('error');
    }
  };

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      <SiteHeader />

      {/* Masthead */}
      <section className="px-6 pt-20 md:pt-28 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="kicker-chip">
              <span className="kicker-n">3s</span>
              <span className="kicker-sep" aria-hidden="true">/</span>
              <span>Free Diagnostic</span>
            </span>
            <span className="kicker-line" style={{ transform: 'scaleX(1)' }} aria-hidden="true" />
          </div>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[1.05] mb-6 text-balance">
            The Three-Second <span className="text-brand">Test</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl text-pretty">
            Strangers give your business about three seconds per surface before deciding
            whether to look closer. This is the same diagnostic that opens every audit we
            run, scored by you, for free.
          </p>

          <div className="mt-10 border border-dashed border-[var(--border)] rounded-lg p-6 md:p-8 max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand mb-4" style={mono}>
              How to run it honestly
            </p>
            <ol className="space-y-2 text-[var(--text-secondary)] text-sm md:text-base list-none">
              <li>
                <span className="text-brand tabular-nums mr-3" style={mono}>1</span>
                Pull up each surface exactly as a customer meets it.
              </li>
              <li>
                <span className="text-brand tabular-nums mr-3" style={mono}>2</span>
                Better: show it to someone who doesn’t know your business for three seconds.
              </li>
              <li>
                <span className="text-brand tabular-nums mr-3" style={mono}>3</span>
                Answer as the stranger, not as the owner. Owners pass every test.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* The instrument */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {SURFACES.map((surface, si) => {
            const done = answers[si].every((a) => a !== null);
            const passed = surfaceScores[si] >= 2;
            return (
              <div
                key={surface.code}
                className="border border-dashed border-[var(--border)] rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-dashed border-[var(--border)]">
                  <div className="flex items-baseline gap-4">
                    <span className="text-brand text-sm tabular-nums" style={mono}>
                      {surface.code}
                    </span>
                    <h2 className="font-display uppercase text-2xl md:text-3xl leading-none">
                      {surface.name}
                    </h2>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-[0.2em] ${
                      done ? (passed ? 'text-brand' : 'text-[var(--text-primary)]') : 'text-[var(--text-tertiary)]'
                    }`}
                    style={mono}
                  >
                    {done ? (passed ? `Pass · ${surfaceScores[si]}/3` : `Fail · ${surfaceScores[si]}/3`) : `${answers[si].filter((a) => a !== null).length}/3 answered`}
                  </span>
                </div>
                <p className="px-6 md:px-8 pt-5 text-sm text-[var(--text-tertiary)] max-w-2xl">
                  {surface.hint}
                </p>
                <div className="px-6 md:px-8 py-5 space-y-4">
                  {surface.questions.map((q, qi) => (
                    <div
                      key={qi}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2"
                    >
                      <p className="text-[var(--text-secondary)] text-base max-w-xl">{q.text}</p>
                      <YesNo
                        value={answers[si][qi]}
                        onChange={(v) => setAnswer(si, qi, v)}
                        label={`${surface.name}: ${q.text}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Readout */}
      <section className="px-6 pb-16" aria-live="polite">
        <div className="max-w-5xl mx-auto border border-[var(--border)] rounded-lg p-6 md:p-10 bg-[var(--surface)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-tertiary)]" style={mono}>
              Readout
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] tabular-nums" style={mono}>
              {answered}/12 answered
            </p>
          </div>

          {/* 12-cell meter */}
          <div className="grid grid-cols-12 gap-1.5 mb-8" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-sm transition-colors duration-300 ${
                  i < score ? 'bg-brand' : 'bg-[var(--border)]'
                }`}
              />
            ))}
          </div>

          {verdict ? (
            <div className="md:flex items-start justify-between gap-10">
              <div>
                <p className="font-display uppercase text-5xl md:text-7xl leading-none mb-4 text-brand">
                  {verdict.word}
                </p>
                <p className="text-[var(--text-secondary)] max-w-xl text-base md:text-lg text-pretty">
                  <span className="text-[var(--text-primary)] font-semibold tabular-nums">{score}/12. </span>
                  {verdict.line}
                </p>
              </div>
              <div className="mt-8 md:mt-0 shrink-0 space-y-2">
                {SURFACES.map((s, i) => (
                  <div key={s.code} className="flex items-center gap-3 text-sm" style={mono}>
                    <span className="text-[var(--text-tertiary)] w-6">{s.code}</span>
                    <div className="flex gap-1" aria-hidden="true">
                      {[0, 1, 2].map((j) => (
                        <span
                          key={j}
                          className={`w-6 h-1.5 rounded-sm ${j < surfaceScores[i] ? 'bg-brand' : 'bg-[var(--border)]'}`}
                        />
                      ))}
                    </div>
                    <span className={surfaceScores[i] >= 2 ? 'text-brand' : 'text-[var(--text-tertiary)]'}>
                      {surfaceScores[i]}/3
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[var(--text-tertiary)] text-base">
              Answer all twelve questions and the verdict prints here.
            </p>
          )}

          {complete && fixes.length > 0 && (
            <div className="mt-10 border-t border-dashed border-[var(--border)] pt-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand mb-5" style={mono}>
                Your fix list, worst first
              </p>
              <ul className="space-y-3">
                {fixes.map((f, i) => (
                  <li key={i} className="flex gap-4 text-sm md:text-base">
                    <span className="text-[var(--text-tertiary)] shrink-0 tabular-nums" style={mono}>
                      {f.code}
                    </span>
                    <span className="text-[var(--text-secondary)]">{f.fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Quiet close */}
      <section className="px-6 pb-24 section-dashed pt-16">
        <div className="max-w-5xl mx-auto md:flex items-start justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="font-display uppercase text-3xl md:text-5xl leading-tight mb-4">
              This was the <span className="text-brand">stranger’s version.</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base md:text-lg text-pretty">
              The audit is the professional one: we run every surface, name what it costs
              you monthly, and hand you the fix order. Free, and there’s no pitch.
            </p>
          </div>
          <div className="mt-8 md:mt-0 w-full max-w-md">
            {leadState === 'done' ? (
              <p className="text-[var(--text-secondary)] border border-dashed border-[var(--border)] rounded-lg p-6">
                Done. Your audit request is in. You’ll hear from us within a day.
              </p>
            ) : (
              <form onSubmit={submitLead} className="space-y-3">
                <label htmlFor="tst-email" className="block text-[10px] uppercase tracking-[0.25em] text-[var(--text-tertiary)]" style={mono}>
                  Where should the audit go?
                </label>
                <input
                  id="tst-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourbusiness.com"
                  className="w-full bg-transparent border border-[var(--border)] rounded-full px-6 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-brand focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  name="website"
                />
                <button
                  type="submit"
                  disabled={leadState === 'sending'}
                  className="btn-primary w-full px-7 py-3.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {leadState === 'sending' ? 'Sending…' : 'Get My Free Audit'}
                </button>
                {leadState === 'error' && (
                  <p className="text-sm text-[var(--text-secondary)]">
                    That didn’t go through. Try again, or email us directly.
                  </p>
                )}
              </form>
            )}
            <p className="mt-4 text-sm text-[var(--text-tertiary)]">
              Prefer to keep reading first? The{' '}
              <Link href="/blog/the-three-second-test" className="text-brand hover:underline">
                field note behind this test
              </Link>{' '}
              explains each surface.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

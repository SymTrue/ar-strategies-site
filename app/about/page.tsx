import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'About AR Strategies — Founder-Led Perception & Attention Studio',
  description:
    'Meet Akbar Ahmad, founder of AR Strategies. The studio helps local businesses become easier to notice, remember, trust, and choose.',
};

const fieldNotes = [
  ['Attention', 'If the market filters you out, nothing downstream matters.'],
  ['Positioning', 'Most businesses sound interchangeable before they ever compete.'],
  ['Memory', 'Customers choose from the names that are easiest to recall.'],
  ['Trust', 'Proof has to be specific enough to survive skepticism.'],
  ['Psychology', 'The sale starts before the customer knows they are deciding.'],
];

const operatingRules = [
  'One business per market, so incentives stay clean.',
  'Every recommendation ties to a number, a search result, or a buying behavior.',
  'Content begins with the mechanism, not the aesthetic.',
  'Ad spend is tested like capital, not treated like rent.',
];

function FounderSignalMap() {
  return (
    <svg
      viewBox="0 0 760 420"
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Founder operating map connecting field work, psychology, rankings, ads, and content."
    >
      <defs>
        <linearGradient id="aboutTrace" x1="80" y1="40" x2="690" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-light)" />
          <stop offset="0.55" stopColor="var(--brand)" />
          <stop offset="1" stopColor="var(--brand-dark)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="758" height="418" rx="8" stroke="var(--border)" strokeDasharray="6 8" />
      <g stroke="var(--text-tertiary)" strokeWidth="0.7" opacity="0.22">
        {Array.from({ length: 13 }).map((_, index) => (
          <path key={`v-${index}`} d={`M${60 + index * 54} 32V388`} />
        ))}
        {Array.from({ length: 7 }).map((_, index) => (
          <path key={`h-${index}`} d={`M42 ${58 + index * 54}H718`} />
        ))}
      </g>
      <path
        d="M104 308 C170 196 238 156 326 196 C426 244 451 92 554 126 C632 152 651 230 670 310"
        stroke="url(#aboutTrace)"
        strokeWidth="2"
      />
      <path
        d="M118 118 C222 86 295 110 338 172 C403 264 489 252 618 184"
        stroke="var(--text-tertiary)"
        strokeWidth="1"
        strokeDasharray="5 7"
        opacity="0.55"
      />
      {[
        [104, 308, 'FIELD'],
        [326, 196, 'INSIGHT'],
        [554, 126, 'SYSTEM'],
        [670, 310, 'MARKET'],
      ].map(([x, y, label]) => (
        <g key={label}>
          <circle cx={x} cy={y} r="23" fill="var(--background)" stroke="var(--brand)" />
          <circle cx={x} cy={y} r="6" fill="var(--brand)" className="node-pulse" />
          <text
            x={x}
            y={Number(y) + 44}
            textAnchor="middle"
            fill="var(--text-primary)"
            style={{ font: '600 11px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.16em' }}
          >
            {label}
          </text>
        </g>
      ))}
      <g fill="var(--text-tertiary)" style={{ font: '500 10px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.14em' }}>
        <text x="52" y="48">FOUNDER OPERATING MAP</text>
        <text x="546" y="384">PERCEPTION → ATTENTION → CHOICE</text>
      </g>
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="site-shell min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader />

      <main>
        <section className="px-6 pb-14 pt-20 md:pb-20 md:pt-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <span className="kicker-chip">
                  <span className="kicker-n">About</span>
                  <span className="kicker-sep" aria-hidden="true">/</span>
                  <span>Founder Led</span>
                </span>
                <span className="kicker-line" style={{ transform: 'scaleX(1)' }} aria-hidden="true" />
              </div>
              <h1 className="font-display max-w-4xl text-5xl uppercase leading-[0.98] md:text-7xl">
                Built for businesses that should be obvious, but are still invisible.
              </h1>
            </div>
            <div className="border-l border-dashed border-[var(--border)] pl-6">
              <p className="text-xl leading-relaxed text-[var(--text-secondary)]">
                AR Strategies is run by Akbar Ahmad, a founder/operator who studies how people notice,
                remember, trust, and choose local businesses. The studio sits between marketing execution
                and behavioral strategy: search, ads, content, proof, and positioning all engineered as one system.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-7xl">
            <FounderSignalMap />
          </div>
        </section>

        <section className="section-dashed px-6 py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <aside>
              <div className="sticky top-28">
                <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                  <Image src="/logo.png" alt="" width={56} height={56} className="site-logo h-14 w-auto" />
                </div>
                <h2 className="font-display text-4xl uppercase">Akbar Ahmad</h2>
                <p className="mt-2 text-brand">Founder, AR Strategies</p>
                <p className="mt-5 max-w-sm text-[var(--text-secondary)]">
                  Built Strike Den from no meaningful online presence to the top local search position in six months,
                  then turned the lessons into a repeatable studio model.
                </p>
                <a
                  href="https://www.linkedin.com/in/akbararstrats/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-brand transition hover:border-brand"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </aside>

            <div className="space-y-10">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-tertiary)]">Why the studio exists</p>
                <p className="mt-5 text-2xl leading-snug text-[var(--text-primary)]">
                  Local businesses usually do not lose because they are bad. They lose because the market has no clear
                  mental file for them. AR Strategies builds that file: the search result, the ad, the proof, the post,
                  and the phrase customers remember.
                </p>
              </div>

              <div className="grid gap-3">
                {fieldNotes.map(([pillar, note], index) => (
                  <div key={pillar} className="grid gap-4 border-b border-dashed border-[var(--border)] py-5 md:grid-cols-[90px_160px_1fr]">
                    <span className="text-sm text-brand" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                      0{index + 1}
                    </span>
                    <h3 className="font-display text-2xl uppercase">{pillar}</h3>
                    <p className="text-[var(--text-secondary)]">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-dashed px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand">Operating rules</p>
                <h2 className="font-display mt-4 max-w-xl text-4xl uppercase leading-tight md:text-5xl">
                  The discipline behind the work.
                </h2>
              </div>
              <div className="grid gap-4">
                {operatingRules.map((rule, index) => (
                  <div key={rule} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                    <span className="text-xs text-brand" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                      RULE {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-3 text-lg text-[var(--text-secondary)]">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-dashed px-6 py-16 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display max-w-2xl text-4xl uppercase leading-tight md:text-5xl">
                Theory is useful only when it changes what the market does next.
              </h2>
              <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
                See the mechanisms behind the studio model, then request the audit when you want them applied to your market.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/mechanisms" className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-brand">
                Explore Mechanisms
              </Link>
              <Link href="/#contact" className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold">
                Get My Free Audit
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

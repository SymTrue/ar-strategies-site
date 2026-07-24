import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { AboutDust } from '../components/AboutDust';

export const metadata: Metadata = {
  title: 'About AR Strategies: Marketing Agency for Local Businesses',
  description:
    'Meet Akbar Ahmad, founder of AR Strategies. The studio helps local businesses become easier to notice, remember, trust, and choose.',
  alternates: { canonical: '/about' },
};

const fieldNotes = [
  ['Attention', "If customers can't find you, nothing else you do matters."],
  ['Positioning', 'Most businesses sound the same, so customers pick on price.'],
  ['Memory', 'Customers pick the name they remember first, not the best one.'],
  ['Trust', "Proof has to be specific, or nobody believes it."],
  ['Psychology', "The sale starts before the customer knows they're choosing."],
];

const operatingRules = [
  'One business per market. We never work with your competitor.',
  'Every recommendation ties to a real number: a ranking, a lead, or a sale.',
  "Content starts with what makes customers act, not what looks pretty.",
  "We test every ad dollar and cut what doesn't bring in customers.",
];

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

const founderPath = [
  ['01', 'In the field', 'Took Strike Den from no online presence to the #1 gym in its city.'],
  ['02', 'Found what works', 'Learned what actually makes local customers notice and choose.'],
  ['03', 'Built a system', 'Turned those lessons into a repeatable playbook, not guesswork.'],
  ['04', 'Your market', 'Now runs that same playbook for local businesses like yours.'],
];

function FounderPath() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)]" style={mono}>
          Fig. 02, How one gym&apos;s playbook became a studio
        </p>
        <span className="hidden text-[11.5px] uppercase tracking-[0.16em] text-brand sm:block" style={mono}>
          Field → System → Your market
        </span>
      </div>
      <div className="relative">
        <span
          className="absolute left-[12.5%] right-[12.5%] top-[18px] hidden h-px bg-[var(--border)] md:block"
          aria-hidden="true"
        />
        <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          {founderPath.map(([n, title, body]) => (
            <li key={n} className="flex items-start gap-4 md:flex-col md:items-center md:gap-5 md:text-center">
              <span
                className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand bg-[var(--background)] text-sm text-brand"
                style={mono}
              >
                {n}
              </span>
              <div>
                <h3 className="font-display mb-2 text-lg uppercase md:text-xl">{title}</h3>
                <p className="max-w-[30ch] text-sm leading-relaxed text-[var(--text-secondary)] md:mx-auto">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="site-shell min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader />

      <main id="main-content">
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
                AR Strategies is run by Akbar Ahmad. He studies why customers pick one local business
                over another, then builds the marketing that makes yours the pick. Search, ads, and
                content don&apos;t run as separate jobs. They work as one system, so your business is the
                one people find first, remember, and call.
              </p>
            </div>
          </div>
        </section>

        <AboutDust />

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
                  Took Strike Den from no online presence to the #1 gym in its city in six months, then built
                  those lessons into a repeatable system for other local businesses.
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
                  Most local businesses don&apos;t lose because they&apos;re bad at what they do. They lose because
                  customers never think of them. We fix that: the search result, the ad, the proof, and the words
                  people remember, so when they&apos;re ready to buy, they call you first.
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
                <p className="text-xs uppercase tracking-[0.22em] text-brand">How we work</p>
                <h2 className="font-display mt-4 max-w-xl text-4xl uppercase leading-tight md:text-5xl">
                  The rules we don&apos;t break.
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
          <div className="mx-auto max-w-7xl">
            <FounderPath />
          </div>
        </section>

        <section className="section-dashed px-6 py-16 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display max-w-2xl text-4xl uppercase leading-tight md:text-5xl">
                Ideas only matter when they bring in customers.
              </h2>
              <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
                See the psychology behind the work, then put it to work for your business.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/mechanisms" className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-brand">
                Explore Mechanisms
              </Link>
              <Link href="/work-with-us#apply" className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold">
                Apply to Work With Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

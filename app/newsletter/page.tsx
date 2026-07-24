import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { NewsletterSignupForm } from '../components/NewsletterSignupForm';

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

export const metadata: Metadata = {
  title: 'The Weekly Fix: AR Strategies',
  description:
    'One specific fix for local businesses every week: real examples, exact steps, five minutes to read. Free. Here is a real issue, not a promise.',
  alternates: { canonical: '/newsletter' },
};

export default function NewsletterPage() {
  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      <SiteHeader />

      <main id="main-content">
      {/* Masthead */}
      <header className="px-6 pt-16 md:pt-24 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="kicker-chip">
              <span className="kicker-n">Free</span>
              <span className="kicker-sep" aria-hidden="true">/</span>
              <span>The Weekly Fix</span>
            </span>
            <span className="kicker-line" style={{ transform: 'scaleX(1)' }} aria-hidden="true" />
          </div>
          <h1 className="font-display uppercase text-4xl md:text-6xl leading-[1.06] mb-6 text-balance">
            One fix a week. <span className="text-brand">This is one of them.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl text-pretty mb-10">
            Not a pitch for the newsletter. The newsletter itself. Real example, exact steps, five
            minutes to read. Every week, free, straight to your inbox.
          </p>
          <NewsletterSignupForm placement="newsletter_page_top" />
          <p className="mt-4 text-sm text-[var(--text-tertiary)]">
            Free forever. One email a week, unsubscribe anytime.
          </p>
        </div>
      </header>

      {/* Sample issue */}
      <article className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-tertiary)] mb-6 border-t border-dashed border-[var(--border)] pt-10" style={mono}>
            <span className="text-brand">Issue 01</span>
            <span>Trust Pillar</span>
            <span>5 min read</span>
          </div>
          <h2 className="font-display uppercase text-3xl md:text-4xl leading-tight mb-8 text-balance">
            The address mismatch quietly costing you rankings
          </h2>

          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-pretty">
            Search your business name and city on Google right now. Open every result that comes
            up: your Google profile, your Facebook page, your Yelp listing, any directory that
            mentions you. Now compare the address and phone number on each one, character by
            character.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-pretty">
            Most owners find at least one mismatch. An old suite number nobody updated after a
            move. A phone number format that reads &ldquo;(555) 123-4567&rdquo; on one listing and
            &ldquo;555-123-4567&rdquo; on another. A Yelp page still showing the address from three
            years ago.
          </p>

          <h3 className="font-display uppercase text-xl md:text-2xl leading-tight mt-12 mb-5">
            Why Google cares about a typo you don&apos;t
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-pretty">
            Google can&apos;t call your business to confirm it&apos;s real. It infers trust from
            agreement: if every listing across the web states the same name, address, and phone
            number, that consistency reads as a verified, stable business. If they disagree,
            Google has to guess which one is current, and businesses that are hard to verify rank
            behind businesses that aren&apos;t. This isn&apos;t a minor technical detail. It is one
            of the signals local search uses to decide who shows up first.
          </p>

          <h3 className="font-display uppercase text-xl md:text-2xl leading-tight mt-12 mb-5">
            The ten-minute fix
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-pretty">
            Search &ldquo;[your business name] [your city]&rdquo; and open every result on the
            first two pages, not just the map pack. List every listing that surfaces: Google
            Business Profile, Facebook, Yelp, Apple Maps, Bing Places, any industry-specific
            directory. Write down the name, address, and phone number exactly as each one displays
            it.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-pretty">
            Pick the version on your Google Business Profile as the source of truth, since that is
            the listing carrying the most weight. Then go update every other listing to match it
            exactly: same abbreviations, same punctuation, same suite formatting. Start with
            whichever listing ranks highest in your search results besides Google itself. That is
            usually Yelp or Facebook, and it is usually the oldest, most out-of-date one.
          </p>

          <h3 className="font-display uppercase text-xl md:text-2xl leading-tight mt-12 mb-5">
            What this doesn&apos;t fix
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-pretty">
            Matching your details everywhere won&apos;t rank a business with no reviews above one
            with two hundred, and it won&apos;t save a Google profile in the wrong category. What it
            does is remove a quiet drag on trust that most businesses carry without knowing it. Ten
            minutes, no cost, done once.
          </p>

          <div className="mt-14 border border-dashed border-[var(--border)] rounded-lg p-6 md:p-8">
            <p className="text-[11.5px] uppercase tracking-[0.16em] text-brand mb-3" style={mono}>
              Next issue
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Every week, one more fix like this one lands in the inbox of everyone on the list.
              No filler, no pitch buried in the middle. Join free below.
            </p>
          </div>
        </div>
      </article>

      {/* Bottom signup + apply path */}
      <section className="px-6 py-16 md:py-24 section-dashed section-premium">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display uppercase text-3xl md:text-5xl leading-tight mb-6 text-balance">
            Get the next one.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
            Free, one email a week, unsubscribe anytime.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterSignupForm placement="newsletter_page_bottom" />
          </div>
          <p className="text-[var(--text-tertiary)] text-sm mt-8">
            Want it done for you instead?{' '}
            <Link href="/work-with-us" className="text-[var(--text-secondary)] underline decoration-brand/60 underline-offset-4 hover:text-[var(--text-primary)] transition-colors">
              Apply to work with us
            </Link>
            .
          </p>
        </div>
      </section>

      </main>
      <SiteFooter />
    </div>
  );
}

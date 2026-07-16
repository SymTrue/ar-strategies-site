import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { posts } from './posts';

export const metadata: Metadata = {
  title: 'Field Notes: AR Strategies',
  description:
    'Observations on attention, positioning, and memory from auditing 50+ local businesses. Why customers notice some businesses and filter out the rest.',
  alternates: { canonical: '/blog' },
};

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

export default function BlogIndex() {
  const [featured, ...rest] = posts;

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      <SiteHeader />

      {/* Masthead */}
      <section className="px-6 pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="kicker-chip">
              <span className="kicker-n">{String(posts.length).padStart(2, '0')}</span>
              <span className="kicker-sep" aria-hidden="true">/</span>
              <span>Field Notes</span>
            </span>
            <span className="kicker-line" style={{ transform: 'scaleX(1)' }} aria-hidden="true" />
          </div>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[1.05] mb-6 max-w-4xl text-balance">
            Field <span className="text-brand">Notes</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl text-pretty">
            Observations from the audit floor. Why customers notice some businesses,
            remember fewer, and choose almost none. Written for owners, not marketers.
          </p>
        </div>
      </section>

      {/* Featured note */}
      <section className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block border border-dashed border-[var(--border)] rounded-lg p-8 md:p-14 hover:border-brand/60 transition-colors relative overflow-hidden"
          >
            <div className="flex items-center gap-4 text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-tertiary)] mb-6" style={mono}>
              <span className="text-brand">Latest</span>
              <span>{featured.dateLabel}</span>
              <span>{featured.category}</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="font-display uppercase text-3xl md:text-5xl leading-[1.08] max-w-3xl mb-6 group-hover:text-brand transition-colors text-balance">
              {featured.title}
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl text-base md:text-lg mb-8 text-pretty">
              {featured.standfirst}
            </p>
            <span className="inline-flex items-center gap-3 text-brand text-sm font-semibold">
              Read the note
              <span className="transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Index rows */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-dashed border-[var(--border)]">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[90px_1fr_220px_auto] items-center gap-5 md:gap-8 py-8 md:py-10 border-b border-dashed border-[var(--border)] transition-colors hover:bg-[var(--surface)]"
              >
                <span className="text-brand tabular-nums text-sm" style={mono}>
                  {String(i + 2).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-display uppercase text-xl md:text-3xl leading-tight group-hover:text-brand transition-colors text-balance">
                    {post.title}
                  </span>
                  <span className="hidden md:block text-sm text-[var(--text-tertiary)] mt-2 max-w-xl">
                    {post.standfirst}
                  </span>
                </span>
                <span className="hidden md:flex flex-col items-end gap-1 text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-tertiary)]" style={mono}>
                  <span>{post.dateLabel}</span>
                  <span>{post.category} · {post.readTime}</span>
                </span>
                <span className="text-brand text-2xl transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-16 md:py-24 section-dashed">
        <div className="max-w-7xl mx-auto md:flex items-end justify-between gap-10">
          <div>
            <h2 className="font-display uppercase text-3xl md:text-5xl leading-tight mb-4 max-w-2xl">
              Reading is diagnosis. <span className="text-brand">The audit is treatment.</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl">
              We will show you exactly where your business is invisible, and what it costs you monthly.
            </p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0 shrink-0">
            <Link href="/#contact" className="btn-primary px-7 py-3.5 rounded-full text-sm font-semibold transition-colors">
              Get My Free Audit
            </Link>
            <Link href="/mechanisms" className="px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--border)] hover:border-brand transition-colors">
              Watch the Explainers
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

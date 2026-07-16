import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import { getPost, posts } from '../posts';

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Field Notes: AR Strategies' };
  return {
    title: `${post.title}: AR Strategies`,
    description: post.standfirst,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.findIndex((p) => p.slug === slug);
  const next = posts[(index + 1) % posts.length];

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      <SiteHeader />

      {/* Article header */}
      <header className="px-6 pt-16 md:pt-24 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-10">
            <Link href="/blog" className="hover:text-brand transition-colors">Field Notes</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--text-primary)]">{post.category}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-tertiary)] mb-6" style={mono}>
            <span className="text-brand">{post.pillar} Pillar</span>
            <span>{post.dateLabel}</span>
            <span>{post.readTime} read</span>
          </div>
          <h1 className="font-display uppercase text-4xl md:text-6xl leading-[1.06] mb-8 text-balance">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed border-l-2 border-brand pl-5 text-pretty">
            {post.standfirst}
          </p>
        </div>
      </header>

      {/* Body */}
      <article className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          {post.sections.map((section, i) => (
            <section key={i} className={i > 0 ? 'mt-12' : ''}>
              {section.heading && (
                <h2 className="font-display uppercase text-2xl md:text-3xl leading-tight mb-6 flex items-baseline gap-4">
                  <span className="text-brand text-sm tabular-nums" style={mono}>
                    {String(i).padStart(2, '0')}
                  </span>
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-[var(--text-secondary)] leading-relaxed mb-6 text-pretty">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* Related mechanism */}
          {post.relatedMechanism && (
            <Link
              href={`/mechanisms/${post.relatedMechanism.id}`}
              className="group mt-14 flex items-center justify-between gap-6 border border-dashed border-[var(--border)] rounded-lg p-6 md:p-8 hover:border-brand/60 transition-colors"
            >
              <div>
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-tertiary)] mb-2" style={mono}>
                  Watch the mechanism
                </p>
                <p className="font-display uppercase text-xl md:text-2xl group-hover:text-brand transition-colors">
                  {post.relatedMechanism.name}
                </p>
              </div>
              <span className="text-brand text-2xl transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </article>

      {/* Next note + CTA */}
      <section className="px-6 py-14 md:py-20 section-dashed">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-tertiary)] mb-4" style={mono}>
            Next note
          </p>
          <Link href={`/blog/${next.slug}`} className="group block mb-12">
            <span className="font-display uppercase text-2xl md:text-4xl leading-tight group-hover:text-brand transition-colors text-balance">
              {next.title}
            </span>
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link href="/#contact" className="btn-primary px-7 py-3.5 rounded-full text-sm font-semibold transition-colors">
              Get My Free Audit
            </Link>
            <Link href="/blog" className="px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--border)] hover:border-brand transition-colors">
              All Field Notes
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

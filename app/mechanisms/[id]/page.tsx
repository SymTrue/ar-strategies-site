'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import { mechanismsData, mechanismTakeaways } from '../mechanisms-data';

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

export default function MechanismPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mechanism = mechanismsData[id];

  if (!mechanism) {
    notFound();
  }

  const takeaway = mechanismTakeaways[id];
  const whyWorksParagraphs = mechanism.whyWorks.split('\n\n');

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader />
      <main id="main-content">
      {/* Breadcrumb */}
      <div className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Link href="/mechanisms" className="hover:text-brand transition-colors">
              Mechanisms
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]">{mechanism.name}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="kicker-chip">
              <span className="kicker-n">{mechanism.pillar}</span>
              <span className="kicker-sep" aria-hidden="true">/</span>
              <span>Pillar</span>
            </span>
            <span className="kicker-line" style={{ transform: 'scaleX(1)' }} aria-hidden="true" />
          </div>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[1.05] mb-6 max-w-4xl text-balance">
            {mechanism.fullTitle}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl text-pretty">
            {mechanism.subtitle}
          </p>
        </div>
      </section>

      {/* Video Player */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-video bg-black rounded-lg border border-brand/30 overflow-hidden">
            <video
              controls
              playsInline
              poster={`/videos/posters/${mechanism.id}.jpg`}
              preload="none"
              className="w-full h-full"
            >
              <source src={mechanism.videoFile} type="video/mp4" />
              <track
                kind="captions"
                srcLang="en"
                label="English"
                default
                src={`/videos/captions/${mechanism.id}.vtt`}
              />
              Your browser does not support the video tag.
            </video>
          </div>
          {takeaway && (
            <div className="mt-6 border border-dashed border-[var(--border)] rounded-lg p-6">
              <p className="text-[11.5px] uppercase tracking-[0.16em] text-brand mb-3" style={mono}>
                In one sentence
              </p>
              <p className="text-xl md:text-2xl font-display uppercase leading-snug text-balance">
                {takeaway}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why It Works */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-8">Why This Works</h2>
          <div className="prose prose-invert max-w-[50ch]">
            {whyWorksParagraphs.map((paragraph, i) => (
              <div key={i}>
                {i === mechanism.whyWorksSubheadIndex && (
                  <h3 className="font-display uppercase text-2xl mt-10 mb-4 text-brand">
                    Why it decides purchases
                  </h3>
                )}
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-12">Real Examples</h2>
          <div className="space-y-8">
            {mechanism.examples.map((example, i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-2 text-brand">{example.title}</h3>
                <p className="text-[var(--text-tertiary)] text-sm mb-4">{example.context}</p>
                <p className="text-[var(--text-secondary)] mb-4">{example.explanation}</p>
                <p className="text-brand font-semibold">Result: {example.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use It */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-8">How AR Strategies Uses This</h2>
          <div className="prose prose-invert max-w-[50ch]">
            {mechanism.howWeUseIt.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Related Mechanisms */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-12">Related Mechanisms</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {mechanism.relatedMechanisms.map(related => (
              <Link key={related.id} href={`/mechanisms/${related.id}`}>
                <div className="bg-[var(--surface)] border border-[var(--border)] hover:border-brand hover:bg-white/[0.08] rounded-lg p-6 transition-all cursor-pointer h-full">
                  <h3 className="text-xl font-bold mb-2 text-brand">{related.name}</h3>
                  <p className="text-[var(--text-tertiary)] text-sm">{related.description}</p>
                  <div className="mt-4 text-brand font-semibold flex items-center gap-2">
                    <span>Learn More</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-6">See This in Action</h2>
          <p className="text-[var(--text-secondary)] mb-8 text-lg">
            See how we used these ideas to take a real business from invisible to #1.
          </p>
          <Link
            href="/#strike-den"
            className="btn-primary inline-block px-8 py-4 rounded-full font-bold transition-colors"
          >
            View Case Study
          </Link>
        </div>
      </section>
      </main>
      <SiteFooter />
    </div>
  );
}

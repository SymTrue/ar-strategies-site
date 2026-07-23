'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useReveal, useHeroIntro } from './components/useReveal';
import { AnimatedSection } from './components/AnimatedSection';
import NeuralNet from './components/NeuralNet';
import { ThemeToggle } from './components/ui/theme-toggle';
import { SiteFooter } from './components/SiteFooter';
import { useTheme } from './providers';
import { usePrefersReducedMotion } from '@/lib/hooks';
import {
  IconTile,
  InstagramIcon,
  LinkedInIcon,
  WebsiteIcon,
  ProcessFlow,
  RegMarks,
  FAQTag,
  PrincipleExclusivityIcon,
  PrincipleTransparencyIcon,
  PrincipleNoLockInIcon,
} from './components/home/icons';
import { PrecisionCursor, ScrollProgress } from './components/home/widgets';
import { LeadCaptureForm } from './components/home/LeadCaptureForm';

// Lazy-mount GPU-heavy components below fold, saves 3-4 canvases upfront
const LiquidMetal = dynamic(() => import('./components/ui/liquid-metal'), { ssr: false });

function SectionKicker({ n, label, center }: { n: string; label: string; center?: boolean }) {
  const ref = useInViewClass<HTMLDivElement>();
  return (
    <div ref={ref} data-reveal className={`kicker-root flex items-center gap-4 mb-8 ${center ? 'justify-center' : ''}`}>
      <span className="kicker-chip">
        <span className="kicker-n">{n}</span>
        <span className="kicker-sep" aria-hidden="true">/</span>
        <span>{label}</span>
      </span>
      {!center && <span className="kicker-line" aria-hidden="true" />}
    </div>
  );
}

function useInViewClass<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in-view');
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useScrollSpy(hrefs: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    hrefs.forEach((href) => {
      const el = document.getElementById(href.slice(1));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Work With Us', href: '/work-with-us' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Mechanisms', href: '/mechanisms' },
  { label: 'FAQ', href: '#faq' },
];

const services = [
  {
    icon: 'search',
    title: 'Google Rankings',
    body: 'When someone nearby searches for what you do, they should find you, not the shop down the street. We build the local search presence that puts you at the top of Google and keeps you there.',
  },
  {
    icon: 'megaphone',
    title: 'Meta Ads',
    body: 'Facebook and Instagram ads that turn scrolling locals into booked customers. You see the cost of every lead, and we kill anything that doesn\'t make your phone ring.',
  },
  {
    icon: 'pen',
    title: 'Content That Sells',
    body: 'We audit your listings and social, kill what isn\'t converting, and publish weekly on channels that rank and convert.',
  },
];

const steps = [
  { n: '01', title: 'Map Your Market', body: 'We audit your visibility: where you rank on Google, where your ad money leaks, what your content misses. Plain English, real numbers.' },
  { n: '02', title: 'Build the Engine', body: 'Fix your Google presence, launch Meta campaigns, line up content that sells. Everything pointed at one goal: making your phone ring.' },
  { n: '03', title: 'Test & Kill', body: 'Watch the data daily. Kill what doesn\'t produce customers. Double down on what does. No riding a losing bet to protect a report.' },
  { n: '04', title: 'Own Your Market', body: 'Scale proven winners 3x until you\'re the first name your city sees, and the obvious choice when they\'re ready to buy.' },
];

const principles = [
  {
    icon: 'exclusivity',
    title: 'One business per market',
    body: 'We never work with your competitors. When you\'re our client, your industry in your area is locked. Everything we build works for you and against them.',
  },
  {
    icon: 'transparency',
    title: 'You see every number',
    body: 'Rankings, leads, cost per call, revenue. You own the data, so you always know what\'s working and what to kill next.',
  },
  {
    icon: 'freedom',
    title: 'No lock-in contracts',
    body: "You stay because it's working, not because you signed something. We earn your business every month.",
  },
];

const faqs = [
  {
    q: 'How long until I rank at the top of Google?',
    a: 'It depends on your area and competition. Most clients see movement within the first 30 days; competitive searches take longer. That\'s why we run Meta ads alongside. Customers now, rankings compounding behind them.',
    category: 'timeline' as const,
  },
  {
    q: 'What if you already work with my competitor?',
    a: 'Then we can\'t take you on, and if you sign with us, we can\'t take them. We work with one business per industry per area, so everything we build works for you alone.',
    category: 'service' as const,
  },
  {
    q: 'Do you work with businesses in my industry?',
    a: 'If your customers search Google or scroll social media before they buy, and they do, we can help. We work with local and service businesses across most industries.',
    category: 'service' as const,
  },
  {
    q: 'How much should I be spending on marketing?',
    a: 'It depends on your margins and goals, but we help you start lean, prove what works, then scale. No one should be lighting money on fire hoping something sticks.',
    category: 'pricing' as const,
  },
  {
    q: 'Am I locked into a long contract?',
    a: 'No. We earn your business every month. If we are not making you money, you should not keep paying us.',
    category: 'contract' as const,
  },
];

const CTA_LABEL = 'Apply Now';

export default function Home() {
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useScrollSpy(navLinks.map((l) => l.href));

  const heroRef = useHeroIntro<HTMLDivElement>();
  const servicesRef = useReveal<HTMLDivElement>();
  const processRef = useReveal<HTMLDivElement>();
  const whyRef = useReveal<HTMLDivElement>();
  const quoteRef = useReveal<HTMLDivElement>();
  const faqRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();
  const chartRef = useInViewClass<HTMLDivElement>();

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* Nav */}
      <nav className="site-header sticky top-0 z-50 bg-[var(--nav-background)] backdrop-blur border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#top" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <Image src="/logo.png" alt="AR Strategies" width={40} height={40} className="site-logo h-10 w-auto" />
            <span className="font-display text-xl tracking-wide">AR STRATEGIES</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  activeSection === link.href
                    ? 'text-[var(--text-primary)] underline decoration-brand decoration-2 underline-offset-8'
                    : 'hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/work-with-us#apply"
              className="btn-primary hidden md:inline-flex items-center justify-center min-h-11 active:scale-[0.97] px-5 py-2 rounded-full text-sm transition-colors"
            >
              {CTA_LABEL}
            </a>
            <ThemeToggle />
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="touch-target md:hidden flex flex-col gap-1.5"
            >
              <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-gray-300">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
            <a
              href="/work-with-us#apply"
              onClick={() => setMenuOpen(false)}
              className="btn-primary flex items-center justify-center min-h-11 px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              {CTA_LABEL}
            </a>
          </div>
        )}
        <ScrollProgress />
      </nav>
      <PrecisionCursor />

      <main id="main-content">
      {/* Hero: living neural network beneath the typography */}
      <section id="top" ref={heroRef} className="relative overflow-hidden">
        <NeuralNet theme={theme} reducedMotion={reducedMotion} />
        <div className="hero-overlay absolute inset-0 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
          <div data-intro className="hero-kicker inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-gray-300 mb-8">
            <span className="h-2 w-2 rounded-full bg-brand" /> The Marketing Agency for Local Businesses
          </div>
          <h1 className="font-display hero-display uppercase mb-6 text-balance">
            Be the business your city
            <span className="text-brand"> finds first</span>
          </h1>
          <p data-intro className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-6 text-pretty">
            When locals search for what you do, whoever shows up first gets the call. We put you at the top of Google, run Meta ads that bring real customers, and publish content that turns into calls. Done for you, so the phone rings while you run the business.
          </p>
          <p data-intro className="text-base text-gray-400 max-w-xl mx-auto mb-10">
            Every week we send one specific fix that helps local businesses get found first: real examples, exact steps, five minutes to read. Join free and put it to work.
          </p>

          <LeadCaptureForm
            placement="homepage_hero"
            idPrefix="hero"
            revealAttr="data-intro"
            formClassName="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
            successClassName="text-green-400 mt-4 text-sm"
            errorClassName="text-red-400 mt-4 text-sm"
            noteBelow={
              <p data-intro className="mt-4 text-sm text-[var(--text-tertiary)]">
                Free forever. One email a week, unsubscribe anytime.{' '}
                <Link href="/newsletter" className="underline decoration-brand/60 underline-offset-4 hover:text-[var(--text-secondary)] transition-colors">
                  Read a sample issue
                </Link>
                .
              </p>
            }
          />
          <p data-intro className="mt-6 text-sm text-[var(--text-tertiary)]">
            See what you&apos;ll get first:{' '}
            <Link href="/tools/three-second-test" className="text-gray-300 underline decoration-brand/60 underline-offset-4 hover:text-white transition-colors">
              run the free 3-second test
            </Link>
            . Prefer it done for you?{' '}
            <Link href="/work-with-us" className="text-gray-300 underline decoration-brand/60 underline-offset-4 hover:text-white transition-colors">
              Apply to work with us
            </Link>
            .
          </p>
          <div className="marquee mt-16" aria-hidden="true">
            <div className="marquee-track text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex items-center gap-8 pr-8">
                  {['Found first on Google', 'Calls, not clicks', 'More customers every week', 'Ads that pay for themselves', 'The name your city remembers'].map((t) => (
                    <span key={t} className="flex items-center gap-8 whitespace-nowrap">
                      {t}
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services - divided list, not a card grid */}
      <section id="services" ref={servicesRef} className="py-24 md:py-32 px-6 section-premium">
        <div className="max-w-4xl mx-auto">
          <SectionKicker n="01" label="Services" />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-4">
            The work we do, so you don&apos;t have to.
          </h2>
          <p data-reveal className="text-[var(--text-secondary)] max-w-xl mb-16">
            Three services, one outcome: your phone rings and you can see why.
          </p>
          <div className="border-t border-white/10">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="grid md:grid-cols-[1fr_2fr] gap-3 md:gap-12 py-8 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <IconTile name={s.icon} />
                    <h3 className="font-display text-xl uppercase">{s.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed max-w-[65ch]">{s.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process - horizontal step sequence */}
      <section id="process" ref={processRef} className="py-24 md:py-32 px-6 section-dashed section-premium dense">
        <div className="max-w-7xl mx-auto">
          <SectionKicker n="02" label="Process" />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Our proven process
          </h2>
          <div data-reveal className="max-w-3xl mx-auto mb-12 text-brand hidden lg:block">
            <ProcessFlow />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <AnimatedSection key={step.n} delay={i * 0.08} className="h-full">
                <div className="group relative h-full">
                  {/* Subtle glow on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10" />
                  <div className="relative p-6 glass-card h-full flex flex-col justify-between">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand via-brand to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="font-display text-4xl text-brand font-bold group-hover:text-orange-400 transition-colors">{step.n}</div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-brand to-transparent" />
                      </div>
                      <h3 className="font-display text-lg uppercase font-semibold text-[var(--text-primary)] group-hover:text-brand transition-colors">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{step.body}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" ref={whyRef} className="py-24 md:py-32 px-6 section-dashed section-premium">
        <div className="max-w-7xl mx-auto">
          <SectionKicker n="03" label="Why Us" />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Why we&apos;re different
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {principles.map((p, idx) => (
              <AnimatedSection key={p.title} delay={idx * 0.1} className="h-full">
                <div className="group relative h-full overflow-hidden glass-card">
                  <RegMarks />
                  {/* Full-card orange glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/40 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                  <div className="relative h-full px-8 py-8">
                    <div className={`absolute top-0 left-0 w-1.5 h-16 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      idx === 0 ? 'bg-gradient-to-b from-brand-light via-brand-light/50' : idx === 1 ? 'bg-gradient-to-b from-brand-dark via-brand-dark/50' : 'bg-gradient-to-b from-brand via-brand/50'
                    } to-transparent`} />
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-brand" style={{ background: 'var(--icon-tile)', border: '1px solid var(--icon-tile-border)' }}>
                      {p.icon === 'exclusivity' && <PrincipleExclusivityIcon />}
                      {p.icon === 'transparency' && <PrincipleTransparencyIcon />}
                      {p.icon === 'freedom' && <PrincipleNoLockInIcon />}
                    </div>
                    <h3 className={`font-display text-xl uppercase mt-5 mb-3 text-[var(--text-primary)] transition-colors ${
                      idx === 0 ? 'group-hover:text-brand-light' : idx === 1 ? 'group-hover:text-brand-dark' : 'group-hover:text-brand'
                    }`}>{p.title}</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">{p.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section ref={quoteRef} className="py-24 md:py-32 px-6 section-dashed section-premium subtle">
        <div className="max-w-4xl mx-auto text-center">
          <h2 data-reveal className="font-display text-4xl md:text-6xl uppercase leading-tight text-balance">
            If they can&apos;t find you,
            <span className="text-brand glow-text-orange"> they buy from someone else.</span>
          </h2>
          <p data-reveal className="text-gray-300 text-lg mt-8 max-w-2xl mx-auto">
            Every search for what you do is a customer deciding where to spend. Every day you&apos;re buried, that decision goes to a competitor. Let&apos;s fix that.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" ref={faqRef} className="py-24 md:py-32 px-6 section-dashed section-premium">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />
        <div className="max-w-3xl mx-auto">
          <SectionKicker n="04" label="FAQ" center />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase text-center mb-16">
            Straight answers
          </h2>
          <AccordionPrimitive.Root type="single" collapsible defaultValue={faqs[0]?.q} className="space-y-3">
            {faqs.map((faq) => (
              <AccordionPrimitive.Item key={faq.q} value={faq.q} data-reveal className="group relative rounded-2xl overflow-hidden transition-colors duration-300">
                {/* Subtle glow on hover / open */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/30 to-transparent opacity-0 transition-opacity duration-300 blur-lg -z-10 group-hover:opacity-50 group-data-[state=open]:opacity-100" />

                <div className="glass-card">
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="w-full flex justify-between items-start gap-4 text-left px-6 py-4 transition-colors">
                      <div className="flex-1">
                        <div className="mb-2">
                          <FAQTag category={faq.category} />
                        </div>
                        <span className="font-semibold text-base md:text-lg text-gray-200 group-hover:text-white transition-colors">{faq.q}</span>
                      </div>
                      <span className="text-brand text-xl leading-none transition-transform duration-300 shrink-0 mt-1 group-data-[state=open]:rotate-45" aria-hidden="true">+</span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content forceMount className="grid transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <div className="px-6 pb-4 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </AccordionPrimitive.Content>
                </div>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </div>
      </section>

      {/* Social Proof - Featured Case Study */}
      <section className="py-24 md:py-32 px-6 section-dashed section-premium">
        <div className="max-w-6xl mx-auto">
          <h2 data-reveal className="font-display text-3xl md:text-4xl uppercase mb-16 text-center">The real proof</h2>

          {/* Featured Case Study: Strike Den */}
          <div className="mb-20">
            <AnimatedSection delay={0}>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand/40 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10" />
                <div className="relative p-8 md:p-12 glass-card">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div>
                      <div className="inline-block px-4 py-2 mb-6 text-xs font-semibold bg-gradient-to-r from-brand to-brand/70 text-white rounded-full border border-brand/50">Case Study</div>
                      <h3 className="font-display text-2xl md:text-3xl uppercase mb-4 text-brand">Strike Den MMA</h3>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Took them from zero online presence to #1 for MMA gyms in DHA Karachi. Scaled Instagram from 0 to 1.4K followers. Revenue went from breaking even to over 1 million PKR per month.
                      </p>
                      <div className="space-y-3 mb-8 text-gray-300">
                        <p><span className="text-brand font-semibold">#1 ranking</span> achieved in 6 months</p>
                        <p><span className="text-brand font-semibold">1.4K followers</span> on Instagram</p>
                        <p><span className="text-brand font-semibold">1M+ PKR/month</span> in revenue</p>
                        <p><span className="text-brand font-semibold">5.0 star</span> reviews</p>
                      </div>
                      <blockquote className="border-l-2 border-brand pl-6 py-4 italic text-gray-300">
                        &ldquo;We started with zero followers, zero online presence. Akbar handled everything: SEO, ads, content strategy. In 6 months we hit #1 for MMA gyms in DHA. Our revenue went from breaking even to over 1 million PKR a month. This is what real marketing looks like.&rdquo;
                      </blockquote>
                      <p className="text-sm text-gray-400 mt-4">Sikander Ali Shah, Owner, Strike Den</p>
                    </div>
                    <div className="hidden md:flex flex-col gap-8">
                      {/* #1 Ranking Card with Logo */}
                      <div className="group relative h-full overflow-hidden glass-card border border-brand/30">
                        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />}>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                            <LiquidMetal
                              colorBack="#00000000"
                              colorTint="#ea580c"
                              shape="circle"
                              repetition={1}
                              softness={0.7}
                              distortion={0.2}
                              speed={0.6}
                              angle={45}
                              scale={2}
                              fit="cover"
                              style={{ position: "absolute", inset: 0 }}
                            />
                          </div>
                        </Suspense>
                        <div className="relative p-8 text-center">
                          <div className="inline-block mb-4">
                            <Image
                              src="/logo-strike-den.png"
                              alt="Strike Den"
                              width={80}
                              height={80}
                              className="rounded-lg"
                            />
                          </div>
                          <p className="text-brand font-display text-3xl font-bold mb-2">#1 Ranking</p>
                          <p className="text-gray-400 text-sm">Achieved in 6 months</p>
                          <p className="text-gray-300 text-xs mt-4 font-semibold">STRIKE DEN MMA</p>
                          <p className="text-gray-400 text-xs mt-1">DHA, Karachi</p>
                        </div>
                      </div>

                      {/* Rank trajectory: blueprint chart, position 50+ -> #1 in 6 months */}
                      <div ref={chartRef} className="glass-card border border-brand/30 p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                            Fig. 02: Google position, 6 months
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.2em] text-brand" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                            &quot;MMA gym DHA&quot;
                          </span>
                        </div>
                        <svg viewBox="0 0 320 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Line chart: Google ranking position improving from unranked to number 1 over six months">
                          {/* Grid + axis labels */}
                          <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.2">
                            <line x1="36" y1="28" x2="304" y2="28" />
                            <line x1="36" y1="77" x2="304" y2="77" />
                            <line x1="36" y1="126" x2="304" y2="126" />
                            <line x1="36" y1="150" x2="304" y2="150" />
                          </g>
                          <g fill="var(--text-tertiary)" style={{ font: '500 8.5px ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                            <text x="30" y="31" textAnchor="end">#1</text>
                            <text x="30" y="80" textAnchor="end">20</text>
                            <text x="30" y="129" textAnchor="end">40</text>
                            <text x="36" y="170" textAnchor="middle">M0</text>
                            <text x="125" y="170" textAnchor="middle">M2</text>
                            <text x="215" y="170" textAnchor="middle">M4</text>
                            <text x="304" y="170" textAnchor="middle">M6</text>
                          </g>
                          {/* Trajectory: draws in when scrolled into view */}
                          <path className="chart-line" d="M36 150 L81 120 L125 85 L170 60 L215 43 L259 33 L304 28" stroke="var(--brand)" strokeWidth="1.75" strokeLinejoin="round" />
                          <g fill="var(--brand)">
                            <circle className="chart-dot" cx="36" cy="150" r="2.5" />
                            <circle className="chart-dot" cx="81" cy="120" r="2.5" />
                            <circle className="chart-dot" cx="125" cy="85" r="2.5" />
                            <circle className="chart-dot" cx="170" cy="60" r="2.5" />
                            <circle className="chart-dot" cx="215" cy="43" r="2.5" />
                            <circle className="chart-dot" cx="259" cy="33" r="2.5" />
                          </g>
                          {/* Terminal node: the #1 result, lands after the line completes */}
                          <g className="chart-terminal-node">
                            <circle cx="304" cy="28" r="8" stroke="var(--brand)" strokeWidth="1" opacity="0.5" />
                            <circle cx="304" cy="28" r="3.5" fill="var(--brand)" className="node-pulse" />
                            <text x="292" y="18" textAnchor="end" fill="var(--brand)" style={{ font: '600 9px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.1em' }}>RANKED #1</text>
                          </g>
                        </svg>
                      </div>

                      {/* Social Media CTA Buttons */}
                      <div className="flex flex-col gap-3">
                        <a href="https://strikeden.com" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-lg bg-brand/20 hover:bg-brand/30 border border-brand/50 hover:border-brand transition-colors duration-300">
                          <div className="relative inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand">
                            <WebsiteIcon />
                            Website
                          </div>
                        </a>
                        <a href="https://www.instagram.com/strikeden.pk" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-lg bg-brand/20 hover:bg-brand/30 border border-brand/50 hover:border-brand transition-colors duration-300">
                          <div className="relative inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand">
                            <InstagramIcon />
                            Instagram
                          </div>
                        </a>
                        <a href="https://www.linkedin.com/company/strike-den/" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-lg bg-brand/20 hover:bg-brand/30 border border-brand/50 hover:border-brand transition-colors duration-300">
                          <div className="relative inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand">
                            <LinkedInIcon />
                            LinkedIn
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Supporting Metrics */}
          <div className="text-center mb-12">
            <p data-reveal className="text-gray-400 text-lg">And many more local businesses like them.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <AnimatedSection delay={0}>
                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-16 p-8 md:p-10 border border-white/10 hover:border-brand/40 transition-colors">
                  <div className="shrink-0 flex items-center justify-center bg-gradient-to-br from-brand/20 to-transparent rounded-lg border border-brand/30 px-6 py-4">
                    <span className="font-display text-3xl text-brand">50+</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase mb-2">Audits Completed</h3>
                    <p className="text-gray-400 leading-relaxed max-w-[60ch]">Every audit begins the same way: we find the money they&apos;re leaving on the table. Most businesses have no idea how invisible they are for their best-buying searches.</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="mb-10">
              <AnimatedSection delay={0.1}>
                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-16 p-8 md:p-10 border border-white/10 hover:border-brand/40 transition-colors">
                  <div className="shrink-0 flex items-center justify-center bg-gradient-to-br from-brand/20 to-transparent rounded-lg border border-brand/30 px-6 py-4">
                    <span className="font-display text-2xl text-brand whitespace-nowrap">$2K-$8K</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase mb-2">Average Monthly Waste</h3>
                    <p className="text-gray-400 leading-relaxed max-w-[60ch]">Across our audits, the average local business wastes thousands every month on ads that don&apos;t ring the phone. The money is there. It is just pointed in the wrong direction.</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={0.2}>
              <div className="flex flex-col md:flex-row items-start gap-6 md:gap-16 p-8 md:p-10 border border-white/10 hover:border-brand/40 transition-colors">
                <div className="shrink-0 flex items-center justify-center bg-gradient-to-br from-brand/20 to-transparent rounded-lg border border-brand/30 px-6 py-4">
                  <span className="font-display text-3xl text-brand">30</span>
                </div>
                <div>
                  <h3 className="font-display text-xl uppercase mb-2">Days to First Results</h3>
                  <p className="text-gray-400 leading-relaxed max-w-[60ch]">Most clients see movement within the first month. Meta ads bring customers immediately. Google rankings compound behind them. You&apos;re never waiting on just one channel.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" ref={ctaRef} className="py-24 md:py-32 px-6 section-dashed section-premium relative">
        {/* Large orange glow field behind CTA */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-brand/30 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <SectionKicker n="05" label="The Weekly Fix" center />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-6 text-balance">
            One fix a week. A phone that rings more.
          </h2>
          <p data-reveal className="text-lg text-gray-300 mb-12 max-w-xl mx-auto">
            Every week: one specific way local businesses get found first, with real examples and exact steps you can copy. Free, five minutes to read, yours to keep.
          </p>

          <LeadCaptureForm
            placement="homepage_footer"
            idPrefix="cta"
            revealAttr="data-reveal"
            formClassName="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-6"
            successClassName="text-green-400 text-sm"
            errorClassName="text-red-400 text-sm"
          />
          <p className="text-[var(--text-tertiary)] text-xs mt-4">
            Free forever. One email a week, unsubscribe anytime.{' '}
            <Link href="/newsletter" className="underline decoration-brand/60 underline-offset-4 hover:text-gray-300 transition-colors">
              Read a sample issue
            </Link>
            .
          </p>
          <p className="text-[var(--text-tertiary)] text-sm mt-8">
            Want it done for you instead?{' '}
            <Link href="/work-with-us" className="text-gray-300 underline decoration-brand/60 underline-offset-4 hover:text-white transition-colors">
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

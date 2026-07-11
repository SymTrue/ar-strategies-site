'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useSyncExternalStore, Suspense } from 'react';
import { useReveal, useHeroIntro } from './components/useReveal';
import { AnimatedSection } from './components/AnimatedSection';
import AnimatedGradient from './components/ui/animated-gradient';
import LiquidMetal from './components/ui/liquid-metal';
import { ThemeToggle } from './components/ui/theme-toggle';
import { useTheme } from './providers';

/* Inline Lucide-style icons (24×24 grid, 2px stroke, rounded caps — MIT, no
   external asset so nothing to hotlink and nothing for the CSP to block). */
const svgBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

const icons: Record<string, React.ReactNode> = {
  // Google Rankings — magnifier
  search: (<svg {...svgBase}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>),
  // Meta Ads — megaphone
  megaphone: (<svg {...svgBase}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>),
  // Content — pencil
  pen: (<svg {...svgBase}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>),
  // No lock-in — open padlock
  unlock: (<svg {...svgBase}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>),
  // Full visibility — bar chart
  chart: (<svg {...svgBase}><line x1="4" y1="20" x2="4" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="20" y1="20" x2="20" y2="14" /></svg>),
  // One business per market — map pin
  pin: (<svg {...svgBase}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>),
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

function IconTile({ name }: { name: string }) {
  return (
    <span
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-brand"
      style={{ background: 'var(--icon-tile)', border: '1px solid var(--icon-tile-border)' }}
    >
      {icons[name]}
    </span>
  );
}

function SectionKicker({ n, label, center }: { n: string; label: string; center?: boolean }) {
  return (
    <div data-reveal className={`flex items-center gap-3 mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)] ${center ? 'justify-center' : ''}`}>
      <span className="h-px w-8 bg-brand" />
      <span className="text-brand tabular-nums">{n}</span>
      <span>{label}</span>
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

function TimelineWithFill() {
  const timelineRef = useInViewClass<HTMLDivElement>();
  return (
    <div ref={timelineRef} className="timeline-track hidden lg:block" aria-hidden="true">
      <div className="timeline-fill" />
    </div>
  );
}

function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          raf = requestAnimationFrame(() => setVal(to));
          return;
        }
        const t0 = performance.now();
        const dur = 900;
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{val}{suffix}
    </span>
  );
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
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Why Us', href: '#why' },
  { label: 'FAQ', href: '#faq' },
];

const services = [
  {
    icon: 'search',
    title: 'Google Rankings',
    body: 'When someone nearby searches for what you do, they should find you—not the shop down the street. We build the local search presence that puts you at the top of Google and keeps you there.',
  },
  {
    icon: 'megaphone',
    title: 'Meta Ads',
    body: 'Facebook and Instagram ads that turn scrolling locals into booked customers. You see the cost of every lead, and we kill anything that doesn\'t make your phone ring.',
  },
  {
    icon: 'pen',
    title: 'Content That Sells',
    body: 'We audit what you\'re putting out, cut what isn\'t working, and shape content that makes locals remember you—and choose you when they\'re ready to buy.',
  },
];

const steps = [
  { n: '01', title: 'Map Your Market', body: 'We audit your visibility: where you rank on Google, where your ad money leaks, what your content misses. Plain English, real numbers.' },
  { n: '02', title: 'Build the Engine', body: 'Fix your Google presence, launch Meta campaigns, line up content that sells—everything pointed at one goal: making your phone ring.' },
  { n: '03', title: 'Test & Kill', body: 'Watch the data daily. Kill what doesn\'t produce customers. Double down on what does. No riding a losing bet to protect a report.' },
  { n: '04', title: 'Own Your Market', body: 'Scale what works until you\'re the first name your city sees—and the obvious choice when they\'re ready to buy.' },
];

const principles = [
  {
    icon: 'pin',
    title: 'One business per market',
    body: 'We never work with your competitors. When you\'re our client, your industry in your area is locked—everything we build works for you and against them.',
  },
  {
    icon: 'chart',
    title: 'You see every number',
    body: 'Rankings, leads, cost per call, revenue. Full visibility into what your money is doing, always—no mystery reports.',
  },
  {
    icon: 'unlock',
    title: 'No lock-in contracts',
    body: "You stay because it's working, not because you signed something. We earn your business every month.",
  },
];

const faqs = [
  {
    q: 'How long until I rank at the top of Google?',
    a: 'It depends on your area and competition. Most clients see movement within the first 30 days; competitive searches take longer. That\'s why we run Meta ads alongside—customers now, rankings compounding behind them.',
  },
  {
    q: 'What if you already work with my competitor?',
    a: 'Then we can\'t take you on—and if you sign with us, we can\'t take them. We work with one business per industry per area, so everything we build works for you alone.',
  },
  {
    q: 'Do you work with businesses in my industry?',
    a: 'If your customers search Google or scroll social media before they buy—and they do—we can help. We work with local and service businesses across most industries.',
  },
  {
    q: 'How much should I be spending on marketing?',
    a: 'It depends on your margins and goals, but we help you start lean, prove what works, then scale. No one should be lighting money on fire hoping something sticks.',
  },
  {
    q: 'Am I locked into a long contract?',
    a: 'No. We earn your business every month. If we are not making you money, you should not keep paying us.',
  },
];

const CTA_LABEL = 'Get My Free Audit';

type LeadFormState = 'idle' | 'loading' | 'success' | 'error';

function useLeadForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<LeadFormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      // Check honeypot before submitting
      const form = e.currentTarget as HTMLFormElement;
      const websiteField = form.querySelector('input[name="website"]') as HTMLInputElement;
      if (websiteField && websiteField.value.trim() !== '') {
        setState('success');
        setEmail('');
        return;
      }

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: '' }),
      });
      if (!res.ok) throw new Error('failed');
      setState('success');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  return { email, setEmail, state, handleSubmit };
}

export default function Home() {
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const hero = useLeadForm();
  const cta = useLeadForm();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useScrollSpy(navLinks.map((l) => l.href));

  const heroRef = useHeroIntro<HTMLDivElement>();
  const servicesRef = useReveal<HTMLDivElement>();
  const processRef = useReveal<HTMLDivElement>();
  const whyRef = useReveal<HTMLDivElement>();
  const quoteRef = useReveal<HTMLDivElement>();
  const faqRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
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
              href="#contact"
              className="btn-primary hidden md:inline-flex items-center active:scale-[0.97] px-5 py-2 rounded-full text-sm transition-colors"
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
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary text-center px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              {CTA_LABEL}
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="top" ref={heroRef} className="relative overflow-hidden">
        <Suspense fallback={<div className={theme === 'light' ? 'absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-200/80 to-white' : 'absolute inset-0 bg-gradient-to-br from-black via-orange-900/20 to-black'} />}>
          <AnimatedGradient
            config={theme === 'light'
              ? { preset: 'custom', color1: '#ffffff', color2: '#ffedd5', color3: '#ea580c', shape: 'Edge', rotation: -18, proportion: 44, softness: 100, speed: reducedMotion ? 0 : 9, distortion: 26, swirl: 55 }
              : { preset: 'custom', color1: '#0b0806', color2: '#7a2e00', color3: '#f97316', shape: 'Edge', rotation: -18, proportion: 46, softness: 100, speed: reducedMotion ? 0 : 12, distortion: 32, swirl: 60 }}
            radius="0px"
            style={{ position: "absolute", inset: 0 }}
          />
        </Suspense>
        <div className="hero-overlay absolute inset-0 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
          <div data-intro className="hero-kicker inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-gray-300 mb-8">
            <span className="h-2 w-2 rounded-full bg-brand" /> The Marketing Agency for Local Businesses
          </div>
          <h1 data-intro className="font-display hero-display uppercase mb-6 text-balance">
            Be the business your city
            <span className="text-brand"> finds first</span>
          </h1>
          <p data-intro className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-6 text-pretty">
            When locals search for what you do, whoever shows up first gets the call. We put you at the top of Google, run Meta ads that bring real customers, and sharpen your content—done for you, so your phone rings while you run the business.
          </p>
          <p data-intro className="text-base text-gray-400 max-w-xl mx-auto mb-10">
            Most owners we audit are invisible for their best-buying searches—and waste $2K–$8K a month on ads that don&apos;t ring the phone.
          </p>

          <form data-intro onSubmit={hero.handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <label htmlFor="hero-email" className="sr-only">Email address</label>
            <input
              id="hero-email"
              type="email"
              value={hero.email}
              onChange={(e) => hero.setEmail(e.target.value)}
              placeholder="name@email.com"
              required
              disabled={hero.state === 'loading'}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition disabled:opacity-50"
            />
            {/* Honeypot field - hidden from users, prevents automated form submission */}
            <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button
              type="submit"
              disabled={hero.state === 'loading'}
              className="btn-primary active:scale-[0.97] px-7 py-3.5 rounded-full transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {hero.state === 'loading' ? 'Sending' : 'Get My Free Audit'}
            </button>
          </form>
          {hero.state === 'success' && (
            <p className="text-green-400 mt-4 text-sm">Got it. We&apos;ll send your audit within 24 hours—no pressure, no cold calls.</p>
          )}
          {hero.state === 'error' && (
            <p className="text-red-400 mt-4 text-sm">
              Something went wrong. Email us directly at{' '}
              <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
            </p>
          )}
          <p className="text-gray-500 text-xs mt-6">No credit card required. Includes our Local Visibility Checklist ($47 value).</p>
          <div className="marquee mt-16" aria-hidden="true">
            <div className="marquee-track text-xs uppercase tracking-[0.25em] text-gray-500">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex items-center gap-8 pr-8">
                  {['Invisible on Google', 'Page-two rankings', 'Ads with no calls', 'Content nobody sees', 'Competitors found first'].map((t) => (
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
      <section id="services" ref={servicesRef} className="py-24 px-6 section-premium">
        <div className="max-w-4xl mx-auto">
          <SectionKicker n="01" label="Services" />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            The work we do. So you stop doing it.
          </h2>
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
      <section id="process" ref={processRef} className="py-24 px-6 border-t border-white/10 section-premium dense">
        <div className="max-w-7xl mx-auto">
          <SectionKicker n="02" label="Process" />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Our proven process
          </h2>
          <TimelineWithFill />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <AnimatedSection key={step.n} delay={i * 0.08} className="h-full">
                <div className="group relative h-full">
                  {/* Subtle glow on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10" />
                  <div className="relative p-6 glass-card h-full flex flex-col justify-between">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand via-brand to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

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
      <section id="why" ref={whyRef} className="py-24 px-6 border-t border-white/10 section-premium">
        <div className="max-w-7xl mx-auto">
          <SectionKicker n="03" label="Why Us" />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Why we&apos;re different
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {principles.map((p, idx) => (
              <AnimatedSection key={p.title} delay={idx * 0.1} className="h-full">
                <div className="group relative h-full overflow-hidden glass-card">
                  {/* Full-card orange glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/40 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                  {/* Liquid metal background effect — each card flows in its own direction */}
                  <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                      <LiquidMetal
                        colorBack="#00000000"
                        colorTint="#ea580c"
                        shape="circle"
                        repetition={2}
                        softness={0.6}
                        distortion={0.3}
                        speed={0.8}
                        angle={[0, 180, 90][idx]}
                        scale={2.4}
                        fit="cover"
                        style={{ position: "absolute", inset: 0 }}
                      />
                    </div>
                  </Suspense>

                  <div className="relative h-full px-8 py-8">
                    <div className={`absolute top-0 left-0 w-1.5 h-16 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      idx === 0 ? 'bg-gradient-to-b from-brand-light via-brand-light/50' : idx === 1 ? 'bg-gradient-to-b from-brand-dark via-brand-dark/50' : 'bg-gradient-to-b from-brand via-brand/50'
                    } to-transparent`} />
                    <IconTile name={p.icon} />
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
      <section ref={quoteRef} className="py-24 px-6 border-t border-white/10 section-premium subtle">
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
      <section id="faq" ref={faqRef} className="py-24 px-6 border-t border-white/10 section-premium">
        <div className="max-w-3xl mx-auto">
          <SectionKicker n="04" label="FAQ" center />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase text-center mb-16">
            Straight answers
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} data-reveal className="group relative rounded-2xl overflow-hidden transition-all duration-300">
                {/* Subtle glow on hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-brand/30 to-transparent opacity-0 transition-all duration-300 blur-lg -z-10 ${openFaq === i ? 'opacity-100' : 'group-hover:opacity-50'}`} />

                <div className="glass-card">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full flex justify-between items-center text-left px-6 py-4 transition-colors"
                  >
                    <span className="font-semibold text-base md:text-lg text-gray-200 group-hover:text-white transition-colors">{faq.q}</span>
                    <span className={`text-brand text-xl leading-none transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="px-6 pb-4 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 border-t border-white/10 section-premium">
        <div className="max-w-5xl mx-auto text-center">
          <h2 data-reveal className="font-display text-3xl md:text-4xl uppercase mb-16">Trusted by local businesses winning their markets</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection delay={0}>
              <div className="group relative h-full">
                {/* Large orange glow field */}
                <div className="absolute -inset-1 bg-gradient-to-br from-brand/40 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl -z-10" />
                <div className="relative px-8 py-12 glass-card group-hover:glow-orange-lg">
                  <div className="inline-block px-4 py-2 mb-6 text-xs font-semibold bg-gradient-to-r from-brand to-brand/70 text-white rounded-full border border-brand/50">Metric</div>
                  <div className="text-6xl font-display text-brand mb-4 font-bold group-hover:text-orange-400 transition-colors">50+</div>
                  <p className="text-gray-400 text-sm">Audits completed this year</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand/40 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl -z-10" />
                <div className="relative px-8 py-12 glass-card group-hover:glow-orange-lg">
                  <div className="inline-block px-4 py-2 mb-6 text-xs font-semibold bg-gradient-to-r from-brand to-brand/70 text-white rounded-full border border-brand/50">Impact</div>
                  <div className="text-5xl font-display text-brand mb-4 font-bold group-hover:text-orange-400 transition-colors"><CountUp to={2} prefix="$" suffix="K" />–<CountUp to={8} prefix="$" suffix="K" /></div>
                  <p className="text-gray-400 text-sm">Monthly waste found per audit</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand/40 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl -z-10" />
                <div className="relative px-8 py-12 glass-card group-hover:glow-orange-lg">
                  <div className="inline-block px-4 py-2 mb-6 text-xs font-semibold bg-gradient-to-r from-brand to-brand/70 text-white rounded-full border border-brand/50">Timeline</div>
                  <div className="text-6xl font-display text-brand mb-4 font-bold group-hover:text-orange-400 transition-colors"><CountUp to={30} /> days</div>
                  <p className="text-gray-400 text-sm">Average time to first results</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" ref={ctaRef} className="py-24 px-6 border-t border-white/10 section-premium relative">
        {/* Large orange glow field behind CTA */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-brand/30 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <SectionKicker n="05" label="Free Audit" center />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-6 text-balance">
            See exactly why customers aren&apos;t finding you.
          </h2>
          <p data-reveal className="text-lg text-gray-300 mb-12 max-w-xl mx-auto">
            Get a free visibility audit: where you rank on Google, where your ad money leaks, and what your content is missing. We hand you the playbook—you decide what to do with it.
          </p>

          <form data-reveal onSubmit={cta.handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-6">
            <label htmlFor="cta-email" className="sr-only">Email address</label>
            <input
              id="cta-email"
              type="email"
              value={cta.email}
              onChange={(e) => cta.setEmail(e.target.value)}
              placeholder="name@email.com"
              required
              disabled={cta.state === 'loading'}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition disabled:opacity-50"
            />
            <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button
              type="submit"
              disabled={cta.state === 'loading'}
              className="btn-primary active:scale-[0.97] px-7 py-3.5 rounded-full transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {cta.state === 'loading' ? 'Sending' : 'Get My Free Audit'}
            </button>
          </form>
          {cta.state === 'success' && (
            <p className="text-green-400 text-sm">Got it. We&apos;ll send your audit within 24 hours—no pressure, no cold calls.</p>
          )}
          {cta.state === 'error' && (
            <p className="text-red-400 text-sm">
              Something went wrong. Email us directly at{' '}
              <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
            </p>
          )}
          <p className="text-gray-500 text-xs mt-4">No credit card required. Includes our Local Visibility Checklist ($47 value).</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer border-t border-white/10 py-14 px-6 brand-watermark">
        <div className="max-w-7xl mx-auto relative z-10 mb-14">
          <p className="font-display uppercase leading-[0.95] text-[clamp(2.5rem,6vw,5rem)] text-balance">
            Stop being <span className="text-brand">ignored.</span>
          </p>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="AR Strategies" width={36} height={36} className="site-logo h-9 w-auto" />
              <span className="font-display text-lg tracking-wide">AR STRATEGIES</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We help local businesses get found first on Google, run Meta ads that pay for themselves, and publish content people remember.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">Process</a></li>
                <li><a href="#why" className="hover:text-white transition-colors">Why Us</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4 text-sm uppercase tracking-wide">Connect</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="https://instagram.com/ar_strats.aa" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="mailto:hello@arstrategists.com" className="hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 AR Strategies. All rights reserved.</p>
          <p className="font-display uppercase tracking-wide text-gray-400">Dominate your market.</p>
        </div>
      </footer>
    </div>
  );
}

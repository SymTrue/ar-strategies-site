'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, useSyncExternalStore, Suspense } from 'react';
import { useReveal, useHeroIntro } from './components/useReveal';
import { AnimatedSection } from './components/AnimatedSection';
import NeuralNet from './components/NeuralNet';
import { ThemeToggle } from './components/ui/theme-toggle';
import { useTheme } from './providers';

// Lazy-mount GPU-heavy components below fold — saves 3-4 canvases upfront
const LiquidMetal = dynamic(() => import('./components/ui/liquid-metal'), { ssr: false });

/* Inline Lucide-style icons (24×24 grid, 2px stroke, rounded caps: MIT, no
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
  // Google Rankings: location + magnifier (local search positioning)
  search: (<svg {...svgBase}><circle cx="11" cy="11" r="6" /><path d="m16 16 5 5" /><path d="M12 7v8m-4-4h8" /></svg>),
  // Meta Ads: megaphone + play (social ad conversion)
  megaphone: (<svg {...svgBase}><path d="M3 11l6-3v10l-6-3v-4m13-6v14m0-14l4-2v18l-4-2" /><path d="M8 13l-2 1m0-4l2 1" /></svg>),
  // Content That Sells: target + checkmark (conversion-focused content)
  pen: (<svg {...svgBase}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="2" /><path d="m15 9 3-3m-6 9 4 4" /></svg>),
  // No lock-in: open padlock
  unlock: (<svg {...svgBase}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>),
  // Full visibility: bar chart
  chart: (<svg {...svgBase}><line x1="4" y1="20" x2="4" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="20" y1="20" x2="20" y2="14" /></svg>),
};

// Social Icons: Instagram, LinkedIn, Website (24×24px Lucide-style)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37" fill="currentColor" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const WebsiteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Process Flow Component: Visual representation of 4-step process
const ProcessFlow = () => (
  <svg viewBox="0 0 1000 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" aria-hidden>
    <defs>
      <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Connection line */}
    <line x1="80" y1="60" x2="920" y2="60" stroke="url(#processGrad)" strokeWidth="2" />
    {/* Step circles and labels */}
    {[1, 2, 3, 4].map((n) => {
      const x = 80 + (n - 1) * 280;
      return (
        <g key={n}>
          <circle cx={x} cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x={x} y="68" textAnchor="middle" className="text-xs font-bold fill-current">0{n}</text>
        </g>
      );
    })}
  </svg>
);

// Hero Section Accent Pattern (Phase 3)
/* Registration corner marks: technical drawing accents on hover */
const RegMarks = () => (
  <div className="reg-marks" aria-hidden="true">
    <span /><span /><span /><span />
  </div>
);

/* Precision cursor: trailing ring that responds to interactive elements.
   Fine pointers only; hidden for touch and reduced motion via CSS. */
function PrecisionCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const ring = ringRef.current;
    if (!ring) return;

    let raf = 0;
    let targetX = -100;
    let targetY = -100;
    let x = targetX;
    let y = targetY;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      ring.classList.add('is-visible');
      const interactive = (e.target as Element | null)?.closest?.('a, button, input, [role="button"]');
      ring.classList.toggle('is-active', !!interactive);
    };
    const onLeave = () => ring.classList.remove('is-visible');

    const tick = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ringRef} className="precision-ring" aria-hidden="true" />;
}

/* Scroll progress hairline under the nav: scrolling communicates progression */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}

// Client Success Badge (Phase 3)
const FAQTag = ({ category }: { category: 'timeline' | 'pricing' | 'service' | 'contract' }) => {
  const colors = {
    timeline: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    pricing: 'bg-green-500/20 border-green-500/50 text-green-400',
    service: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    contract: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
  };
  const labels = {
    timeline: 'Timeline',
    pricing: 'Pricing',
    service: 'Service',
    contract: 'Contract',
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[category]}`}>
      {labels[category]}
    </span>
  );
};

// Premium Principle Icons for Why Us section
const PrincipleExclusivityIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="exclusivityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Shield shape */}
    <path d="M32 8 L48 16 L48 34 Q48 48 32 56 Q16 48 16 34 L16 16 Z" fill="url(#exclusivityGrad)" />
    {/* Checkmark inside shield */}
    <path d="M26 34 L30 38 L38 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {/* Border glow */}
    <path d="M32 8 L48 16 L48 34 Q48 48 32 56 Q16 48 16 34 L16 16 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

const PrincipleTransparencyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="transparencyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Eye shape */}
    <ellipse cx="32" cy="32" rx="20" ry="16" fill="url(#transparencyGrad)" opacity="0.2" />
    <path d="M12 32 Q32 18 52 32 Q32 46 12 32" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Iris */}
    <circle cx="32" cy="32" r="8" fill="url(#transparencyGrad)" />
    {/* Pupil */}
    <circle cx="32" cy="32" r="4" fill="currentColor" />
    {/* Highlight */}
    <circle cx="34" cy="30" r="1.5" fill="white" />
  </svg>
);

const PrincipleNoLockInIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Contract/document - solid outline */}
    <rect x="16" y="14" width="32" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" />
    {/* Document lines */}
    <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    {/* Large X breaking through borders (freedom breaking free) */}
    <line x1="10" y1="6" x2="54" y2="58" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="54" y1="6" x2="10" y2="58" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

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
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Why Us', href: '#why' },
  { label: 'About', href: '/about' },
  { label: 'Mechanisms', href: '/mechanisms' },
  { label: 'Blog', href: '/blog' },
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
  const chartRef = useInViewClass<HTMLDivElement>();

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
        <ScrollProgress />
      </nav>
      <PrecisionCursor />

      {/* Hero: living neural network beneath the typography */}
      <section id="top" ref={heroRef} className="relative overflow-hidden">
        <NeuralNet theme={theme} reducedMotion={reducedMotion} />
        <div className="hero-overlay absolute inset-0 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
          <div data-intro className="hero-kicker inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-gray-300 mb-8">
            <span className="h-2 w-2 rounded-full bg-brand" /> The Marketing Agency for Local Businesses
          </div>
          <h1 data-intro className="font-display hero-display uppercase mb-6 text-balance">
            Be the business your city
            <span className="text-brand"> finds first</span>
          </h1>
          <p data-intro className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-6 text-pretty">
            When locals search for what you do, whoever shows up first gets the call. We put you at the top of Google, run Meta ads that bring real customers, and sharpen your content. Done for you, so your phone rings while you run the business.
          </p>
          <p data-intro className="text-base text-gray-400 max-w-xl mx-auto mb-10">
            In 2026, we audited 50+ local businesses. Most were invisible for their best-buying searches and wasted $2K-$8K a month on ads that didn&apos;t ring the phone.
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
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/50 transition disabled:opacity-50"
            />
            {/* Honeypot field - hidden from users, prevents automated form submission */}
            <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button
              type="submit"
              aria-label="Get my free audit"
              disabled={hero.state === 'loading'}
              className="btn-primary active:scale-[0.97] px-7 py-3.5 rounded-full transition-colors whitespace-nowrap disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
            >
              {hero.state === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending
                </span>
              ) : (
                'Get My Free Audit'
              )}
            </button>
          </form>
          {hero.state === 'success' && (
            <p className="text-green-400 mt-4 text-sm" role="alert">Got it. We&apos;ll send your audit within 24 hours, no pressure, no cold calls.</p>
          )}
          {hero.state === 'error' && (
            <p className="text-red-400 mt-4 text-sm" role="alert">
              Something went wrong. Email us directly at{' '}
              <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
            </p>
          )}
          <div className="marquee mt-16" aria-hidden="true">
            <div className="marquee-track text-xs uppercase tracking-[0.25em] text-gray-500">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex items-center gap-8 pr-8">
                  {['Found first on Google', 'Calls, not clicks', 'Booked-out weekends', 'Ads that pay for themselves', 'The name your city remembers'].map((t) => (
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

                  {/* Liquid metal background effect: each card flows in its own direction */}
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
        <div className="max-w-3xl mx-auto">
          <SectionKicker n="04" label="FAQ" center />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase text-center mb-16">
            Straight answers
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} data-reveal className="group relative rounded-2xl overflow-hidden transition-colors duration-300">
                {/* Subtle glow on hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-brand/30 to-transparent opacity-0 transition-opacity duration-300 blur-lg -z-10 ${openFaq === i ? 'opacity-100' : 'group-hover:opacity-50'}`} />

                <div className="glass-card">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full flex justify-between items-start gap-4 text-left px-6 py-4 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="mb-2">
                        <FAQTag category={faq.category} />
                      </div>
                      <span className="font-semibold text-base md:text-lg text-gray-200 group-hover:text-white transition-colors">{faq.q}</span>
                    </div>
                    <span className={`text-brand text-xl leading-none transition-transform duration-300 shrink-0 mt-1 ${openFaq === i ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
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
                          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
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
                          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                              <LiquidMetal
                                colorBack="#00000000"
                                colorTint="#ea580c"
                                shape="circle"
                                repetition={1}
                                softness={0.8}
                                distortion={0.15}
                                speed={0.5}
                                angle={0}
                                scale={1.5}
                                fit="cover"
                                style={{ position: "absolute", inset: 0 }}
                              />
                            </div>
                          </Suspense>
                          <div className="relative inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand">
                            <WebsiteIcon />
                            Website
                          </div>
                        </a>
                        <a href="https://www.instagram.com/strikeden.pk" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-lg bg-brand/20 hover:bg-brand/30 border border-brand/50 hover:border-brand transition-colors duration-300">
                          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                              <LiquidMetal
                                colorBack="#00000000"
                                colorTint="#ea580c"
                                shape="circle"
                                repetition={1}
                                softness={0.8}
                                distortion={0.15}
                                speed={0.5}
                                angle={90}
                                scale={1.5}
                                fit="cover"
                                style={{ position: "absolute", inset: 0 }}
                              />
                            </div>
                          </Suspense>
                          <div className="relative inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand">
                            <InstagramIcon />
                            Instagram
                          </div>
                        </a>
                        <a href="https://www.linkedin.com/company/strike-den/" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-lg bg-brand/20 hover:bg-brand/30 border border-brand/50 hover:border-brand transition-colors duration-300">
                          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                              <LiquidMetal
                                colorBack="#00000000"
                                colorTint="#ea580c"
                                shape="circle"
                                repetition={1}
                                softness={0.8}
                                distortion={0.15}
                                speed={0.5}
                                angle={135}
                                scale={1.5}
                                fit="cover"
                                style={{ position: "absolute", inset: 0 }}
                              />
                            </div>
                          </Suspense>
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
          <SectionKicker n="05" label="Free Audit" center />
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-6 text-balance">
            See exactly why customers aren&apos;t finding you.
          </h2>
          <p data-reveal className="text-lg text-gray-300 mb-12 max-w-xl mx-auto">
            Get a free visibility audit: where you rank on Google, where your ad money leaks, and what your content is missing. We hand you the playbook. You decide what to do with it.
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
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/50 transition disabled:opacity-50"
            />
            <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button
              type="submit"
              aria-label="Get my free audit"
              disabled={cta.state === 'loading'}
              className="btn-primary active:scale-[0.97] px-7 py-3.5 rounded-full transition-colors whitespace-nowrap disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
            >
              {cta.state === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending
                </span>
              ) : (
                'Get My Free Audit'
              )}
            </button>
          </form>
          {cta.state === 'success' && (
            <p className="text-green-400 text-sm" role="alert">Got it. We&apos;ll send your audit within 24 hours, no pressure, no cold calls.</p>
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
              We help local businesses get found first on Google, run Meta ads that pay for themselves, and publish content locals remember and act on.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">Process</a></li>
                <li><a href="#why" className="hover:text-white transition-colors">Why Us</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
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

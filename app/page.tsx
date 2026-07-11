'use client';

import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useReveal, useHeroIntro } from './components/useReveal';
import { AnimatedSection } from './components/AnimatedSection';
import { GlassMorphCard } from './components/GlassMorphCard';
import AnimatedGradient from './components/ui/animated-gradient';
import LiquidMetal from './components/ui/liquid-metal';

const services = [
  {
    title: 'Ad Strategy & Audit',
    body: 'Tear apart your current campaigns. Find where the money is leaking. Build a strategy that actually works for your business.',
  },
  {
    title: 'Campaign Management',
    body: 'Design campaigns and creative built to convert your audience. Setup, targeting, optimization—all aligned to your goals.',
  },
  {
    title: 'Growth & Scaling',
    body: 'Once we find what converts, we scale it predictably. No guessing. Month-over-month revenue growth.',
  },
];

const steps = [
  { n: '01', title: 'Find the Leak', body: 'Tear apart your current campaigns. Find where the money is going, where conversions are dying, and why.' },
  { n: '02', title: 'Build the Engine', body: 'Design strategy and creative built for your audience. Setup, targeting, messaging—all aligned to convert.' },
  { n: '03', title: 'Test Fast', body: 'Launch lean. Watch the data daily. Kill what doesn\'t convert in 48 hours. Double down on winners.' },
  { n: '04', title: 'Scale Predictably', body: 'Pour fuel on what works. Grow your revenue month over month with systems, not guessing.' },
];

const principles = [
  {
    title: 'No lock-in contracts',
    body: "You stay because it's working, not because you signed something. We earn your business every month.",
  },
  {
    title: 'You see every number',
    body: 'Spend, clicks, cost per lead, revenue. Full visibility into what your money is doing, always.',
  },
  {
    title: 'We kill what does not work',
    body: "Fast. No riding a losing campaign to protect a report. If it isn't converting, it's gone.",
  },
];

const faqs = [
  {
    q: 'How much should I be spending on ads?',
    a: 'It depends on your margins and goals, but we help you start lean, prove what works, then scale. No one should be lighting money on fire hoping something sticks.',
  },
  {
    q: 'Do you work with businesses in my industry?',
    a: 'We work with local and service businesses across many industries. If you sell something people want and need more customers, we can likely help.',
  },
  {
    q: 'How long until I see results?',
    a: 'Most campaigns show meaningful signal within the first few weeks. Real scaling happens once we have data to optimize against, usually inside the first 1-2 months.',
  },
  {
    q: 'Am I locked into a long contract?',
    a: 'No. We earn your business every month. If we are not making you money, you should not keep paying us.',
  },
];

const CTA_LABEL = 'Schedule Free Audit';

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
  const hero = useLeadForm();
  const cta = useLeadForm();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#process', label: 'Process' },
    { href: '#why', label: 'Why Us' },
    { href: '#faq', label: 'FAQ' },
  ];

  const heroRef = useHeroIntro<HTMLDivElement>();
  const servicesRef = useReveal<HTMLDivElement>();
  const processRef = useReveal<HTMLDivElement>();
  const whyRef = useReveal<HTMLDivElement>();
  const quoteRef = useReveal<HTMLDivElement>();
  const faqRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#top" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <Image src="/logo.png" alt="AR Strategies" width={40} height={40} className="h-10 w-auto" />
            <span className="font-display text-xl tracking-wide">AR STRATEGIES</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="hidden md:inline-block bg-brand hover:bg-orange-700 active:scale-[0.97] px-5 py-2 rounded-full font-semibold text-sm transition"
          >
            {CTA_LABEL}
          </a>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
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
              className="bg-brand text-center px-5 py-2.5 rounded-full font-semibold text-sm"
            >
              {CTA_LABEL}
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="top" ref={heroRef} className="relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-black via-orange-900/20 to-black" />}>
          <AnimatedGradient
            config={{ preset: "custom", color1: "#0a0a0a", color2: "#1a0f00", color3: "#ea580c", speed: 12, distortion: 35, swirl: 70 }}
            radius="0px"
            style={{ position: "absolute", inset: 0 }}
          />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
          <div data-intro className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-widest text-gray-300 mb-8">
            <span className="h-2 w-2 rounded-full bg-brand" /> Advertising Agency Built for Growth
          </div>
          <h1 data-intro className="font-display text-5xl md:text-6xl leading-[0.95] uppercase mb-6 text-balance">
            Advertising that actually
            <span className="text-brand"> makes money</span>
          </h1>
          <p data-intro className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-6 text-pretty">
            Most businesses burn thousands on ads with no strategy. We build systems that turn spend into trackable revenue.
          </p>
          <p data-intro className="text-base text-gray-400 max-w-xl mx-auto mb-10">
            Typical clients discover $2K–$8K monthly ad spend waste in their first audit.
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
              className="bg-brand hover:bg-orange-700 active:scale-[0.97] px-7 py-3.5 rounded-full font-semibold transition whitespace-nowrap disabled:opacity-60"
            >
              {hero.state === 'loading' ? 'Sending' : 'Get My Free Audit'}
            </button>
          </form>
          {hero.state === 'success' && (
            <p className="text-green-400 mt-4 text-sm">Got it. We'll send your audit within 24 hours—no pressure, no cold calls.</p>
          )}
          {hero.state === 'error' && (
            <p className="text-red-400 mt-4 text-sm">
              Something went wrong. Email us directly at{' '}
              <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
            </p>
          )}
          <p className="text-gray-500 text-xs mt-6">No credit card required. Includes our Ad Waste Checklist ($47 value).</p>
        </div>
      </section>

      {/* Services - divided list, not a card grid */}
      <section id="services" ref={servicesRef} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            The work we do. So you stop doing it.
          </h2>
          <div className="border-t border-white/10">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="grid md:grid-cols-[1fr_2fr] gap-3 md:gap-12 py-8 border-b border-white/10">
                  <h3 className="font-display text-xl uppercase">{s.title}</h3>
                  <p className="text-gray-300 leading-relaxed max-w-[65ch]">{s.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process - horizontal step sequence */}
      <section id="process" ref={processRef} className="py-24 px-6 border-t border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Our proven process
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/15">
            {steps.map((step, i) => (
              <AnimatedSection key={step.n} delay={i * 0.08}>
                <div className="group pt-6 relative">
                  {/* Gradient accent on hover */}
                  <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-brand to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="space-y-3">
                    <div className="inline-block">
                      <div className="font-display text-5xl text-brand mb-1 font-bold group-hover:text-orange-400 transition-colors">{step.n}</div>
                      <div className="h-0.5 w-12 bg-gradient-to-r from-brand to-transparent" />
                    </div>
                    <h3 className="font-display text-base md:text-lg uppercase font-semibold text-white group-hover:text-brand transition-colors">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{step.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" ref={whyRef} className="py-24 px-6 border-t border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Why we're different
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {principles.map((p, idx) => (
              <AnimatedSection key={p.title} delay={idx * 0.1}>
                <div className="group relative h-full overflow-hidden rounded-2xl">
                  {/* Liquid metal background effect */}
                  <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                      <LiquidMetal
                        colorBack="#0a0a0a"
                        colorTint="#ea580c"
                        shape="circle"
                        repetition={2}
                        softness={0.6}
                        distortion={0.3}
                        speed={0.8}
                        scale={0.8}
                        fit="cover"
                        style={{ position: "absolute", inset: 0 }}
                      />
                    </div>
                  </Suspense>
                  <div className="relative h-full px-8 py-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-brand to-transparent rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="font-display text-xl uppercase mb-3 text-white">{p.title}</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{p.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section ref={quoteRef} className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 data-reveal className="font-display text-4xl md:text-6xl uppercase leading-tight text-balance">
            If your ads aren&apos;t making you money,
            <span className="text-brand"> they&apos;re costing you customers.</span>
          </h2>
          <p data-reveal className="text-gray-300 text-lg mt-8 max-w-2xl mx-auto">
            Every day your advertising is broken, a competitor is taking the customers that should be yours. Let&apos;s fix that.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" ref={faqRef} className="py-24 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase text-center mb-16">
            Straight answers
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} data-reveal className="group border border-white/10 rounded-lg overflow-hidden bg-gradient-to-r from-white/[0.03] to-white/[0.01] hover:from-white/[0.05] hover:to-white/[0.02] hover:border-white/20 transition-all duration-200">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex justify-between items-center text-left px-6 py-4 group-hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-semibold text-base md:text-lg text-gray-200 group-hover:text-white transition-colors">{faq.q}</span>
                  <span aria-hidden="true" className={`text-brand text-xl leading-none ml-4 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-400 leading-relaxed border-t border-white/5 pt-4" style={{
                    animation: 'fadeIn 0.2s ease-in-out',
                  }}>
                    <style>{`
                      @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                      }
                    `}</style>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 border-t border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <h2 data-reveal className="font-display text-3xl md:text-4xl uppercase mb-16">Trusted by businesses scaling their revenue</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection delay={0}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                <div className="relative px-6 py-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20 transition-all backdrop-blur-sm">
                  <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-brand/20 text-brand rounded-full border border-brand/30">Metric</div>
                  <div className="text-5xl font-display text-brand mb-3 font-bold">50+</div>
                  <p className="text-gray-400 text-sm">Audits completed this year</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                <div className="relative px-6 py-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20 transition-all backdrop-blur-sm">
                  <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-brand/20 text-brand rounded-full border border-brand/30">Impact</div>
                  <div className="text-5xl font-display text-brand mb-3 font-bold">$2K–$8K</div>
                  <p className="text-gray-400 text-sm">Monthly waste found per audit</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                <div className="relative px-6 py-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20 transition-all backdrop-blur-sm">
                  <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-brand/20 text-brand rounded-full border border-brand/30">Timeline</div>
                  <div className="text-5xl font-display text-brand mb-3 font-bold">30 days</div>
                  <p className="text-gray-400 text-sm">Average time to first results</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" ref={ctaRef} className="py-24 px-6 border-t border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-6 text-balance">
            Ready to stop wasting money on ads?
          </h2>
          <p data-reveal className="text-lg text-gray-300 mb-12 max-w-xl mx-auto">
            Get a free audit of your current campaigns. Find your ad spend leaks. See exactly what's broken and how to fix it.
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
              className="bg-brand hover:bg-orange-700 active:scale-[0.97] px-7 py-3.5 rounded-full font-semibold transition whitespace-nowrap disabled:opacity-60"
            >
              {cta.state === 'loading' ? 'Sending' : 'Get My Free Audit'}
            </button>
          </form>
          {cta.state === 'success' && (
            <p className="text-green-400 text-sm">Got it. We'll send your audit within 24 hours—no pressure, no cold calls.</p>
          )}
          {cta.state === 'error' && (
            <p className="text-red-400 text-sm">
              Something went wrong. Email us directly at{' '}
              <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
            </p>
          )}
          <p className="text-gray-500 text-xs mt-4">No credit card required. Includes our Ad Waste Checklist ($47 value).</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="AR Strategies" width={36} height={36} className="h-9 w-auto" />
              <span className="font-display text-lg tracking-wide">AR STRATEGIES</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We don&apos;t just run ads. We build advertising systems that make money for local businesses ready to dominate their market.
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

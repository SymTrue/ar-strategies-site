'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useReveal, useHeroIntro } from './components/useReveal';
import { AnimatedSection } from './components/AnimatedSection';
import { GlassMorphCard } from './components/GlassMorphCard';
import { ShaderGradientBg } from './components/ShaderGradientBg';

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
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
        <ShaderGradientBg />
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
            <button
              type="submit"
              disabled={hero.state === 'loading'}
              className="bg-brand hover:bg-orange-700 active:scale-[0.97] px-7 py-3.5 rounded-full font-semibold transition whitespace-nowrap disabled:opacity-60"
            >
              {hero.state === 'loading' ? 'Sending' : CTA_LABEL}
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
      <section id="process" ref={processRef} className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Our proven process
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/15">
            {steps.map((step, i) => (
              <AnimatedSection key={step.n} delay={i * 0.1}>
                <div className="pt-6">
                  <div className="font-display text-3xl text-brand mb-3">{step.n}</div>
                  <h3 className="font-display text-lg uppercase mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" ref={whyRef} className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 data-reveal className="font-display text-4xl md:text-5xl uppercase leading-tight mb-16">
            Why we're different
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {principles.map((p) => (
              <AnimatedSection key={p.title} delay={0.1}>
                <GlassMorphCard className="h-full">
                  <div className="px-8 py-8">
                    <h3 className="font-display text-xl uppercase mb-3">{p.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{p.body}</p>
                  </div>
                </GlassMorphCard>
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
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={faq.q} data-reveal className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex justify-between items-center text-left px-6 py-5 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <span aria-hidden="true" className="text-brand text-2xl leading-none ml-4">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-300 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 data-reveal className="font-display text-3xl md:text-4xl uppercase mb-16">Trusted by businesses scaling their revenue</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <AnimatedSection delay={0}>
              <div>
                <div className="text-4xl font-display text-brand mb-2">50+</div>
                <p className="text-gray-300">Audits completed this year</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div>
                <div className="text-4xl font-display text-brand mb-2">$2K–$8K</div>
                <p className="text-gray-300">Monthly waste found per audit</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div>
                <div className="text-4xl font-display text-brand mb-2">30 days</div>
                <p className="text-gray-300">Average time to first results</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Questions? */}
      <section id="contact" className="py-16 px-6 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl uppercase mb-4">Questions?</h2>
          <p className="text-gray-300 mb-8">Check our FAQ below or email <a href="mailto:hello@arstrategists.com" className="text-brand hover:underline">hello@arstrategists.com</a></p>
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
          <p className="font-display uppercase tracking-wide text-gray-600">Dominate your market.</p>
        </div>
      </footer>
    </div>
  );
}

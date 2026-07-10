'use client';

import Image from 'next/image';
import { useState } from 'react';

const services = [
  {
    title: 'Ad Strategy & Audit',
    body: "We tear apart your current campaigns, find where the money is leaking, and build a strategy that actually fits your business.",
  },
  {
    title: 'Campaign Management',
    body: 'Setup, targeting, creative, optimization — we run the whole machine so you can stay focused on your customers.',
  },
  {
    title: 'Growth & Scaling',
    body: "Once we find the winners, we pour fuel on them. Predictable, profitable scaling — not guesswork.",
  },
];

const steps = [
  { n: '01', title: 'Audit', body: 'We dig into your numbers and your market to see what is really going on.' },
  { n: '02', title: 'Build', body: 'We design a campaign and creative built to convert your specific audience.' },
  { n: '03', title: 'Launch', body: 'We go live, watch the data daily, and cut what does not work fast.' },
  { n: '04', title: 'Scale', body: 'We double down on winners and grow your revenue month over month.' },
];

const stats = [
  { value: '$2.3M+', label: 'Ad revenue tracked' },
  { value: '47', label: 'Businesses served' },
  { value: '3.2x', label: 'Avg. ROAS lift' },
  { value: '98%', label: 'Client retention' },
];

const faqs = [
  {
    q: 'How much should I be spending on ads?',
    a: "It depends on your margins and goals, but we help you start lean, prove what works, then scale. No one should be lighting money on fire hoping something sticks.",
  },
  {
    q: 'Do you work with businesses in my industry?',
    a: 'We work with local and service businesses across many industries. If you sell something people want and need more customers, we can likely help.',
  },
  {
    q: 'How long until I see results?',
    a: 'Most campaigns show meaningful signal within the first few weeks. Real scaling happens once we have data to optimize against — usually inside the first 1-2 months.',
  },
  {
    q: 'Am I locked into a long contract?',
    a: 'No. We earn your business every month. If we are not making you money, you should not keep paying us.',
  },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#top" className="flex items-center gap-3">
            <Image src="/logo.png" alt="AR Strategies" width={40} height={40} className="h-10 w-auto" />
            <span className="font-display text-xl tracking-wide">AR STRATEGIES</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#process" className="hover:text-white transition">Process</a>
            <a href="#results" className="hover:text-white transition">Results</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <a
            href="#contact"
            className="bg-brand hover:bg-orange-700 px-5 py-2 rounded-full font-semibold text-sm transition"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section id="top" className="relative dot-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-widest text-gray-300 mb-8">
            <span className="h-2 w-2 rounded-full bg-brand" /> Advertising Agency Built for Growth
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] uppercase mb-6">
            Advertising that actually
            <span className="text-brand"> makes money</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Most businesses burn thousands on ads with no strategy behind them. We build
            advertising systems that turn ad spend into real, trackable revenue.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition"
            />
            <button
              type="submit"
              className="bg-brand hover:bg-orange-700 px-7 py-3.5 rounded-full font-semibold transition whitespace-nowrap"
            >
              Get Free Audit
            </button>
          </form>
          {submitted && (
            <p className="text-green-400 mt-4 text-sm">Got it — we&apos;ll be in touch within 24 hours.</p>
          )}
          <p className="text-gray-500 text-sm mt-4">Free strategy audit. No commitment, no fluff.</p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-400">
          <span className="uppercase tracking-widest text-xs text-gray-500">Trusted by local businesses who are done guessing</span>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-brand font-semibold uppercase tracking-widest text-sm mb-3">What we do</p>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">
              We don&apos;t just run ads. We build systems that make money.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-brand/60 hover:bg-white/[0.06] transition"
              >
                <div className="h-1 w-12 bg-brand rounded-full mb-6 group-hover:w-20 transition-all" />
                <h3 className="font-display text-2xl uppercase mb-4">{s.title}</h3>
                <p className="text-gray-300 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-brand font-semibold uppercase tracking-widest text-sm mb-3">How it works</p>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">
              A simple system that prints results
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.n} className="relative bg-black border border-white/10 rounded-2xl p-8">
                <div className="font-display text-5xl text-brand/30 mb-4">{step.n}</div>
                <h3 className="font-display text-xl uppercase mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-brand font-semibold uppercase tracking-widest text-sm mb-3">The numbers</p>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">Results that speak</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-5xl md:text-6xl text-brand mb-2">{stat.value}</p>
                <p className="text-gray-400 text-sm uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-xs mt-10 max-w-xl mx-auto">
            Figures reflect aggregate client performance. Individual results vary based on
            budget, market, and offer.
          </p>
        </div>
      </section>

      {/* Big quote / brand voice */}
      <section className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl uppercase leading-tight">
            If your ads aren&apos;t making you money,
            <span className="text-brand"> they&apos;re costing you customers.</span>
          </h2>
          <p className="text-gray-300 text-lg mt-8 max-w-2xl mx-auto">
            Every day your advertising is broken, a competitor is taking the customers that
            should be yours. Let&apos;s fix that.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand font-semibold uppercase tracking-widest text-sm mb-3">Questions</p>
            <h2 className="font-display text-4xl md:text-5xl uppercase">Straight answers</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left px-6 py-5 hover:bg-white/[0.04] transition"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <span className="text-brand text-2xl leading-none ml-4">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-300 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 px-6 border-t border-white/10 dot-grid">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 rounded-3xl p-12">
          <h2 className="font-display text-4xl md:text-5xl uppercase mb-6">Ready to fix your ads?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto">
            Get a free audit of your current advertising. We&apos;ll show you exactly what&apos;s
            broken and how to fix it — no strings attached.
          </p>
          <a
            href="mailto:hello@arstrategists.com?subject=Free%20Ad%20Audit%20Request"
            className="inline-block bg-brand hover:bg-orange-700 px-10 py-4 rounded-full font-semibold text-lg transition"
          >
            Book Your Free Audit
          </a>
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
              We don&apos;t just run ads. We build advertising systems that make money for
              local businesses ready to dominate their market.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#process" className="hover:text-white transition">Process</a></li>
                <li><a href="#results" className="hover:text-white transition">Results</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4 text-sm uppercase tracking-wide">Connect</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="https://instagram.com/ar_strats.aa" className="hover:text-white transition">Instagram</a></li>
                <li><a href="mailto:hello@arstrategists.com" className="hover:text-white transition">Email</a></li>
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

'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-2xl">AR STRATEGIES</div>
          <a href="#contact" className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-full font-semibold transition">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-black via-black to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Your Advertising Strategy <span className="text-orange-600">Doesn't Have to Suck</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Most businesses waste thousands on ads with no strategy. We help you build campaigns that actually convert.
          </p>

          {/* Email Capture */}
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-orange-600"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {submitted && <p className="text-green-400 mt-2">Thanks! Check your email.</p>}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What We Do</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition">
              <div className="text-orange-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">Ad Strategy</h3>
              <p className="text-gray-300">We audit your current campaigns and build a strategy that actually works for your business.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition">
              <div className="text-orange-600 text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Campaign Management</h3>
              <p className="text-gray-300">From setup to optimization, we handle everything so you can focus on running your business.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition">
              <div className="text-orange-600 text-3xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-4">Growth & Scaling</h3>
              <p className="text-gray-300">Once we find what works, we scale it. We've helped businesses 10x their revenue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-6 border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Results That Speak</h2>
          <p className="text-center text-gray-300 mb-16">Here's what we've accomplished for our clients</p>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600 mb-2">$2.3M+</p>
              <p className="text-gray-300">In ad revenue tracked</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600 mb-2">47</p>
              <p className="text-gray-300">Active clients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600 mb-2">3.2x</p>
              <p className="text-gray-300">Avg ROAS improvement</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600 mb-2">98%</p>
              <p className="text-gray-300">Client retention</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Fix Your Ads?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's audit your current strategy and show you exactly what's broken and how to fix it.
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 px-8 py-4 rounded-lg font-semibold text-lg transition">
            Schedule a Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-bold text-xl mb-2">AR STRATEGIES</p>
              <p className="text-gray-400">We don't just run ads. We build systems that make money.</p>
            </div>
            <div className="text-gray-400">
              <p>© 2026 AR Strategies</p>
              <p>Dominate your market.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

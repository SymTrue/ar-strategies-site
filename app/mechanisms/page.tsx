'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Mechanism {
  id: string;
  name: string;
  title: string;
  description: string;
  videoFile: string;
  pillar: string;
  icon: React.ReactNode;
}

const mechanisms: Mechanism[] = [
  {
    id: 'pattern-interruption',
    name: 'Pattern Interruption',
    title: 'The Psychology Behind Getting Noticed',
    description: 'Understand how breaking expected patterns forces attention and creates memorable moments that make your business impossible to ignore.',
    videoFile: '/videos/pattern-interruption.mp4',
    pillar: 'Attention',
    icon: '⚡',
  },
  {
    id: 'mental-availability',
    name: 'Mental Availability',
    title: 'The Psychology Behind Being Remembered',
    description: 'Discover how top-of-mind awareness works and why businesses that are remembered first get chosen first.',
    videoFile: '/videos/mental-availability.mp4',
    pillar: 'Memory',
    icon: '🧠',
  },
  {
    id: 'positioning',
    name: 'Positioning',
    title: 'The Psychology Behind Differentiation',
    description: 'Learn how strategic positioning shapes perception and becomes the foundation for all business success.',
    videoFile: '/videos/positioning.mp4',
    pillar: 'Positioning',
    icon: '🎯',
  },
];

export default function MechanismsHub() {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const filtered = selectedPillar
    ? mechanisms.filter(m => m.pillar === selectedPillar)
    : mechanisms;

  const pillars = [...new Set(mechanisms.map(m => m.pillar))];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-brand">
            How Psychology Wins
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Master the 18 psychological mechanisms behind perception, positioning, and memorability.
          </p>
          <p className="text-lg text-gray-400">
            Free explainer videos on the principles that make businesses impossible to ignore.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="border-b border-brand/20 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPillar(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedPillar === null
                  ? 'bg-brand text-black'
                  : 'bg-white/10 hover:bg-white/20 border border-brand/30'
              }`}
            >
              All Mechanisms
            </button>
            {pillars.map(pillar => (
              <button
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedPillar === pillar
                    ? 'bg-brand text-black'
                    : 'bg-white/10 hover:bg-white/20 border border-brand/30'
                }`}
              >
                {pillar}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanisms Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(mechanism => (
              <Link
                key={mechanism.id}
                href={`/mechanisms/${mechanism.id}`}
              >
                <div className="group h-full flex flex-col bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-brand/30 rounded-lg p-6 hover:border-brand hover:bg-white/[0.12] transition-all duration-300 cursor-pointer">
                  {/* Icon */}
                  <div className="text-4xl mb-4">{mechanism.icon}</div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-brand transition-colors">
                    {mechanism.name}
                  </h3>

                  {/* Pillar Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-brand/20 text-brand rounded-full border border-brand/50">
                      {mechanism.pillar} Pillar
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mb-6 flex-grow text-sm leading-relaxed">
                    {mechanism.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-brand font-semibold group-hover:gap-3 transition-all">
                    <span>Watch Explainer</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-brand/20 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to apply psychology to your marketing?</h2>
          <p className="text-gray-400 mb-8">
            See how these mechanisms work in real client success stories.
          </p>
          <Link
            href="/#strike-den"
            className="inline-block px-8 py-4 bg-brand text-black font-bold rounded-full hover:bg-brand/90 transition-colors"
          >
            View Case Study
          </Link>
        </div>
      </section>
    </div>
  );
}

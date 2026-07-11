'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import AnimatedGradient from '../components/ui/animated-gradient';
import LiquidMetal from '../components/ui/liquid-metal';
import LiquidMetalDemo from '../components/ui/liquid-metal-demo';
import AnimatedGradientDemo from '../components/ui/animated-gradient-demo';

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState<'animated-gradient' | 'liquid-metal' | 'both'>('both');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl uppercase mb-1">AR Strategies Effects</h1>
            <p className="text-sm text-gray-400">Showcase: AnimatedGradient & LiquidMetal</p>
          </div>
          <Link href="/" className="text-sm bg-brand hover:bg-orange-700 px-4 py-2 rounded-full">
            Back to Site
          </Link>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white/[0.02] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4">
          {(['both', 'animated-gradient', 'liquid-metal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-brand text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {tab === 'both' ? 'Combined Demo' : tab === 'animated-gradient' ? 'Animated Gradient' : 'Liquid Metal'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Combined Demo */}
        {activeTab === 'both' && (
          <div className="space-y-12">
            <section>
              <h2 className="font-display text-3xl uppercase mb-8">Hero with Animated Gradient</h2>
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-black to-orange-900/50" />}>
                  <AnimatedGradient
                    config={{
                      preset: 'custom',
                      color1: '#0a0a0a',
                      color2: '#1a0f00',
                      color3: '#ea580c',
                      speed: 12,
                      distortion: 35,
                      swirl: 70,
                    }}
                    radius="16px"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <h3 className="font-display text-4xl uppercase mb-2">Animated Gradient</h3>
                    <p className="text-gray-300">AR Strategies brand colors in motion</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl uppercase mb-8">Feature Cards with Liquid Metal</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'Strategy', desc: 'Custom liquid metal effects on hover' },
                  { title: 'Analytics', desc: 'Real-time parameter control' },
                  { title: 'Scaling', desc: 'Multiple shapes & presets' },
                ].map((card) => (
                  <div key={card.title} className="group relative h-64 rounded-xl overflow-hidden">
                    <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />}>
                      <LiquidMetal
                        colorBack="#00000000"
                        colorTint="#ea580c"
                        shape="circle"
                        repetition={2}
                        softness={0.6}
                        distortion={0.3}
                        speed={0.8}
                        scale={2.4}
                        fit="cover"
                        style={{ position: 'absolute', inset: 0, opacity: 0 }}
                        className="group-hover:opacity-60 transition-opacity duration-500"
                      />
                    </Suspense>
                    <div className="relative h-full px-6 py-6 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/20 transition-all flex flex-col items-center justify-center text-center">
                      <h3 className="font-display text-lg uppercase mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-400">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Animated Gradient Only */}
        {activeTab === 'animated-gradient' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl uppercase mb-6">Animated Gradient - Full Demo</h2>
              <Suspense fallback={<div className="h-96 bg-gradient-to-br from-black to-orange-900/50 rounded-2xl" />}>
                <AnimatedGradientDemo />
              </Suspense>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-8">
              <h3 className="font-display text-xl uppercase mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ 5 presets: Aurora, Oceanic, Amber, Toxic, Ghost</li>
                <li>✓ 14+ customizable parameters</li>
                <li>✓ Hardware-accelerated WebGL 2.0</li>
                <li>✓ Responsive canvas resizing</li>
                <li>✓ Graceful WebGL fallbacks</li>
              </ul>
            </div>
          </div>
        )}

        {/* Liquid Metal Only */}
        {activeTab === 'liquid-metal' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl uppercase mb-6">Liquid Metal - Full Interactive Demo</h2>
              <Suspense fallback={<div className="h-96 bg-white/[0.02] rounded-xl" />}>
                <LiquidMetalDemo />
              </Suspense>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-8">
              <h3 className="font-display text-xl uppercase mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ 5+ shape patterns: circle, daisy, diamond, metaballs, none</li>
                <li>✓ 16+ customizable parameters</li>
                <li>✓ Real-time image processing</li>
                <li>✓ Interactive control panel</li>
                <li>✓ Multiple presets</li>
                <li>✓ Image upload capability</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 mt-12 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-display text-lg uppercase mb-3">AnimatedGradient</h3>
              <p className="text-sm text-gray-400">
                Hardware-accelerated WebGL gradient with 5 presets and full customization. Perfect for hero sections and card backgrounds.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg uppercase mb-3">LiquidMetal</h3>
              <p className="text-sm text-gray-400">
                Advanced liquid metal distortion with image processing. Ideal for feature cards, testimonials, and premium visual effects.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex justify-between items-center text-sm text-gray-500">
            <p>© 2026 AR Strategies. Effects showcase.</p>
            <Link href="/" className="text-brand hover:text-orange-400">
              Return to Main Site
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

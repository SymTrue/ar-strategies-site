'use client';

import { ReactNode } from 'react';

interface GlassMorphCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassMorphCard({ children, className = '' }: GlassMorphCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:border-brand/50 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(234,88,12,0.25)] ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        WebkitBackdropFilter: 'blur(10px)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Glassmorphism highlight effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

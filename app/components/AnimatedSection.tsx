'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactNode } from 'react';

let registered = false;

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

type DirVec = { x: number; y: number };

const DIR: Record<string, DirVec> = {
  up:    { x: 0,  y: 40 },
  down:  { x: 0,  y: -40 },
  left:  { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { gsap.set(el, { opacity: 1 }); return; }

    const d = DIR[direction];
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, x: d.x, y: d.y });
      gsap.to(el, {
        opacity: 1, x: 0, y: 0,
        duration: 0.8,
        delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, direction]);

  return <div ref={ref} className={className}>{children}</div>;
}
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function useReveal<T extends HTMLElement>(childSelector = '[data-reveal]') {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = el.querySelectorAll<HTMLElement>(childSelector);
    if (targets.length === 0) return;

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 24 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, [childSelector]);

  return ref;
}

export function useHeroIntro<T extends HTMLElement>(childSelector = '[data-intro]') {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = el.querySelectorAll<HTMLElement>(childSelector);
    if (targets.length === 0) return;

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 20 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 0.1,
      });
    }, el);

    return () => ctx.revert();
  }, [childSelector]);

  return ref;
}

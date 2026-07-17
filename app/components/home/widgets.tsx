'use client';

import { useEffect, useRef } from 'react';
import { REDUCED_MOTION_QUERY } from '@/lib/hooks';

/* Precision cursor: trailing ring that responds to interactive elements.
   Fine pointers only; hidden for touch and reduced motion via CSS. */
export function PrecisionCursor() {
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
export function ScrollProgress() {
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

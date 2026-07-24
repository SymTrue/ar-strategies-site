'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { REDUCED_MOTION_QUERY } from '@/lib/hooks';

/* Precision cursor: trailing ring that responds to interactive elements.
   Fine pointers only; hidden for touch and reduced motion via CSS.
   Portaled to <body> so the fixed ring is never clipped by a page wrapper's
   overflow (e.g. .site-shell's overflow-x: clip) when it crosses the header. */
export function PrecisionCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => setContainer(document.body), []);

  useEffect(() => {
    if (!container) return;
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
  }, [container]);

  if (!container) return null;
  return createPortal(
    <div ref={ringRef} className="precision-ring" aria-hidden="true" />,
    container,
  );
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

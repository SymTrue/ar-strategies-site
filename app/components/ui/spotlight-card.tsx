'use client';

import React, { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** 'steel' (the brand default: muted cool-steel, hue ~205-210, low
   * saturation) or a generic hue for one-off, explicitly-chosen use —
   * these are reusable UI primitives, not brand colors. */
  glowColor?: 'steel' | 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
}

/* base/spread define the hue range the glow sweeps as the pointer crosses
   the card (hue = base + xp * spread); saturation keeps it a muted "signal"
   accent rather than a neon one. 'steel' is the only brand-sanctioned
   default: hue stays within 205-210 (spread is deliberately tight) at
   18-28% saturation — never 100%, which is what made the previous purple
   preset read as neon once combined with the border layer's brightness
   amplification (removed in globals.css). The other presets are generic,
   reusable hue options for explicit non-brand use, not silently loaded. */
const glowColorMap = {
  steel:  { base: 207, spread: 4,   saturation: 22 },
  blue:   { base: 220, spread: 20,  saturation: 45 },
  purple: { base: 280, spread: 20,  saturation: 40 },
  green:  { base: 120, spread: 20,  saturation: 40 },
  red:    { base: 0,   spread: 20,  saturation: 45 },
  orange: { base: 30,  spread: 20,  saturation: 45 },
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

/* Spotlight/glow card: a border-ring glow that tracks the pointer, scoped to
   EACH card individually.
   - Position is computed relative to this card's own bounding box (onPointerMove
     on the element itself), not raw viewport coordinates — the original recipe
     shared one global --x/--y across every mounted card via `background-attachment:
     fixed`, so any card whose glow radius happened to reach the cursor's viewport
     position would light up, not just the one actually under the pointer.
   - Visibility is gated by a real .is-glowing class toggled on pointerenter/
     pointerleave (see [data-glow] rules in globals.css) — the original had no
     hover gate at all, just an always-on gradient whose brightness fell off with
     distance. Against a card much larger than the glow radius, hovering near the
     center left most of the border ring further from the spotlight than hovering
     right at an edge — reading as "only lights up outside the card."
   - Saturation is explicit per preset (was hardcoded to 100% in the shared CSS,
     which combined with a brightness(2) amplification on the border layer made
     any glow color read as neon regardless of the hue chosen).
   The shared [data-glow] ::before/::after rules live once in globals.css, not
   injected per instance — with N cards mounted, a per-instance <style> tag would
   duplicate the same rule N times in the DOM for no reason. */
const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'steel',
  size = 'md',
  width,
  height,
  customSize = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { base, spread, saturation } = glowColorMap[glowColor];

  const sizeClasses = customSize ? '' : sizeMap[size];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', x.toFixed(2));
    card.style.setProperty('--xp', (x / rect.width).toFixed(2));
    card.style.setProperty('--y', y.toFixed(2));
    card.style.setProperty('--yp', (y / rect.height).toFixed(2));
  };

  const handlePointerEnter = () => cardRef.current?.classList.add('is-glowing');
  const handlePointerLeave = () => cardRef.current?.classList.remove('is-glowing');

  const getInlineStyles = (): React.CSSProperties => {
    const styles: Record<string, string | number> = {
      '--base': base,
      '--spread': spread,
      '--saturation': saturation,
      '--radius': '14',
      '--border': '3',
      '--backdrop': 'hsl(0 0% 60% / 0.12)',
      '--backup-border': 'var(--backdrop)',
      '--size': '220',
      '--outer': '0.5',
      '--bg-spot-opacity': '0.08',
      '--border-spot-opacity': '0.6',
      '--border-light-opacity': '0.5',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 22) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.08)), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
    };

    if (width !== undefined) styles.width = typeof width === 'number' ? `${width}px` : width;
    if (height !== undefined) styles.height = typeof height === 'number' ? `${height}px` : height;

    return styles as unknown as React.CSSProperties;
  };

  return (
    <div
      ref={cardRef}
      data-glow
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={getInlineStyles()}
      className={cn(
        sizeClasses,
        !customSize && 'aspect-[3/4]',
        'relative grid grid-rows-[1fr_auto] gap-4 rounded-2xl p-4',
        'shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px]',
        className,
      )}
    >
      <div data-glow />
      {children}
    </div>
  );
};

export { GlowCard };

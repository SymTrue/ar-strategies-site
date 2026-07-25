'use client';

import React from 'react';
import { motion } from 'framer-motion';

type GradientDotsProps = React.ComponentProps<typeof motion.div> & {
  /** Dot size (default: 8) */
  dotSize?: number;
  /** Spacing between dots (default: 10) */
  spacing?: number;
  /** Animation duration (default: 30) */
  duration?: number;
  /** Hue wobble duration in seconds (default: 10) */
  colorCycleDuration?: number;
  /** Background color (default: 'var(--background)') */
  backgroundColor?: string;
};

/* Animated dot-grid with drifting colored blobs showing through the mask.
   The original recipe used four saturated primaries (red/yellow/green/blue)
   plus a full 0->360deg hue-rotate sweep — that cycles through the whole
   rainbow regardless of which colors you hand it, since hue-rotate shifts
   hue independent of the source color. Retinted to the site's navy/midnight-
   purple palette, with the hue-rotate narrowed to a small wobble (rather than
   removed outright) so the blobs still breathe subtly instead of cycling
   through unrelated hues. */
export function GradientDots({
  dotSize = 8,
  spacing = 10,
  duration = 30,
  colorCycleDuration = 10,
  backgroundColor = 'var(--background)',
  className,
  ...props
}: GradientDotsProps) {
  const hexSpacing = spacing * 1.732; // Hexagonal spacing calculation

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundColor,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, transparent 1.5px, ${backgroundColor} 0 ${dotSize}px, transparent ${dotSize}px),
          radial-gradient(circle at 50% 50%, transparent 1.5px, ${backgroundColor} 0 ${dotSize}px, transparent ${dotSize}px),
          radial-gradient(circle at 50% 50%, var(--ambient-key, #3730a3), transparent 60%),
          radial-gradient(circle at 50% 50%, var(--ambient-accent, #4c1d95), transparent 60%),
          radial-gradient(circle at 50% 50%, var(--ambient-fill, #1e293b), transparent 60%),
          radial-gradient(ellipse at 50% 50%, #6d28d9, transparent 60%)
        `,
        backgroundSize: `
          ${spacing}px ${hexSpacing}px,
          ${spacing}px ${hexSpacing}px,
          200% 200%,
          200% 200%,
          200% 200%,
          200% ${hexSpacing}px
        `,
        backgroundPosition: `
          0px 0px, ${spacing / 2}px ${hexSpacing / 2}px,
          0% 0%,
          0% 0%,
          0% 0px
        `,
      }}
      animate={{
        backgroundPosition: [
          `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 800% 400%, 1000% -400%, -1200% -600%, 400% ${hexSpacing}px`,
          `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 0% 0%, 0% 0%, 0% 0%, 0% 0%`,
        ],
        filter: ['hue-rotate(-8deg)', 'hue-rotate(8deg)', 'hue-rotate(-8deg)'],
      }}
      transition={{
        backgroundPosition: {
          duration: duration,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        },
        filter: {
          duration: colorCycleDuration,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        },
      }}
      {...props}
    />
  );
}

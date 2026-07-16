'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

/* Adapted from 21st.dev "Wave Background" (xubohuah). Changes for this site:
   design-token stroke color via prop, transparent background, no pointer dot
   (the site has its own cursor treatment), wider line gaps for performance,
   a static single frame under prefers-reduced-motion, and RAF paused while
   the document is hidden. */

interface Point {
  x: number;
  y: number;
  wave: { x: number; y: number };
  cursor: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
}

interface WavesProps {
  className?: string;
  strokeColor?: string;
}

export function Waves({ className = '', strokeColor = 'rgba(255,255,255,0.14)' }: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef({
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  });
  const pathsRef = useRef<SVGPathElement[]>([]);
  const linesRef = useRef<Point[][]>([]);
  const noiseRef = useRef<((x: number, y: number) => number) | null>(null);
  const rafRef = useRef<number | null>(null);
  const boundingRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    noiseRef.current = createNoise2D();

    const setSize = () => {
      boundingRef.current = container.getBoundingClientRect();
      const { width, height } = boundingRef.current;
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;
    };

    const setLines = () => {
      if (!boundingRef.current) return;
      const { width, height } = boundingRef.current;
      linesRef.current = [];

      pathsRef.current.forEach((path) => path.remove());
      pathsRef.current = [];

      const xGap = 14;
      const yGap = 10;
      const oWidth = width + 200;
      const oHeight = height + 30;
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i < totalLines; i++) {
        const points: Point[] = [];
        for (let j = 0; j < totalPoints; j++) {
          points.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', '1');
        svg.appendChild(path);
        pathsRef.current.push(path);
        linesRef.current.push(points);
      }
    };

    const updateMousePosition = (x: number, y: number) => {
      if (!boundingRef.current) return;
      const mouse = mouseRef.current;
      mouse.x = x - boundingRef.current.left;
      mouse.y = y - boundingRef.current.top;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const movePoints = (time: number) => {
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const noise = noiseRef.current;
      if (!noise) return;

      lines.forEach((points) => {
        points.forEach((p) => {
          const move =
            noise((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8;
          p.wave.x = Math.cos(move) * 12;
          p.wave.y = Math.sin(move) * 6;

          if (!reduced) {
            const dx = p.x - mouse.sx;
            const dy = p.y - mouse.sy;
            const d = Math.hypot(dx, dy);
            const l = Math.max(175, mouse.vs);

            if (d < l) {
              const s = 1 - d / l;
              const f = Math.cos(d * 0.001) * s;
              p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
              p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
            }

            p.cursor.vx += (0 - p.cursor.x) * 0.01;
            p.cursor.vy += (0 - p.cursor.y) * 0.01;
            p.cursor.vx *= 0.95;
            p.cursor.vy *= 0.95;
            p.cursor.x += p.cursor.vx;
            p.cursor.y += p.cursor.vy;
            p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
            p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
          }
        });
      });
    };

    const moved = (point: Point, withCursorForce = true) => ({
      x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
      y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
    });

    const drawLines = () => {
      const lines = linesRef.current;
      const paths = pathsRef.current;
      lines.forEach((points, lIndex) => {
        if (points.length < 2 || !paths[lIndex]) return;
        const firstPoint = moved(points[0], false);
        let d = `M ${firstPoint.x} ${firstPoint.y}`;
        for (let i = 1; i < points.length; i++) {
          const current = moved(points[i]);
          d += `L ${current.x} ${current.y}`;
        }
        paths[lIndex].setAttribute('d', d);
      });
    };

    const tick = (time: number) => {
      const mouse = mouseRef.current;

      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;

      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);

      movePoints(time);
      drawLines();
      rafRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      setSize();
      setLines();
      if (reduced) {
        movePoints(0);
        drawLines();
      }
    };

    setSize();
    setLines();
    // Paint one frame synchronously so the waves exist even where RAF never
    // fires (hidden tabs, reduced motion).
    movePoints(0);
    drawLines();

    if (!reduced) {
      rafRef.current = requestAnimationFrame(tick);
      window.addEventListener('mousemove', onMouseMove);
    }

    const onVisibilityChange = () => {
      if (reduced) return;
      if (document.visibilityState === 'hidden') {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokeColor]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg ref={svgRef} className="block w-full h-full" xmlns="http://www.w3.org/2000/svg" />
    </div>
  );
}

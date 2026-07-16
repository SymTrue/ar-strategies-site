'use client';

import { useEffect, useRef } from 'react';

/* Diagnostic variant of the hero NeuralNet: same glow-sprite canvas
   language (radial gradients, dark-mode blue-white / light-mode brand
   orange activation), applied to a small labeled graph instead of an
   ambient particle canopy. One hub node (the business), four surface
   nodes in a ring, three question satellites per surface. Nodes and
   edges light up live as the visitor answers, so the diagram doubles
   as the score readout. */

export interface DiagnosticAnswer {
  surfaceIndex: number;
  questionIndex: number;
  value: boolean | null;
}

interface Props {
  surfaces: Array<{ code: string; name: string }>;
  answers: (boolean | null)[][];
  theme: 'dark' | 'light';
  reducedMotion: boolean;
}

interface Sprite {
  canvas: HTMLCanvasElement;
  size: number;
}

function makeGlowSprite(color: string, size: number): Sprite {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return { canvas: c, size };
}

export function DiagnosticNet({ surfaces, answers, theme, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const drawRef = useRef<(() => void) | null>(null);

  // Canvas painting does not depend on requestAnimationFrame ever firing:
  // backgrounded or hidden tabs (real visitors switching away, some
  // preview/embed contexts) have RAF suspended by spec. Every state change
  // below triggers a synchronous repaint via drawRef; RAF is used only to
  // drive the optional cosmetic pulse when it is available.
  useEffect(() => {
    drawRef.current?.();
  }, [answers, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isDark = () => themeRef.current === 'dark';
    const passGlow = makeGlowSprite('rgba(234,88,12,0.95)', 160);
    const dimGlowDark = makeGlowSprite('rgba(140,170,255,0.5)', 140);
    const dimGlowLight = makeGlowSprite('rgba(120,120,130,0.35)', 140);
    const hubGlowDark = makeGlowSprite('rgba(200,215,255,0.9)', 200);
    const hubGlowLight = makeGlowSprite('rgba(40,40,45,0.55)', 200);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      // Setting canvas.width/height clears the buffer; repaint immediately
      // rather than waiting on a RAF frame that may never come.
      drawRef.current?.();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const surfaceAngle = (i: number) => -Math.PI / 2 + (i * Math.PI * 2) / 4;

    let t = 0;
    const draw = () => {
      if (!running) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.34;
      const r = Math.min(w, h) * 0.13;

      ctx.clearRect(0, 0, w, h);
      if (!reducedMotion) t += 0.012;
      const pulse = 0.85 + Math.sin(t * 1.6) * 0.15;

      const dimGlow = isDark() ? dimGlowDark : dimGlowLight;
      const hubGlow = isDark() ? hubGlowDark : hubGlowLight;
      const lineDim = isDark() ? 'rgba(180,195,255,0.16)' : 'rgba(90,90,100,0.16)';
      const lineDimQ = isDark() ? 'rgba(180,195,255,0.09)' : 'rgba(90,90,100,0.09)';
      const dotDim = isDark() ? 'rgba(200,210,255,0.55)' : 'rgba(70,70,80,0.5)';

      const surfacePos = surfaces.map((_, i) => {
        const a = surfaceAngle(i);
        return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, a };
      });

      // Hub-to-surface trunks: opacity/glow scale with that surface's pass rate.
      surfacePos.forEach((p, i) => {
        const row = answersRef.current[i] ?? [];
        const passed = row.filter((v) => v === true).length;
        const answeredAll = row.every((v) => v !== null) && row.length > 0;
        const strength = row.length ? passed / row.length : 0;

        ctx.strokeStyle = strength > 0 ? `rgba(234,88,12,${0.14 + strength * 0.4})` : lineDim;
        ctx.lineWidth = (1 + strength * 1.6) * dpr;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (answeredAll && strength >= 0.66) {
          const g = passGlow.canvas;
          const s = g.width * 0.55 * dpr * pulse;
          ctx.globalAlpha = 0.85;
          ctx.drawImage(g, p.x - s / 2, p.y - s / 2, s, s);
          ctx.globalAlpha = 1;
        }
      });

      // Satellite questions around each surface node.
      surfacePos.forEach((p, i) => {
        const row = answersRef.current[i] ?? [];
        const qCount = row.length || 3;
        for (let qi = 0; qi < qCount; qi++) {
          const spread = 0.62;
          const qa = p.a - spread / 2 + (qi * spread) / (qCount - 1 || 1);
          const qx = cx + Math.cos(qa) * (R + r * 1.55);
          const qy = cy + Math.sin(qa) * (R + r * 1.55);
          const val = row[qi];

          ctx.strokeStyle = val === true ? 'rgba(234,88,12,0.55)' : lineDimQ;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(qx, qy);
          ctx.stroke();

          const dotR = 3.2 * dpr;
          if (val === true) {
            const g = passGlow.canvas;
            const s = 46 * dpr;
            ctx.globalAlpha = 0.9;
            ctx.drawImage(g, qx - s / 2, qy - s / 2, s, s);
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgba(255,214,170,0.95)';
          } else if (val === false) {
            ctx.fillStyle = isDark() ? 'rgba(230,232,240,0.75)' : 'rgba(60,60,68,0.6)';
          } else {
            ctx.fillStyle = isDark() ? 'rgba(140,150,180,0.35)' : 'rgba(150,150,158,0.35)';
          }
          ctx.beginPath();
          ctx.arc(qx, qy, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Surface nodes.
      surfacePos.forEach((p, i) => {
        const row = answersRef.current[i] ?? [];
        const passed = row.filter((v) => v === true).length;
        const answeredAll = row.every((v) => v !== null) && row.length > 0;
        const nodeR = 7 * dpr;

        if (answeredAll) {
          const g = passed >= 2 ? passGlow.canvas : dimGlow.canvas;
          const s = 90 * dpr * (passed >= 2 ? pulse : 1);
          ctx.globalAlpha = passed >= 2 ? 0.95 : 0.55;
          ctx.drawImage(g, p.x - s / 2, p.y - s / 2, s, s);
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = answeredAll ? (passed >= 2 ? '#ea580c' : dotDim) : (isDark() ? 'rgba(160,170,200,0.4)' : 'rgba(140,140,148,0.4)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.4 * dpr;
        ctx.strokeStyle = isDark() ? 'rgba(255,255,255,0.7)' : 'rgba(20,20,24,0.55)';
        ctx.stroke();
      });

      // Hub.
      const hubR = 11 * dpr;
      const hs = 130 * dpr * pulse;
      ctx.globalAlpha = 0.8;
      ctx.drawImage(hubGlow.canvas, cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.globalAlpha = 1;
      ctx.fillStyle = isDark() ? '#f5f6fa' : '#141418';
      ctx.beginPath();
      ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    drawRef.current = draw;
    // Paint synchronously now: don't rely on RAF firing at all for the
    // first frame (backgrounded/hidden tabs suspend RAF entirely).
    draw();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        draw();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      running = false;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      drawRef.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surfaces.length, reducedMotion]);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        role="img"
        aria-label="Live diagnostic network showing your business as the center node connected to four surfaces: search result, Google profile, homepage, and storefront. Each lights up as its questions are answered."
      />
      {surfaces.map((s, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 4;
        const left = 50 + Math.cos(a) * 34;
        const top = 50 + Math.sin(a) * 34;
        return (
          <span
            key={s.code}
            aria-hidden="true"
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] pointer-events-none whitespace-nowrap"
            style={{ left: `${left}%`, top: `${top}%`, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            {s.name}
          </span>
        );
      })}
    </div>
  );
}

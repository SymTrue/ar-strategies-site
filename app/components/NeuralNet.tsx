'use client';

import { useEffect, useRef } from 'react';

/* Premium hero background: a quiet neural network suspended in fluid.
   Hundreds of glowing nodes joined by ultra-thin lines, loosely composed
   as a brain-like silhouette (never literal). Canvas 2D with pre-rendered
   glow sprites and batched strokes: ~250 nodes at 60fps without a WebGL
   dependency. Alpha is masked toward the viewport center so typography
   stays the focus; depth lives at the edges. */

interface Node {
  x: number; y: number; z: number;      // base position (unit brain space)
  phx: number; phy: number; phz: number; // drift phases
  sp: number;                            // drift speed
  tw: number; twp: number;               // twinkle speed + phase
  dx: number; dy: number;                // smoothed cursor displacement (px)
  px: number; py: number; ps: number; pa: number; // projected x, y, scale, alpha
}

function buildNodes(count: number, rand: () => number): Node[] {
  const nodes: Node[] = [];
  while (nodes.length < count) {
    // Random direction, surface-biased radius: a cortex, not a solid mass
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 0.66 + 0.34 * Math.sqrt(rand());
    let x = s * Math.cos(theta) * r;
    let y = u * r;
    let z = s * Math.sin(theta) * r;

    // Loose brain silhouette: wide ellipsoid, flattened base,
    // faint interhemispheric gap. Abstract, not anatomical.
    x *= 1.28;
    y *= 0.82;
    z *= 0.9;
    if (y < 0) y *= 0.78;
    x += Math.sign(x) * 0.05;

    nodes.push({
      x, y, z,
      phx: rand() * Math.PI * 2, phy: rand() * Math.PI * 2, phz: rand() * Math.PI * 2,
      sp: 0.35 + rand() * 0.5,
      tw: 0.4 + rand() * 0.7, twp: rand() * Math.PI * 2,
      dx: 0, dy: 0,
      px: 0, py: 0, ps: 1, pa: 0,
    });
  }
  return nodes;
}

function buildEdges(nodes: Node[], perNode: number): Array<[number, number]> {
  const edges: Array<[number, number]> = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const dists: Array<[number, number]> = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const a = nodes[i], b = nodes[j];
      const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
      dists.push([d, j]);
    }
    dists.sort((p, q) => p[0] - q[0]);
    for (let k = 0; k < perNode; k++) {
      const j = dists[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(i < j ? [i, j] : [j, i]);
      }
    }
  }
  return edges;
}

/* Soft-bloom node sprite, rendered once per theme */
function makeSprite(core: string, halo: string): HTMLCanvasElement {
  const size = 32;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, core);
  grad.addColorStop(0.25, halo);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

interface Pulse { edge: number; t: number; dur: number; }

export default function NeuralNet({ theme, reducedMotion }: { theme: string; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Lower-powered devices get a lighter network
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = coarse || (navigator.hardwareConcurrency ?? 8) <= 4;
    const NODE_COUNT = lowPower ? 120 : 250;

    // Deterministic layout: same brain every visit
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const nodes = buildNodes(NODE_COUNT, rand);
    const edges = buildEdges(nodes, 2);

    const spriteWhite = makeSprite('rgba(255,255,255,0.95)', 'rgba(214,228,255,0.35)');
    const spriteBlue = makeSprite('rgba(214,228,255,1)', 'rgba(170,200,255,0.4)');
    const spriteDark = makeSprite('rgba(30,41,59,0.9)', 'rgba(51,65,85,0.3)');
    const spriteDarkBlue = makeSprite('rgba(37,80,180,0.9)', 'rgba(37,80,180,0.3)');

    // Measure the parent (the hero section), not the canvas itself: a raw
    // <canvas> defaults to display:inline and its own rect can be stale/zero
    // before the parent has settled its box, especially on first paint.
    const parent = canvas.parentElement ?? canvas;
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      w = rect.width; h = rect.height;
      if (w <= 0 || h <= 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cx = w / 2; cy = h / 2 + h * 0.02;
      R = Math.min(w * 0.42, h * 0.66);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Cursor gravity (fine pointers only)
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    if (!coarse && !reducedMotion) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    const pulses: Pulse[] = [];
    const GRAV_R = 170;
    const FOV = 3.2;

    const draw = (t: number) => {
      const dark = themeRef.current !== 'light';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // A few degrees of slow yaw: parallax you only notice by watching
      const rotY = reducedMotion ? 0.05 : 0.1 * Math.sin(t * 0.000045);
      const cos = Math.cos(rotY), sin = Math.sin(rotY);
      const drift = reducedMotion ? 0 : 1;

      // Project
      for (const n of nodes) {
        const ox = n.x + drift * 0.028 * Math.sin(t * 0.0004 * n.sp + n.phx);
        const oy = n.y + drift * 0.024 * Math.sin(t * 0.00033 * n.sp + n.phy);
        const oz = n.z + drift * 0.028 * Math.sin(t * 0.00037 * n.sp + n.phz);
        const rx = ox * cos - oz * sin;
        const rz = ox * sin + oz * cos;
        const scale = FOV / (FOV + rz);
        let px = cx + rx * scale * R;
        let py = cy + oy * scale * R;

        // Cursor gravity: gentle attraction with smooth return
        let tx = 0, ty = 0;
        if (mouse.x > -999) {
          const mdx = mouse.x - px, mdy = mouse.y - py;
          const md = Math.hypot(mdx, mdy);
          if (md < GRAV_R && md > 0.01) {
            const f = (1 - md / GRAV_R) ** 2 * 20;
            tx = (mdx / md) * f;
            ty = (mdy / md) * f;
          }
        }
        n.dx += (tx - n.dx) * 0.06;
        n.dy += (ty - n.dy) * 0.06;
        px += n.dx; py += n.dy;

        // Center mask: quiet behind the headline, present at the edges
        const edgeF = Math.min(Math.hypot((px - cx) / (w * 0.5), (py - cy) / (h * 0.5)), 1);
        const mask = 0.25 + 0.75 * edgeF * edgeF;
        const twinkle = 0.62 + 0.38 * Math.sin(t * 0.001 * n.tw + n.twp);

        n.px = px; n.py = py; n.ps = scale;
        n.pa = mask * twinkle * (0.35 + 0.65 * ((scale - 0.76) / 0.55));
      }

      // Lines: three alpha buckets, one stroke each (batching beats per-line strokes)
      const buckets: Array<Path2D> = [new Path2D(), new Path2D(), new Path2D()];
      for (let i = 0; i < edges.length; i++) {
        const a = nodes[edges[i][0]], b = nodes[edges[i][1]];
        const alpha = (a.pa + b.pa) * 0.5;
        const bi = alpha < 0.28 ? 0 : alpha < 0.5 ? 1 : 2;
        buckets[bi].moveTo(a.px, a.py);
        buckets[bi].lineTo(b.px, b.py);
      }
      ctx.lineWidth = 0.5;
      const lineRGB = dark ? '214,228,255' : '30,41,59';
      const lineAlphas = dark ? [0.045, 0.09, 0.15] : [0.06, 0.11, 0.17];
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(${lineRGB},${lineAlphas[i]})`;
        ctx.stroke(buckets[i]);
      }

      // Nodes: pre-baked bloom sprites
      const sprite = dark ? spriteWhite : spriteDark;
      for (const n of nodes) {
        const size = (2.4 + 5 * (n.ps - 0.76)) * 2.2;
        ctx.globalAlpha = Math.max(n.pa, 0.02) * (dark ? 0.9 : 0.75);
        ctx.drawImage(sprite, n.px - size / 2, n.py - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // Information pulses: rare, calm, blue-white
      if (!reducedMotion) {
        if (pulses.length < 3 && Math.random() < 0.008) {
          pulses.push({ edge: (Math.random() * edges.length) | 0, t: 0, dur: 1600 + Math.random() * 1400 });
        }
        const pulseSprite = dark ? spriteBlue : spriteDarkBlue;
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += 16.7;
          const k = p.t / p.dur;
          if (k >= 1) { pulses.splice(i, 1); continue; }
          const a = nodes[edges[p.edge][0]], b = nodes[edges[p.edge][1]];
          const px = a.px + (b.px - a.px) * k;
          const py = a.py + (b.py - a.py) * k;
          ctx.globalAlpha = Math.sin(Math.PI * k) * 0.85 * Math.max((a.pa + b.pa) * 0.6, 0.15);
          ctx.drawImage(pulseSprite, px - 7, py - 7, 14, 14);
        }
        ctx.globalAlpha = 1;
      }
    };

    let raf = 0;
    let running = false;
    const loop = (t: number) => {
      draw(t);
      if (running) raf = requestAnimationFrame(loop);
    };

    // Only animate while the hero is on screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reducedMotion) {
        if (!running) { running = true; raf = requestAnimationFrame(loop); }
      } else {
        running = false;
        cancelAnimationFrame(raf);
        if (reducedMotion) draw(0); // static composition for reduced motion
      }
    });
    io.observe(canvas);
    draw(0); // first frame paints synchronously; the loop takes over when visible

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

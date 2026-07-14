'use client';

import { useEffect, useRef } from 'react';

/* Premium hero background: dense neural canopy surrounding hero text.
   8-lobe halo + inner ring — ~500 nodes, ~2000 edges.
   Dark mode: white nodes + blue glow.
   Light mode: monochrome slate nodes + brand orange (#ea580c) accent glows only on activation.
   Cursor glow halo (Interactive Cursor pattern).
   Canvas 2D, pre-rendered sprites. 60fps. */

interface Node {
  x: number; y: number; z: number;
  ph: number;
  sp: number;
  tw: number; twp: number;
  dx: number; dy: number;
  px: number; py: number; ps: number; pa: number;
  act: number;
  clusterId: number;
  clusterPhase: number;
}

function buildNodes(count: number, rand: () => number): Node[] {
  const nodes: Node[] = [];
  const lobes = [
      { cx: 0,    cy: 0.42, cz: -0.06, rx: 0.68, ry: 0.46, rz: 0.42, count: 0.14 },
      { cx: -0.55, cy: 0.16, cz: 0,    rx: 0.62, ry: 0.50, rz: 0.44, count: 0.13 },
      { cx:  0.55, cy: 0.16, cz: 0,    rx: 0.62, ry: 0.50, rz: 0.44, count: 0.135 },  // slight right boost
      { cx: -0.38, cy: -0.05, cz: 0.08, rx: 0.56, ry: 0.46, rz: 0.42, count: 0.12 },
      { cx:  0.38, cy: -0.05, cz: 0.08, rx: 0.56, ry: 0.46, rz: 0.42, count: 0.125 }, // slight right boost
      { cx: -0.58, cy: -0.28, cz: 0.06, rx: 0.58, ry: 0.44, rz: 0.40, count: 0.11 },
      { cx:  0.58, cy: -0.28, cz: 0.06, rx: 0.58, ry: 0.44, rz: 0.40, count: 0.115 }, // slight right boost
      { cx: 0,    cy: -0.44, cz: 0.10, rx: 0.70, ry: 0.36, rz: 0.44, count: 0.08 },
    ];
  const innerCount = Math.floor(count * 0.06);

  for (const lobe of lobes) {
    const n = Math.floor(count * lobe.count);
    for (let i = 0; i < n; i++) {
      const u = rand() * 2 - 1;
      const theta = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = 0.35 + 0.65 * Math.pow(rand(), 0.55);
      const cid = Math.floor(rand() * 28);
      nodes.push({
        x: s * Math.cos(theta) * r * lobe.rx + lobe.cx,
        y: (u * r + 0.10) * lobe.ry + lobe.cy,
        z: s * Math.sin(theta) * r * lobe.rz + lobe.cz,
        ph: rand() * Math.PI * 2,
        sp: 0.35 + rand() * 0.65,
        tw: 0.3 + rand() * 0.7, twp: rand() * Math.PI * 2,
        dx: 0, dy: 0,
        px: 0, py: 0, ps: 1, pa: 0, act: 0,
        clusterId: cid,
        clusterPhase: cid / 28,
      });
    }
  }
  for (let i = 0; i < innerCount; i++) {
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 0.4 + 0.6 * Math.pow(rand(), 0.6);
    const cid = Math.floor(rand() * 28);
    nodes.push({
      x: s * Math.cos(theta) * r * 0.52,
      y: (u * r + 0.08) * 0.48 - 0.02,
      z: s * Math.sin(theta) * r * 0.44,
      ph: rand() * Math.PI * 2,
      sp: 0.4 + rand() * 0.6,
      tw: 0.4 + rand() * 0.6, twp: rand() * Math.PI * 2,
      dx: 0, dy: 0,
      px: 0, py: 0, ps: 1, pa: 0, act: 0,
      clusterId: cid,
      clusterPhase: cid / 28,
    });
  }
  return nodes;
}

function buildEdges(nodes: Node[], perNode: number): Array<[number, number, number]> {
  const edges: Array<[number, number, number]> = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const dists: Array<[number, number]> = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const a = nodes[i], b = nodes[j];
      dists.push([(a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2, j]);
    }
    dists.sort((p, q) => p[0] - q[0]);
    for (let k = 0; k < perNode; k++) {
      const j = dists[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) { seen.add(key); edges.push(i < j ? [i, j, 0] : [j, i, 0]); }
    }
  }
  return edges;
}

// makeSprite is now inlined as mkTier inside the component for the 4-layer system.
// makeRing remains for activation rings.

function makeRing(peak: string, fade: string, size = 80): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const g = c.getContext('2d')!;
  const center = size / 2;
  const grad = g.createRadialGradient(center, center, size * 0.17, center, center, size * 0.48);
  // Soft feathered ring: wide transparent approach, gentle peak, long fade
  grad.addColorStop(0.00, 'rgba(0,0,0,0)');
  grad.addColorStop(0.15, 'rgba(0,0,0,0)');
  grad.addColorStop(0.50, peak);
  grad.addColorStop(0.85, fade);
  grad.addColorStop(1.00, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

// Continuous phase-space activation (replaces discrete clusterActivation)
function smoothClusterActivation(globalPhase: number, nodeClusterPhase: number, activeWidth: number = 0.15): number {
  // Circular distance in 0..1 phase space
  let dist = Math.abs(globalPhase - nodeClusterPhase);
  dist = dist > 0.5 ? 1 - dist : dist;
  // Smooth cosine-squared falloff with zero derivative at boundaries
  if (dist >= activeWidth) return 0;
  const t = dist / activeWidth;
  return Math.cos(t * Math.PI / 2) ** 4;
}

export default function NeuralNet({ theme, reducedMotion }: { theme: string; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = coarse || (navigator.hardwareConcurrency ?? 8) <= 4;
    const N = lowPower ? 320 : 500;

    let seed = 1337;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const nodes = buildNodes(N, rand);
    const edges = buildEdges(nodes, 4);

    // 4-layer sprite system: depth-tiered sprites for per-frame depth perception
    // Near: big core, tight halo. Far: small core, wide dim halo.
    const mkTier = (core: string, halo: string, size = 36, haloMul = 1) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const g = c.getContext('2d')!;
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, core);
      grad.addColorStop(0.3 / haloMul, halo);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      return c;
    };

    // Dark mode: 4 tiers from near (bright white) to deep (dim blue-grey)
    const sDarkTier = [
      mkTier('rgba(255,255,260,0.98)', 'rgba(210,220,250,0.45)', 44, 0.8),  // near: brightest, tightest
      mkTier('rgba(245,245,250,0.92)', 'rgba(200,210,230,0.30)', 36, 1.0),  // mid: current base
      mkTier('rgba(210,220,235,0.78)', 'rgba(170,185,210,0.22)', 30, 1.4),  // far: dimmer, wider halo
      mkTier('rgba(180,195,215,0.60)', 'rgba(150,170,195,0.15)', 28, 1.8),  // deep: barely visible
    ];
    // Light mode: 4 tiers — monochrome slate/charcoal base, NOT orange.
    // Near (slate-900) → Mid (slate-600) → Far (slate-400) → Deep (slate-300)
    const sLightTier = [
      mkTier('rgba(15,23,42,0.92)',  'rgba(71,85,105,0.55)', 44, 0.8),   // near: slate-900
      mkTier('rgba(30,41,59,0.85)',  'rgba(100,116,139,0.50)', 36, 1.0),  // mid: slate-700/600
      mkTier('rgba(51,65,85,0.75)',  'rgba(148,163,184,0.40)', 30, 1.4),  // far: slate-500
      mkTier('rgba(71,85,105,0.60)', 'rgba(203,213,225,0.30)', 28, 1.8),  // deep: slate-400/300
    ];

    // Accent sprites — activation glow
    // Dark mode: cyan-blue accent (brand blue)
    const sAccDark   = mkTier('rgba(56,189,248,0.72)',  'rgba(125,211,252,0.35)');
    // Light mode: EXACT brand orange #ea580c (rgba(234,88,12,...))
    const sAccLight  = mkTier('rgba(234,88,12,0.95)',   'rgba(251,146,60,0.58)');

    // Rings — soft feathered via makeRing
    const sRingDark  = makeRing('rgba(56,189,248,0.18)',    'rgba(56,189,248,0.03)');
    const sRingLight = makeRing('rgba(234,88,12,0.24)',     'rgba(234,88,12,0.06)');

    // Pulses — traveling edge highlights
    const sPulseDark = mkTier('rgba(125,211,252,0.88)', 'rgba(56,189,248,0.38)', 24);
    const sPulseLight= mkTier('rgba(251,146,60,0.95)',  'rgba(254,178,108,0.55)', 24);

    // Cursor glow sprite — subtle 120px halo
    const sCursorDark  = mkTier('rgba(56,189,248,0.22)', 'rgba(56,189,248,0.06)', 120);
    const sCursorLight = mkTier('rgba(234,88,12,0.25)',   'rgba(251,146,60,0.08)', 120);

    const parent = canvas.parentElement ?? canvas;
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      cx = w / 2; cy = h * 0.48;
      // Phase 4: Responsive edge-to-edge scaling
      const aspect = w / h;
      if (aspect > 1.6) {
        R = w * 0.48; // ultra-wide: expand horizontal radius
      } else {
        R = Math.max(w * 0.55, h * 0.65); // standard: ensure vertical coverage
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const mouse = { x: -9999, y: -9999 };
    const clearMouse = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const updateMouse = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    if (!coarse && !reducedMotion) {
      window.addEventListener('pointermove', updateMouse, { passive: true });
      window.addEventListener('blur', clearMouse);
    }

    const CYCLE = 22000;
    const FOV = 2.6;
    const GRAV_R = 180;

    const bucketEdges: [number[], number[], number[]] = [[], [], []];
    const edgeClusterMap = new Map<number, Set<number>>();
    edges.forEach((_, i) => edgeClusterMap.set(i, new Set([nodes[edges[i][0]].clusterId, nodes[edges[i][1]].clusterId])));

    const pulses: { edge: number; t: number; dur: number }[] = [];

    const draw = (t: number) => {
      const isDark = themeRef.current !== 'light';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      bg.addColorStop(0, isDark ? 'rgba(20,170,250,0.005)' : 'rgba(245,125,40,0.005)');
      bg.addColorStop(0.5, isDark ? 'rgba(8,190,220,0.003)' : 'rgba(255,175,80,0.003)');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const rot = reducedMotion ? 0.03 : 0.04 * Math.sin(t * 0.000018);
      const cos = Math.cos(rot), sin = Math.sin(rot);

      const phase = (t % CYCLE) / CYCLE;

      for (const n of nodes) {
        const drift = reducedMotion ? 0 : 1;
        const ox = n.x + drift * 0.008 * Math.sin(t * 0.00006 * n.sp + n.ph);
        const oy = n.y + drift * 0.006 * Math.sin(t * 0.00005 * n.sp + n.ph + 1);
        const oz = n.z + drift * 0.008 * Math.sin(t * 0.000055 * n.sp + n.ph + 2);
        const rx = ox * cos - oz * sin;
        const rz = ox * sin + oz * cos;
        const sc = FOV / (FOV + rz);
        let px = cx + rx * sc * R;
        let py = cy + oy * sc * R;

        if (mouse.x > -999) {
          const mdx = mouse.x - px, mdy = mouse.y - py;
          const md = Math.hypot(mdx, mdy);
          if (md < GRAV_R && md > 0.01) {
            const f = (1 - md / GRAV_R) ** 2 * 9;
            const tx = (mdx / md) * f;
            const ty = (mdy / md) * f;
            n.dx += (tx - n.dx) * 0.04;
            n.dy += (ty - n.dy) * 0.04;
          }
        } else {
          n.dx *= 0.92;
          n.dy *= 0.92;
        }
        px += n.dx; py += n.dy;

        const edgeF = Math.min(Math.hypot((px - cx) / (w * 0.5), (py - cy) / (h * 0.5)), 1);
        const mask = 0.45 + 0.55 * edgeF;
        const twinkle = 0.78 + 0.22 * Math.sin(t * 0.00008 + n.twp);

        // Phase 2: Continuous smooth cluster activation (no popping)
        n.act = reducedMotion ? 0 : smoothClusterActivation(phase, n.clusterPhase, 0.15);

        n.px = px; n.py = py; n.ps = sc;
        n.pa = mask * twinkle * (0.40 + 0.60 * Math.min((sc - 0.72) / 0.48, 1)) * (1 + n.act * 1.8);
      }

      bucketEdges[0].length = 0; bucketEdges[1].length = 0; bucketEdges[2].length = 0;
      for (let i = 0; i < edges.length; i++) {
        const a = nodes[edges[i][0]], b = nodes[edges[i][1]];
        const alpha = (a.pa + b.pa) * 0.5;
        // Depth fade: average perspective scale of both endpoints.
        // Near edges (ps ~1.2) keep full alpha. Far edges (ps ~0.8) fade to 60%.
        const depthFade = 0.55 + 0.45 * Math.min(((a.ps + b.ps) * 0.5 - 0.72) / 0.48, 1);
        bucketEdges[alpha * depthFade < 0.28 ? 0 : alpha * depthFade < 0.48 ? 1 : 2].push(i);
      }

      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // Light mode: refined slate edges at rest, brand orange only during activation.
      // Dark mode: cyan edges with depth-aware alpha.
      const lineRGB = isDark ? '170,225,255' : '71,85,105'; // slate-600 for light mode resting edges
      const drawBucket = (bucket: number[], lw: number, ad: number, al: number) => {
        if (!bucket.length) return;
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (const i of bucket) { const a = nodes[edges[i][0]], b = nodes[edges[i][1]]; ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); }
        ctx.strokeStyle = `rgba(${lineRGB},${isDark ? ad : al})`;
        ctx.stroke();
      };
      // Dark mode: depth-faded alpha tiers
      drawBucket(bucketEdges[0], 0.5, 0.10, 0.18);
      drawBucket(bucketEdges[1], 0.45, 0.18, 0.30);
      drawBucket(bucketEdges[2], 0.35, 0.26, 0.42);

      const spBase  = isDark ? sDarkTier : sLightTier;  // 4-tier array
      const spAcc   = isDark ? sAccDark   : sAccLight;
      const spRing  = isDark ? sRingDark  : sRingLight;
      const spPulse = isDark ? sPulseDark : sPulseLight;
      const spCursor= isDark ? sCursorDark: sCursorLight;

      for (const n of nodes) {
        // Depth tier: 0 (near) to 3 (deep) based on perspective scale
        const tier = n.ps > 1.12 ? 0 : n.ps > 0.96 ? 1 : n.ps > 0.84 ? 2 : 3;
        const tierSprite = spBase[tier];
        const tierSizeMul = [1.35, 1.0, 0.72, 0.55][tier];
        const size = (2.4 + 3.8 * Math.max(n.ps - 0.72, 0.05)) * 2 * tierSizeMul;
        // Light mode: raised alpha floor to 0.20 (was 0.10 — invisible on white)
        const alphaFloor = isDark ? [0.12, 0.10, 0.08, 0.05][tier] : [0.28, 0.22, 0.18, 0.12][tier];
        const alpha = Math.max(n.pa, alphaFloor) * (isDark ? 0.92 : 0.92);

        ctx.globalAlpha = alpha;
        ctx.drawImage(tierSprite, n.px - size / 2, n.py - size / 2, size, size);

        if (n.act > 0.03) {
          ctx.globalAlpha = n.act * (isDark ? 0.22 : 0.62);
          if (isDark) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(spAcc, n.px - size / 2, n.py - size / 2, size, size);
            ctx.globalCompositeOperation = 'source-over';
          } else {
            ctx.drawImage(spAcc, n.px - size / 2, n.py - size / 2, size, size);
          }
        }

        if (n.act > 0.04) {
          ctx.globalAlpha = n.act * (isDark ? 0.20 : 0.35);
          const rs = size * (2.0 + n.act * 2.2);
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(spRing, n.px - rs / 2, n.py - rs / 2, rs, rs);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      ctx.globalAlpha = 1;

      // Cursor glow — subtle halo following pointer
      if (mouse.x > -999 && !coarse && !reducedMotion) {
        ctx.globalAlpha = 0.45;
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(spCursor, mouse.x - 60, mouse.y - 60, 120, 120);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }

      if (!reducedMotion) {
        if (pulses.length < 2 && Math.random() < 0.002) {
          const pool = Array.from({ length: edges.length }, (_, i) => i);
          pulses.push({ edge: pool[(Math.random() * pool.length) | 0], t: 0, dur: 4000 + Math.random() * 6000 });
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += 16.7;
          const k = p.t / p.dur;
          if (k >= 1) { pulses.splice(i, 1); continue; }
          const a = nodes[edges[p.edge][0]], b = nodes[edges[p.edge][1]];
          ctx.globalAlpha = Math.sin(Math.PI * k) * 0.28 * Math.max((a.pa + b.pa) * 0.22, 0.03);
          ctx.drawImage(spPulse, a.px + (b.px - a.px) * k - 6, a.py + (b.py - a.py) * k - 6, 12, 12);
        }
        ctx.globalAlpha = 1;
      }
    };

    let raf = 0, running = false, canvasVisible = false;
    let pageVisible = document.visibilityState === 'visible';
    const loop = (t: number) => { draw(t); if (running) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      canvasVisible = e.isIntersecting;
      if (canvasVisible && pageVisible && !reducedMotion) { if (!running) { running = true; raf = requestAnimationFrame(loop); } }
      else { running = false; cancelAnimationFrame(raf); if (reducedMotion) draw(0); }
    });
    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === 'visible';
      if (!pageVisible) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (canvasVisible && !reducedMotion && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVisibilityChange);
    draw(0);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointermove', updateMouse);
      window.removeEventListener('blur', clearMouse);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
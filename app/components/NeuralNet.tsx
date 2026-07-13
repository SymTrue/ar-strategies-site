'use client';

import { useEffect, useRef } from 'react';

/* Premium hero background: dense neural canopy surrounding hero text.
   Inverse cursor interaction: cursor creates a dim zone, everything outside
   lights up like a slow breathing electric current propagating from cursor to edges.
   Low base brightness, especially near text center. */

interface Node {
  x: number; y: number; z: number;
  ph: number;        // phase offset for drift
  sp: number;        // speed multiplier
  tw: number; twp: number; // twinkle
  dx: number; dy: number; // mouse gravity velocity
  px: number; py: number; // projected position
  ps: number;        // perspective scale
  pa: number;        // final alpha
  baseAlpha: number; // base alpha (dim state)
  distToCursor: number; // distance to cursor for inverse glow
}

function buildNodes(count: number, rand: () => number): Node[] {
  const nodes: Node[] = [];
  const lobes = [
    { cx: 0,    cy: 0.42, cz: -0.06, rx: 0.68, ry: 0.46, rz: 0.42, count: 0.14 },
    { cx: -0.55, cy: 0.16, cz: 0,    rx: 0.62, ry: 0.50, rz: 0.44, count: 0.13 },
    { cx:  0.55, cy: 0.16, cz: 0,    rx: 0.62, ry: 0.50, rz: 0.44, count: 0.13 },
    { cx: -0.38, cy: -0.05, cz: 0.08, rx: 0.56, ry: 0.46, rz: 0.42, count: 0.12 },
    { cx:  0.38, cy: -0.05, cz: 0.08, rx: 0.56, ry: 0.46, rz: 0.42, count: 0.12 },
    { cx: -0.58, cy: -0.28, cz: 0.06, rx: 0.58, ry: 0.44, rz: 0.40, count: 0.11 },
    { cx:  0.58, cy: -0.28, cz: 0.06, rx: 0.58, ry: 0.44, rz: 0.40, count: 0.11 },
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
      nodes.push({
        x: s * Math.cos(theta) * r * lobe.rx + lobe.cx,
        y: (u * r + 0.10) * lobe.ry + lobe.cy,
        z: s * Math.sin(theta) * r * lobe.rz + lobe.cz,
        ph: rand() * Math.PI * 2,
        sp: 0.35 + rand() * 0.65,
        tw: 0.3 + rand() * 0.7, twp: rand() * Math.PI * 2,
        dx: 0, dy: 0,
        px: 0, py: 0, ps: 1, pa: 0,
        baseAlpha: 0,
        distToCursor: 9999,
      });
    }
  }
  for (let i = 0; i < innerCount; i++) {
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 0.4 + 0.6 * Math.pow(rand(), 0.6);
    nodes.push({
      x: s * Math.cos(theta) * r * 0.52,
      y: (u * r + 0.08) * 0.48 - 0.02,
      z: s * Math.sin(theta) * r * 0.44,
      ph: rand() * Math.PI * 2,
      sp: 0.4 + rand() * 0.6,
      tw: 0.4 + rand() * 0.6, twp: rand() * Math.PI * 2,
      dx: 0, dy: 0,
      px: 0, py: 0, ps: 1, pa: 0,
      baseAlpha: 0,
      distToCursor: 9999,
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

function makeSprite(core: string, halo: string, size = 36): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, core);
  grad.addColorStop(0.3, halo);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

function makeRing(peak: string, fade: string, size = 80): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const g = c.getContext('2d')!;
  const center = size / 2;
  const grad = g.createRadialGradient(center, center, size * 0.17, center, center, size * 0.48);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.30, 'rgba(0,0,0,0)');
  grad.addColorStop(0.48, peak);
  grad.addColorStop(0.70, fade);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function NeuralNet({ theme, reducedMotion }: { theme: string; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  useEffect(() => { themeRef.current = theme; }, [theme]);

  // Cursor position with spring smoothing for organic feel
  const mouse = { x: -9999, y: -9999 };
  const springMouse = { x: -9999, y: -9999 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = coarse || (navigator.hardwareConcurrency ?? 8) <= 4;
    const N = lowPower ? 280 : 420;

    let seed = 1337;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const nodes = buildNodes(N, rand);
    const edges = buildEdges(nodes, 3);

    // Sprites - DIM base, bright only on activation
        const isDarkMode = themeRef.current !== 'light';
        const sBaseDark  = makeSprite('rgba(140,170,190,0.35)', 'rgba(110,140,170,0.08)');
        const sBaseLight = makeSprite('rgba(220,100,0,0.95)',   'rgba(255,150,20,0.55)');
        const sAccDark   = makeSprite('rgba(50,170,240,0.70)',  'rgba(90,200,255,0.20)');
        const sAccLight  = makeSprite('rgba(255,130,0,0.95)',   'rgba(255,170,30,0.55)');
        const sRingDark  = makeRing('rgba(50,160,240,0.08)',    'rgba(50,160,240,0.01)');
        const sRingLight = makeRing('rgba(255,120,0,0.12)',     'rgba(255,140,10,0.03)');

    const parent = canvas.parentElement ?? canvas;
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      cx = w / 2; cy = h * 0.48;
      R = Math.min(w * 0.62, h * 0.92);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Mouse tracking with immediate response for inverse glow
    const mouse = { x: -9999, y: -9999 };
    const springMouse = { x: -9999, y: -9999 };

    if (!coarse && !reducedMotion) {
      window.addEventListener('pointermove', (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        // Initialize spring on first move
        if (springMouse.x === -9999) {
          springMouse.x = mouse.x;
          springMouse.y = mouse.y;
        }
      }, { passive: true });
      document.documentElement.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
    }

    const FOV = 2.6;
    const GRAV_R = 180;

    const draw = (t: number) => {
      const isDark = themeRef.current !== 'light';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Very subtle centered gradient - barely visible
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      bg.addColorStop(0, isDark ? 'rgba(5,80,110,0.004)' : 'rgba(210,100,15,0.004)');
      bg.addColorStop(0.5, isDark ? 'rgba(3,60,90,0.002)' : 'rgba(180,80,10,0.002)');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Spring-smoothed cursor for organic movement
      springMouse.x += (mouse.x - springMouse.x) * 0.06;
      springMouse.y += (mouse.y - springMouse.y) * 0.06;

      const rot = reducedMotion ? 0.005 : 0.008 * Math.sin(t * 0.000006); // even slower
      const cos = Math.cos(rot), sin = Math.sin(rot);

      // Inverse glow parameters
      const cursorRadius = 160;      // dim zone radius around cursor
      const maxGlowRadius = Math.max(w, h) * 0.85;
      const cursorActive = mouse.x > -999;  // Use raw mouse for immediate response

      // Pre-compute node states
      for (const n of nodes) {
        // Very slow ambient drift
        const drift = reducedMotion ? 0 : 1;
        const ox = n.x + drift * 0.003 * Math.sin(t * 0.00002 * n.sp + n.ph);
        const oy = n.y + drift * 0.0025 * Math.sin(t * 0.000018 * n.sp + n.ph + 1);
        const oz = n.z + drift * 0.003 * Math.sin(t * 0.000022 * n.sp + n.ph + 2);
        const rx = ox * cos - oz * sin;
        const rz = ox * sin + oz * cos;
        const sc = FOV / (FOV + rz);
        let px = cx + rx * sc * R;
        let py = cy + oy * sc * R;

        // Gentle mouse gravity (attracts nodes slightly) - use spring for smoothness
        if (cursorActive) {
          const mdx = springMouse.x - px, mdy = springMouse.y - py;
          const md = Math.hypot(mdx, mdy);
          if (md < GRAV_R && md > 0.01) {
            const f = (1 - md / GRAV_R) ** 2 * 2; // gentler
            const tx = (mdx / md) * f;
            const ty = (mdy / md) * f;
            n.dx += (tx - n.dx) * 0.015;
            n.dy += (ty - n.dy) * 0.015;
          }
        }
        px += n.dx; py += n.dy;

        // Distance to cursor for inverse glow - use RAW mouse for immediate response
        let distToCursor = 9999;
        if (cursorActive) {
          const cdx = px - mouse.x;
          const cdy = py - mouse.y;
          distToCursor = Math.hypot(cdx, cdy);
        }
        n.distToCursor = distToCursor;

        // INVERSE GLOW: nodes FAR from cursor get brighter
        // Near cursor (within cursorRadius) = DIM
        // Far from cursor = BRIGHT, with slow breathing wave propagating outward
        let inverseGlow = 1;
        if (cursorActive) {
          if (distToCursor < cursorRadius) {
            // Inside cursor zone: very dim (8-25%)
            inverseGlow = 0.08 + 0.17 * (distToCursor / cursorRadius);
          } else {
            // Outside: glow propagates outward, peaking at ~60% radius
            const progress = Math.min((distToCursor - cursorRadius) / (maxGlowRadius - cursorRadius), 1);
            // Slow breathing wave moving outward over time
            const wavePhase = (t * 0.00005 + progress * Math.PI * 1.0) % (Math.PI * 2);
            const wave = Math.max(0, Math.sin(wavePhase));
            inverseGlow = 0.18 + 0.82 * progress * (0.55 + 0.45 * wave);
          }
        }

        // Subtle twinkle
        const twinkle = 0.88 + 0.12 * Math.sin(t * 0.00004 + n.twp);

        // Projected position
        const edgeF = Math.min(Math.hypot((px - cx) / (w * 0.5), (py - cy) / (h * 0.5)), 1);
        const mask = 0.50 + 0.30 * edgeF; // dimmer center
        const scaleFactor = 0.45 + 0.40 * Math.min((sc - 0.55) / 0.65, 1); // smaller scale range

        n.px = px; n.py = py; n.ps = sc;
        n.pa = mask * twinkle * scaleFactor * inverseGlow * 0.5; // overall dimmer (was 0.28)
        n.baseAlpha = 0.12 * inverseGlow; // base dim state (was 0.05)
      }

      // Edge bucketing with inverse glow
      const bucketEdges: [number[], number[], number[]] = [[], [], []];
      for (let i = 0; i < edges.length; i++) {
        const a = nodes[edges[i][0]];
        const b = nodes[edges[i][1]];
        const avgGlow = (a.baseAlpha + b.baseAlpha) * 0.5;
        bucketEdges[avgGlow < 0.06 ? 0 : avgGlow < 0.15 ? 1 : 2].push(i);
      }

      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const lineRGB = isDark ? '100,180,220' : '20,20,20';
      // Edges also follow inverse glow - dimmer near cursor
      const darkAlphas = [0.15, 0.30, 0.55];
      const lightAlphas = [0.15, 0.30, 0.50];
      const drawBucket = (bucket: number[], lw: number, ad: number, al: number) => {
        if (!bucket.length) return;
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (const i of bucket) {
          const a = nodes[edges[i][0]], b = nodes[edges[i][1]];
          ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py);
        }
        ctx.strokeStyle = `rgba(${lineRGB},${isDark ? ad : al})`;
        ctx.stroke();
      };
      drawBucket(bucketEdges[0], 0.5, darkAlphas[0], lightAlphas[0]);
      drawBucket(bucketEdges[1], 0.4, darkAlphas[1], lightAlphas[1]);
      drawBucket(bucketEdges[2], 0.35, darkAlphas[2], lightAlphas[2]);

      // Draw nodes
      const spBase  = isDark ? sBaseDark  : sBaseLight;
      const spAcc   = isDark ? sAccDark   : sAccLight;
      const spRing  = isDark ? sRingDark  : sRingLight;

      for (const n of nodes) {
        const size = (1.8 + 2.8 * Math.max(n.ps - 0.65, 0.05)) * 2;
        const twinkle = 0.90 + 0.10 * Math.sin(t * 0.000035 + n.twp);
        const alpha = Math.max(n.pa, n.baseAlpha) * twinkle;

        ctx.globalAlpha = alpha;
        ctx.drawImage(spBase, n.px - size / 2, n.py - size / 2, size, size);

        // Rare subtle accent flash
        if (alpha > 0.2 && Math.random() < 0.0005) {
          ctx.globalAlpha = alpha * 0.3;
          ctx.drawImage(spAcc, n.px - size / 2, n.py - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;

      // No cursor halo - the inverse glow IS the cursor response
    };

    let raf = 0, running = false;
    const loop = (t: number) => { draw(t); if (running) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reducedMotion) { if (!running) { running = true; raf = requestAnimationFrame(loop); } }
      else { running = false; cancelAnimationFrame(raf); if (reducedMotion) draw(0); }
    });
    io.observe(canvas);
    draw(0);

    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

export { NeuralNet };
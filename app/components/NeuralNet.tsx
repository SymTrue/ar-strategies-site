'use client';

import { useEffect, useRef } from 'react';

/* Premium hero background: dense neural canopy surrounding hero text.
   8-lobe halo + inner ring — ~500 nodes, ~2000 edges.
   Dark mode: white nodes + blue glow. Light mode: orange nodes + black edges + amber glow.
   Cursor glow halo (Interactive Cursor pattern), boosted light-mode visibility.
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
        px: 0, py: 0, ps: 1, pa: 0, act: 0,
        clusterId: Math.floor(rand() * 28),
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
      px: 0, py: 0, ps: 1, pa: 0, act: 0,
      clusterId: Math.floor(rand() * 28),
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

const FI = 0.55, FO = 0.78;
function clusterActivation(cp: number, cid: number, tc: number): number {
  const p = ((cp + cid / tc) % 1);
  const fi = p < FI ? p / FI : 1;
  const fo = p > FO ? (1 - (p - FO) / (1 - FO)) : 1;
  return Math.sin(Math.min(fi, fo) * Math.PI / 2) ** 2;
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

    // Sprites — dark mode: white nodes + cyan glow; light mode: DEEP orange nodes + black edges
    // Light mode: use pure orange (blue=0) so blending with white keeps hue; higher alphas for contrast
    const sBaseDark  = makeSprite('rgba(240,240,245,0.92)', 'rgba(200,210,230,0.30)');
    const sBaseLight = makeSprite('rgba(230,100,0,0.98)',     'rgba(255,160,40,0.60)');  // deeper orange, blue=0
    const sAccDark   = makeSprite('rgba(70,190,245,0.72)',  'rgba(110,215,255,0.35)');
    const sAccLight  = makeSprite('rgba(255,140,0,0.98)',     'rgba(255,180,50,0.65)');  // deeper accent
    const sRingDark  = makeRing('rgba(70,190,245,0.18)',    'rgba(70,190,245,0.03)');
    const sRingLight = makeRing('rgba(255,130,0,0.28)',     'rgba(255,150,30,0.08)');  // stronger ring
    const sPulseDark = makeSprite('rgba(110,210,255,0.88)', 'rgba(80,195,255,0.38)', 24);
    const sPulseLight= makeSprite('rgba(255,150,0,0.98)',    'rgba(255,190,40,0.60)', 24);  // pulse visible on white
    // Cursor glow sprite — subtle 120px halo
    const sCursorDark  = makeSprite('rgba(70,180,245,0.22)', 'rgba(80,195,255,0.06)', 120);
    const sCursorLight = makeSprite('rgba(255,130,0,0.30)',  'rgba(255,160,30,0.10)', 120);  // visible on white

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

    const mouse = { x: -9999, y: -9999 };
    if (!coarse && !reducedMotion) {
      window.addEventListener('pointermove', (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      }, { passive: true });
      document.documentElement.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
    }

    const CLUSTERS = 28, ACTIVE = 3;
    const CYCLE = 22000;
    const FOV = 2.6;
    const GRAV_R = 180; // tightened per Interactive Cursor pattern (100px magnetic)

    const bucketEdges: [number[], number[], number[]] = [[], [], []];
    const activeEdges: number[] = [];
    const edgeClusterMap = new Map<number, Set<number>>();
    edges.forEach((_, i) => edgeClusterMap.set(i, new Set([nodes[edges[i][0]].clusterId, nodes[edges[i][1]].clusterId])));

    const pulses: { edge: number; t: number; dur: number }[] = [];

    const draw = (t: number) => {
      const isDark = themeRef.current !== 'light';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Symmetric radial gradient centered on canvas — fixes left-side bias
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      bg.addColorStop(0, isDark ? 'rgba(20,170,250,0.008)' : 'rgba(245,125,40,0.008)');
      bg.addColorStop(0.5, isDark ? 'rgba(8,190,220,0.005)' : 'rgba(255,175,80,0.005)');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const rot = reducedMotion ? 0.03 : 0.04 * Math.sin(t * 0.000018);
      const cos = Math.cos(rot), sin = Math.sin(rot);

      const phase = (t % CYCLE) / CYCLE;
      const activeSet = new Set<number>();
      for (let c = 0; c < ACTIVE; c++) {
        activeSet.add(Math.floor(((phase + c * (CLUSTERS / ACTIVE) / CLUSTERS) % 1) * CLUSTERS) % CLUSTERS);
      }
      activeEdges.length = 0;
      for (let i = 0; i < edges.length; i++) {
        const cs = edgeClusterMap.get(i)!;
        for (const c of cs) if (activeSet.has(c)) { activeEdges.push(i); break; }
      }

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
        }
        px += n.dx; py += n.dy;

        const edgeF = Math.min(Math.hypot((px - cx) / (w * 0.5), (py - cy) / (h * 0.5)), 1);
        // Flatten radial falloff: was 0.45→1.0, now 0.7→1.0 for more uniform edge visibility
        const mask = 0.70 + 0.30 * edgeF;
        const twinkle = 0.78 + 0.22 * Math.sin(t * 0.00008 + n.twp);

        n.act = reducedMotion ? 0 : (activeSet.has(n.clusterId) ? clusterActivation(phase, n.clusterId, CLUSTERS) : 0);
        n.px = px; n.py = py; n.ps = sc;
        // Boost base visibility and reduce scale penalty for edge nodes
        const scaleFactor = 0.55 + 0.45 * Math.min((sc - 0.65) / 0.55, 1); // was 0.40 + 0.60 * (sc-0.72)/0.48
        n.pa = mask * twinkle * scaleFactor * (1 + n.act * 1.8);
      }

      bucketEdges[0].length = 0; bucketEdges[1].length = 0; bucketEdges[2].length = 0;
      for (let i = 0; i < edges.length; i++) {
        const alpha = (nodes[edges[i][0]].pa + nodes[edges[i][1]].pa) * 0.5;
        bucketEdges[alpha < 0.32 ? 0 : alpha < 0.55 ? 1 : 2].push(i);
      }

      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // Light mode: pure black edges with high alphas for white bg
      // Dark mode: cyan edges with very high alphas for dark bg visibility
      const lineRGB = isDark ? '170,225,255' : '0,0,0';
      // Dark mode alphas: 0.50, 0.75, 0.95
      // Light mode alphas: 0.35, 0.60, 0.85
      const darkAlphas = [0.50, 0.75, 0.95];
      const lightAlphas = [0.35, 0.60, 0.85];
      const drawBucket = (bucket: number[], lw: number, ad: number, al: number) => {
        if (!bucket.length) return;
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (const i of bucket) { const a = nodes[edges[i][0]], b = nodes[edges[i][1]]; ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); }
        ctx.strokeStyle = `rgba(${lineRGB},${isDark ? ad : al})`;
        ctx.stroke();
      };
      drawBucket(bucketEdges[0], 0.5, darkAlphas[0], lightAlphas[0]);
      drawBucket(bucketEdges[1], 0.45, darkAlphas[1], lightAlphas[1]);
      drawBucket(bucketEdges[2], 0.35, darkAlphas[2], lightAlphas[2]);

      const spBase  = isDark ? sBaseDark  : sBaseLight;
      const spAcc   = isDark ? sAccDark   : sAccLight;
      const spRing  = isDark ? sRingDark  : sRingLight;
      const spPulse = isDark ? sPulseDark : sPulseLight;
      const spCursor= isDark ? sCursorDark: sCursorLight;

      for (const n of nodes) {
        const size = (2.4 + 3.8 * Math.max(n.ps - 0.72, 0.05)) * 2;
        // Light mode: alpha floor 0.75 (was 0.65) - nodes must be solid on white
        // Dark mode: 0.25 floor (was 0.20)
        const alpha = Math.max(n.pa, isDark ? 0.25 : 0.75);

        ctx.globalAlpha = alpha;
        ctx.drawImage(spBase, n.px - size / 2, n.py - size / 2, size, size);

        if (n.act > 0.03) {
          // Light mode: source-over (not lighter) + very high alpha; Dark mode: lighter + lower alpha
          ctx.globalAlpha = n.act * (isDark ? 0.25 : 0.95);
          if (isDark) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(spAcc, n.px - size / 2, n.py - size / 2, size, size);
            ctx.globalCompositeOperation = 'source-over';
          } else {
            ctx.drawImage(spAcc, n.px - size / 2, n.py - size / 2, size, size);
          }
        }

        if (n.act > 0.04) {
          ctx.globalAlpha = n.act * (isDark ? 0.25 : 0.75);
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
          const pool = activeEdges.length && Math.random() < 0.5 ? activeEdges : Array.from({ length: edges.length }, (_, i) => i);
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
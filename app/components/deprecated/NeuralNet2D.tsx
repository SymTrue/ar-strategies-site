'use client';

import { useRef, useEffect, useState, useMemo } from 'react';

interface Node2D {
  x: number; y: number;
  baseX: number; baseY: number;
  vx: number; vy: number;
  radius: number;
  pulsePhase: number; pulseSpeed: number;
  color: string; connections: number[];
  type: 'core' | 'peripheral' | 'bridge';
}

interface Edge2D { from: number; to: number; strength: number; pulsePhase: number; isHighlighted: boolean; }

function createRand(seed = 1337) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}
function distance(x1: number, y1: number, x2: number, y2: number) { return Math.hypot(x2 - x1, y2 - y1); }

export default function NeuralNet2D({ mode = 'helix', theme, reducedMotion }: { mode?: 'helix' | 'brain'; theme: string; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const themeRef = useRef(theme);
  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  const network = useMemo(() => {
    const rand = createRand();
    const nodes: Node2D[] = []; const edges: Edge2D[] = [];
    const NODE_COUNT = 180, canvasW = 1400, canvasH = 700;
    if (mode === 'helix') {
      const startX = 80, startY = 80, endX = 1320, endY = 620;
      const turns = 3.5, radius = 45, strandOffset = Math.PI, totalStrands = Math.ceil(NODE_COUNT / 2);
      for (let i = 0; i < NODE_COUNT; i++) {
        const helixId = i % 2, strandIndex = Math.floor(i / 2), t = strandIndex / totalStrands;
        const angle = t * Math.PI * 2 * 3.5 + (helixId * Math.PI);
        const baseX = 80 + t * (canvasW - 160), baseY = 80 + t * (canvasH - 160);
        const noiseX = (rand() - 0.5) * 18, noiseY = (rand() - 0.5) * 18;
        const perpX = -Math.sin(angle) * 45, perpY = Math.cos(angle) * 45;
        const x = baseX + perpX + noiseX, y = baseY + perpY + noiseY;
        let type: 'core' | 'peripheral' | 'bridge' = 'core';
        if (strandIndex % 8 === 0 && strandIndex > 0 && strandIndex < totalStrands - 1) type = 'bridge';
        else if (rand() < 0.12) type = 'peripheral';
        const radius2 = type === 'core' ? 2.5 + rand() * 2 : type === 'bridge' ? 3.5 + rand() * 2 : 1.5 + rand() * 1.5;
        const hue = 195 + rand() * 25, saturation = 70 + rand() * 20;
        const lightness = type === 'core' ? 55 + rand() * 15 : type === 'bridge' ? 60 + rand() * 10 : 50 + rand() * 15;
        nodes.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0, radius: radius2, pulsePhase: rand() * Math.PI * 2, pulseSpeed: 0.0008 + rand() * 0.0012, color: `hsl(${hue}, ${saturation}%, ${lightness}%)`, connections: [], type });
      }
      const MAX_DIST = 110;
      for (let i = 0; i < NODE_COUNT; i++) {
        const dists: [number, number][] = [];
        for (let j = 0; j < NODE_COUNT; j++) { if (i === j) continue; const d = distance(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y); if (d < MAX_DIST) dists.push([d, j]); }
        dists.sort((a, b) => a[0] - b[0]);
        const connCount = nodes[i].type === 'bridge' ? 5 : nodes[i].type === 'core' ? 3 + Math.floor(rand() * 2) : 2;
        for (let k = 0; k < Math.min(connCount, dists.length); k++) {
          const j = dists[k][1], key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!edges.some(e => e.from === Math.min(i, j) && e.to === Math.max(i, j))) {
            edges.push({ from: i, to: j, strength: 0.3 + rand() * 0.4, pulsePhase: rand() * Math.PI * 2, isHighlighted: nodes[i].type === 'bridge' && nodes[j].type === 'bridge' });
            nodes[i].connections.push(j); nodes[j].connections.push(i);
          }
        }
      }
      for (let i = 0; i < NODE_COUNT - 1; i += 2) {
        if (Math.abs(nodes[i].x - nodes[i+1].x) < 60 && Math.abs(nodes[i].y - nodes[i+1].y) < 60) edges.push({ from: i, to: i+1, strength: 0.7, pulsePhase: rand() * Math.PI * 2, isHighlighted: true });
      }
    }
    return { nodes, edges };
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas || !mounted) return;
    const ctx = canvas.getContext('2d', { alpha: true }); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, animationId: number, running = false;
    const { nodes, edges } = network, time = { current: 0 };
    const resize = () => { const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height; canvas.width = w * 2; canvas.height = h * 2; ctx.setTransform(2, 0, 0, 2, 0, 0); };
    const animate = (timestamp: number) => {
      if (!running) return; time.current = timestamp;
      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, Math.max(w, h) * 0.7);
      if (themeRef.current !== 'light') { gradient.addColorStop(0, 'rgba(14, 165, 233, 0.03)'); gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.015)'); gradient.addColorStop(1, 'transparent'); }
      else { gradient.addColorStop(0, 'rgba(14, 165, 233, 0.02)'); gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.01)'); gradient.addColorStop(1, 'transparent'); }
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
      nodes.forEach(node => { if (!reducedMotion) { node.vx += Math.sin(time.current * 0.0003 + node.pulsePhase) * 0.015; node.vy += Math.cos(time.current * 0.00025 + node.pulsePhase) * 0.015; node.vx += (node.baseX - node.x) * 0.0008; node.vy += (node.baseY - node.y) * 0.0008; node.vx *= 0.985; node.vy *= 0.985; node.x += node.vx; node.y += node.vy; } });
      edges.forEach(edge => { const from = nodes[edge.from], to = nodes[edge.to]; if (!from || !to) return; const pulse = Math.sin(time.current * 0.001 + edge.pulsePhase), pulseAlpha = 0.5 + 0.5 * Math.abs(pulse), alpha = edge.strength * pulseAlpha * (edge.isHighlighted ? 1.4 : 1); if (alpha < 0.05) return; ctx.beginPath(); ctx.moveTo(from.x, from.y); const midX = (from.x + to.x) * 0.5, midY = (from.y + to.y) * 0.5, cpX = midX + (from.y - to.y) * 0.15, cpY = midY + (to.x - from.x) * 0.15; ctx.quadraticCurveTo(cpX, cpY, to.x, to.y); const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y); if (themeRef.current !== 'light') { grad.addColorStop(0, `hsla(195, 70%, 65%, ${alpha * 0.4})`); grad.addColorStop(0.5, `hsla(195, 70%, 70%, ${alpha * 0.7})`); grad.addColorStop(1, `hsla(195, 70%, 65%, ${alpha * 0.4})`); } else { grad.addColorStop(0, `hsla(195, 70%, 40%, ${alpha * 0.3})`); grad.addColorStop(0.5, `hsla(195, 70%, 45%, ${alpha * 0.5})`); grad.addColorStop(1, `hsla(195, 70%, 40%, ${alpha * 0.3})`); } ctx.strokeStyle = grad; ctx.lineWidth = edge.isHighlighted ? 1.5 : 0.8; ctx.lineCap = 'round'; ctx.stroke(); });
      nodes.forEach(node => { const pulse = Math.sin(time.current * node.pulseSpeed + node.pulsePhase), pulseScale = 1 + 0.18 * Math.abs(pulse), radius = node.radius * pulseScale, alpha = node.type === 'core' ? 1 : node.type === 'bridge' ? 0.95 : 0.8; const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3.5); const hue = node.type === 'bridge' ? 175 : 195; glowGrad.addColorStop(0, `hsla(${hue}, 80%, 65%, ${alpha * 0.35})`); glowGrad.addColorStop(0.5, `hsla(${hue}, 70%, 60%, ${alpha * 0.12})`); glowGrad.addColorStop(1, 'transparent'); ctx.beginPath(); ctx.arc(node.x, node.y, radius * 3.5, 0, Math.PI * 2); ctx.fillStyle = glowGrad; ctx.fill(); const coreGrad = ctx.createRadialGradient(node.x - radius * 0.2, node.y - radius * 0.2, 0, node.x, node.y, radius); const lightness = node.type === 'bridge' ? 70 : node.type === 'core' ? 65 : 55; coreGrad.addColorStop(0, `hsla(${hue}, 85%, ${lightness}%, ${alpha})`); coreGrad.addColorStop(0.7, `hsla(${hue}, 75%, ${lightness - 10}%, ${alpha})`); coreGrad.addColorStop(1, `hsla(${hue}, 65%, ${lightness - 20}%, ${alpha * 0.6})`); ctx.beginPath(); ctx.arc(node.x, node.y, radius, 0, Math.PI * 2); ctx.fillStyle = coreGrad; ctx.fill(); if (node.type !== 'peripheral') { ctx.beginPath(); ctx.arc(node.x - radius * 0.25, node.y - radius * 0.25, radius * 0.35, 0, Math.PI * 2); ctx.fillStyle = `hsla(${hue}, 90%, 85%, ${alpha * 0.5})`; ctx.fill(); } });
      animationId = requestAnimationFrame(animate);
    };
    resize(); running = true; animationId = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(animationId); };
  }, [network, reducedMotion, mounted]);

  if (!mounted) return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} aria-hidden="true" />;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} aria-hidden="true" />;
}
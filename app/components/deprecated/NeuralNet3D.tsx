'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Brand colors
const BRAND_COLORS = [
  new THREE.Color(0xea580c), // orange
  new THREE.Color(0xf59e0b), // amber
  new THREE.Color(0x06b6d4), // cyan
  new THREE.Color(0x8b5cf6), // violet
  new THREE.Color(0xec4899), // pink
];

interface NodeData {
  basePosition: THREE.Vector3;
  phase: THREE.Vector3;
  speed: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: THREE.Color;
  size: number;
  isRung: boolean;
}

function createRand(seed: number = 1337) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function buildNodes(count: number, rand: () => number): NodeData[] {
  const nodes: NodeData[] = [];
  const HELIX_RADIUS = 55;
  const HELIX_HEIGHT = 140;
  const HELIX_TURNS = 3.5;
  const totalStrands = Math.ceil(count / 2);

  for (let i = 0; i < count; i++) {
    const helixId = i % 2;
    const strandIndex = Math.floor(i / 2);
    const t = strandIndex / totalStrands;
    const angle = t * Math.PI * 2 * HELIX_TURNS + (helixId * Math.PI);
    
    const radius = HELIX_RADIUS * (0.85 + 0.3 * Math.sin(t * Math.PI * 2));
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = (t - 0.5) * HELIX_HEIGHT;

    const noiseScale = 8;
    const nx = x + (rand() - 0.5) * noiseScale;
    const ny = y + (rand() - 0.5) * noiseScale * 0.5;
    const nz = z + (rand() - 0.5) * noiseScale;

    const basePos = new THREE.Vector3(nx, ny, nz);
    const color = BRAND_COLORS[Math.floor(rand() * BRAND_COLORS.length)].clone();
    const size = 2.5 + rand() * 3.5;
    const isRung = i % 2 === 0 && i < count - 1;

    nodes.push({
      basePosition: basePos,
      phase: new THREE.Vector3(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
      speed: 0.15 + rand() * 0.35,
      pulsePhase: rand() * Math.PI * 2,
      pulseSpeed: 0.3 + rand() * 0.7,
      color,
      size,
      isRung,
    });
  }
  return nodes;
}

function buildEdges(nodes: NodeData[], perNode: number): [number, number][] {
  const edges: [number, number][] = [];
  const edgeSet = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    const dists: [number, number][] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const d = nodes[i].basePosition.distanceToSquared(nodes[j].basePosition);
      dists.push([d, j]);
    }
    dists.sort((a, b) => a[0] - b[0]);
    
    for (let k = 0; k < perNode; k++) {
      const j = dists[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push(i < j ? [i, j] : [j, i]);
      }
    }
  }

  // DNA rungs
  for (let i = 0; i < nodes.length - 1; i += 2) {
    const key = `${i}-${i+1}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push([i, i + 1]);
    }
  }

  return edges;
}

// Shader materials
function createNodeMaterial(pixelRatio: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float size;
      attribute float pulsePhase;
      attribute float pulseSpeed;
      attribute vec3 baseColor;
      varying vec3 vColor;
      varying float vPulse;
      uniform float uTime;
      uniform float uPixelRatio;
      
      void main() {
        vColor = baseColor;
        float pulse = 1.0 + 0.4 * sin(uTime * 0.0015 * pulseSpeed + pulsePhase);
        vPulse = pulse;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * pulse * (300.0 / -mvPosition.z) * uPixelRatio;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vPulse;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha *= smoothstep(0.5, 0.0, dist);
        alpha = pow(alpha, 0.8);
        
        float core = 1.0 - smoothstep(0.0, 0.15, dist);
        alpha = max(alpha, core * vPulse * 0.6);
        
        vec3 finalColor = vColor * (0.7 + 0.3 * vPulse);
        
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(finalColor, alpha * 0.95);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
    },
  });
}

function createEdgeMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float baseAlpha;
      attribute float pulsePhase;
      attribute float pulseSpeed;
      attribute float isRung;
      attribute vec3 color;
      varying float vAlpha;
      varying vec3 vColor;
      varying float vPulse;
      varying float vIsRung;
      uniform float uTime;
      
      void main() {
        vColor = color;
        vIsRung = isRung;
        
        float signal = sin(uTime * 0.001 * pulseSpeed + pulsePhase);
        float pulse = 1.0 + 0.6 * signal;
        
        if (isRung > 0.5) {
          pulse = 1.0 + 1.2 * abs(signal);
        }
        
        vAlpha = baseAlpha * pulse;
        vPulse = pulse;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying vec3 vColor;
      varying float vPulse;
      varying float vIsRung;
      
      void main() {
        float alpha = vAlpha * (0.5 + 0.5 * vPulse);
        
        if (vIsRung > 0.5) {
          alpha *= 1.8;
        }
        
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
    },
  });
}

function createFlowMaterial(pixelRatio: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float size;
      attribute float progress;
      attribute vec3 color;
      varying float vProgress;
      varying vec3 vColor;
      uniform float uPixelRatio;
      
      void main() {
        vProgress = progress;
        vColor = color;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * uPixelRatio;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vProgress;
      varying vec3 vColor;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha = pow(alpha, 0.5);
        
        float trail = smoothstep(0.0, 1.0, vProgress);
        alpha *= (1.0 - trail) * 1.5;
        
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
    },
  });
}

// --- Components that create Three.js objects synchronously ---

function NodePointsInner({ nodes, nodeMaterial, pixelRatio, reducedMotion }: { 
  nodes: NodeData[], 
  nodeMaterial: THREE.ShaderMaterial,
  pixelRatio: number,
  reducedMotion: boolean 
}) {
  const positions = useMemo(() => new Float32Array(nodes.length * 3), [nodes.length]);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Create Three.js objects synchronously during render
  if (!geometryRef.current) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('baseColor', new THREE.BufferAttribute(new Float32Array(nodes.length * 3), 3));
    geom.setAttribute('size', new THREE.BufferAttribute(new Float32Array(nodes.length), 1));
    geom.setAttribute('pulsePhase', new THREE.BufferAttribute(new Float32Array(nodes.length), 1));
    geom.setAttribute('pulseSpeed', new THREE.BufferAttribute(new Float32Array(nodes.length), 1));
    
    const colors = geom.getAttribute('baseColor') as THREE.BufferAttribute;
    const sizes = geom.getAttribute('size') as THREE.BufferAttribute;
    const pulsePhases = geom.getAttribute('pulsePhase') as THREE.BufferAttribute;
    const pulseSpeeds = geom.getAttribute('pulseSpeed') as THREE.BufferAttribute;
    
    nodes.forEach((n, i) => {
      colors.setXYZ(i, n.color.r, n.color.g, n.color.b);
      sizes.setX(i, n.size);
      pulsePhases.setX(i, n.pulsePhase);
      pulseSpeeds.setX(i, n.pulseSpeed);
    });
    
    geometryRef.current = geom;
    pointsRef.current = new THREE.Points(geom, nodeMaterial);
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 1000;
    const pos = geometryRef.current?.getAttribute('position') as THREE.BufferAttribute;
    if (!pos) return;
    
    nodes.forEach((n, i) => {
      let posVec = n.basePosition.clone();
      
      if (!reducedMotion) {
        posVec.x += 0.028 * Math.sin(t * 0.0004 * n.speed + n.phase.x);
        posVec.y += 0.024 * Math.sin(t * 0.00033 * n.speed + n.phase.y);
        posVec.z += 0.028 * Math.sin(t * 0.00037 * n.speed + n.phase.z);
      }
      
      const rotY = reducedMotion ? 0 : 0.1 * Math.sin(t * 0.000045);
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);
      const rx = posVec.x * cos - posVec.z * sin;
      const rz = posVec.x * sin + posVec.z * cos;
      
      pos.setXYZ(i, rx, posVec.y, rz);
    });
    
    pos.needsUpdate = true;
    nodeMaterial.uniforms.uTime.value = t;
    nodeMaterial.uniforms.uPixelRatio.value = pixelRatio;
  });

  return (
    <primitive
      object={pointsRef.current!}
      renderOrder={1}
    />
  );
}

function EdgeLinesInner({ nodes, edges, edgeMaterial, reducedMotion }: { 
  nodes: NodeData[], 
  edges: [number, number][],
  edgeMaterial: THREE.ShaderMaterial,
  reducedMotion: boolean 
}) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  if (!geometryRef.current) {
    const positions = new Float32Array(edges.length * 2 * 3);
    const colors = new Float32Array(edges.length * 2 * 3);
    const baseAlphas = new Float32Array(edges.length * 2);
    const pulsePhases = new Float32Array(edges.length);
    const pulseSpeeds = new Float32Array(edges.length);
    const isRungs = new Float32Array(edges.length);

    let seed = 98765;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    edges.forEach(([a, b], i) => {
      const na = nodes[a];
      const nb = nodes[b];
      const isRung = Math.abs(a - b) === 1 && Math.min(a, b) % 2 === 0;

      positions[i * 6] = na.basePosition.x;
      positions[i * 6 + 1] = na.basePosition.y;
      positions[i * 6 + 2] = na.basePosition.z;
      positions[i * 6 + 3] = nb.basePosition.x;
      positions[i * 6 + 4] = nb.basePosition.y;
      positions[i * 6 + 5] = nb.basePosition.z;

      colors[i * 6] = na.color.r;
      colors[i * 6 + 1] = na.color.g;
      colors[i * 6 + 2] = na.color.b;
      colors[i * 6 + 3] = nb.color.r;
      colors[i * 6 + 4] = nb.color.g;
      colors[i * 6 + 5] = nb.color.b;

      baseAlphas[i * 2] = isRung ? 0.35 : 0.18;
      baseAlphas[i * 2 + 1] = isRung ? 0.35 : 0.18;
      pulsePhases[i] = rand() * Math.PI * 2;
      pulseSpeeds[i] = 0.2 + rand() * 0.5;
      isRungs[i] = isRung ? 1.0 : 0.0;
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('baseAlpha', new THREE.BufferAttribute(baseAlphas, 1));
    geom.setAttribute('pulsePhase', new THREE.BufferAttribute(pulsePhases, 1));
    geom.setAttribute('pulseSpeed', new THREE.BufferAttribute(pulseSpeeds, 1));
    geom.setAttribute('isRung', new THREE.BufferAttribute(isRungs, 1));
    
    geometryRef.current = geom;
    lineRef.current = new THREE.LineSegments(geom, edgeMaterial);
  }

  useFrame((state) => {
    edgeMaterial.uniforms.uTime.value = state.clock.getElapsedTime() * 1000;
  });

  return (
    <primitive
      object={lineRef.current!}
      renderOrder={0}
    />
  );
}

interface FlowParticle {
  edgeIndex: number;
  progress: number;
  speed: number;
  size: number;
}

function FlowParticlesInner({ nodes, edges, flowMaterial, pixelRatio, reducedMotion }: { 
  nodes: NodeData[], 
  edges: [number, number][],
  flowMaterial: THREE.ShaderMaterial,
  pixelRatio: number,
  reducedMotion: boolean 
}) {
  if (reducedMotion) return null;
  
  const FLOW_COUNT = 40;
  const particlesRef = useRef<FlowParticle[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const pointsRef = useRef<THREE.Points>(null);

  if (!geometryRef.current) {
    const particles: FlowParticle[] = [];
    for (let i = 0; i < FLOW_COUNT; i++) {
      particles.push({
        edgeIndex: Math.floor(Math.random() * edges.length),
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.35,
        size: 3 + Math.random() * 4,
      });
    }
    particlesRef.current = particles;

    const positions = new Float32Array(FLOW_COUNT * 3);
    const colors = new Float32Array(FLOW_COUNT * 3);
    const sizes = new Float32Array(FLOW_COUNT);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    geometryRef.current = geom;
    pointsRef.current = new THREE.Points(geom, flowMaterial);
  }

  useFrame((state) => {
    const dt = state.clock.getDelta();
    const positions = geometryRef.current?.getAttribute('position') as THREE.BufferAttribute;
    const colors = geometryRef.current?.getAttribute('color') as THREE.BufferAttribute;
    const sizes = geometryRef.current?.getAttribute('size') as THREE.BufferAttribute;
    
    if (!positions || !colors || !sizes) return;

    particlesRef.current.forEach((p, i) => {
      const [a, b] = edges[p.edgeIndex];
      const na = nodes[a];
      const nb = nodes[b];
      
      p.progress += p.speed * dt;
      if (p.progress > 1) {
        p.progress = 0;
        p.edgeIndex = Math.floor(Math.random() * edges.length);
        p.speed = 0.15 + Math.random() * 0.35;
      }

      const pos = na.basePosition.clone().lerp(nb.basePosition, p.progress);
      positions.setXYZ(i, pos.x, pos.y, pos.z);

      const color = na.color.clone().lerp(nb.color, p.progress);
      colors.setXYZ(i, color.r, color.g, color.b);
      sizes.setX(i, p.size);
    });

    positions.needsUpdate = true;
    colors.needsUpdate = true;
    sizes.needsUpdate = true;
    
    flowMaterial.uniforms.uPixelRatio.value = pixelRatio;
  });

  return (
    <primitive
      object={pointsRef.current!}
      renderOrder={2}
    />
  );
}

// --- Main Component ---
export default function NeuralNet3D({ theme, reducedMotion }: { theme: string; reducedMotion: boolean }) {
  const [mounted, setMounted] = useState(false);

  const nodes = useMemo(() => buildNodes(220, createRand()), []);
  const edges = useMemo(() => buildEdges(nodes, 2), [nodes]);

  const [pixelRatio, setPixelRatio] = useState(1);
  const nodeMaterial = useMemo(() => createNodeMaterial(pixelRatio), [pixelRatio]);
  const edgeMaterial = useMemo(() => createEdgeMaterial(), []);
  const flowMaterial = useMemo(() => createFlowMaterial(pixelRatio), [pixelRatio]);

  useEffect(() => {
    setMounted(true);
    setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  if (!mounted) {
    return <div style={{ width: '100%', height: '100%', minHeight: '600px' }} />;
  }

  const dark = theme !== 'light';
  const bgColor = dark ? '#0a0a0f' : '#f8fafc';

  return (
    <div style={{ width: '100%', height: '600px', minHeight: '600px' }}>
      <Canvas
        camera={{ position: [0, 0, 180], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false 
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 100, 400]} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 50, 100]} intensity={0.5} color={dark ? 0xffaa66 : 0x6688ff} />
        
        <NodePointsInner 
          nodes={nodes} 
          nodeMaterial={nodeMaterial} 
          pixelRatio={pixelRatio} 
          reducedMotion={reducedMotion} 
        />
        <EdgeLinesInner 
          nodes={nodes} 
          edges={edges} 
          edgeMaterial={edgeMaterial} 
          reducedMotion={reducedMotion} 
        />
        <FlowParticlesInner 
          nodes={nodes} 
          edges={edges} 
          flowMaterial={flowMaterial} 
          pixelRatio={pixelRatio} 
          reducedMotion={reducedMotion} 
        />
      </Canvas>
    </div>
  );
}
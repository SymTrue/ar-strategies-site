import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'The Mechanism Library — AR Strategies',
  description:
    'The psychological mechanisms behind attention, memory, and choice. Free video explainers on the principles that make local businesses impossible to ignore.',
  alternates: { canonical: '/mechanisms' },
};

/* ---------- Line-art glyphs (blueprint language, no emoji) ---------- */

const GlyphInterruption = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" aria-hidden="true">
    <path d="M4 24 H18 L22 12 L27 36 L31 24 H44" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="24.5" cy="24" r="10" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
  </svg>
);

const GlyphAvailability = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" aria-hidden="true">
    <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="0.75" opacity="0.6" strokeDasharray="3 3" />
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="0.75" opacity="0.35" strokeDasharray="3 3" />
    <circle cx="33" cy="15" r="2.5" fill="currentColor" />
  </svg>
);

const GlyphPositioning = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" aria-hidden="true">
    <path d="M24 4 V16 M24 32 V44 M4 24 H16 M32 24 H44" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
    <circle cx="29" cy="19" r="3" fill="currentColor" />
  </svg>
);

/* ---------- Data ---------- */

const live = [
  {
    n: '01',
    id: 'pattern-interruption',
    name: 'Pattern Interruption',
    pillar: 'Attention',
    line: 'The brain filters out the expected. Different is what gets noticed.',
    glyph: <GlyphInterruption />,
  },
  {
    n: '02',
    id: 'mental-availability',
    name: 'Mental Availability',
    pillar: 'Memory',
    line: 'Customers choose the business they remember first, not the best one.',
    glyph: <GlyphAvailability />,
  },
  {
    n: '03',
    id: 'positioning',
    name: 'Positioning',
    pillar: 'Positioning',
    line: 'Perception is decided relative to alternatives. Own a position or lose on price.',
    glyph: <GlyphPositioning />,
  },
];

/* Ghost nodes: the rest of the 18-mechanism library, unpublished */
const ghosts = [
  'Recognition & Memory', 'Framing', 'Emotional Recall', 'Authority Formation',
  'Social Proof', 'Loss Aversion', 'Anchoring', 'Salience',
  'Distinctiveness', 'Consistency', 'Reciprocity', 'Curiosity Gap',
  'Peak-End Rule', 'Mere Exposure', 'Costly Signaling',
];

/* ---------- Neural network diagram ---------- */
/* Hand-placed layout: 3 live nodes (orange, linked) among 15 ghost nodes.
   Signal paths connect live nodes to each other and to nearby ghosts. */

const ghostPos: Array<[number, number]> = [
  [90, 70], [250, 180], [420, 60], [555, 210], [700, 80],
  [860, 190], [1020, 70], [1130, 170], [150, 300], [340, 340],
  [520, 300], [760, 330], [930, 300], [1080, 340], [640, 150],
];

const livePos: Record<string, [number, number]> = {
  'pattern-interruption': [300, 110],
  'mental-availability': [610, 250],
  'positioning': [950, 130],
};

function NetworkDiagram() {
  return (
    <svg
      viewBox="0 0 1200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Network map of the 18 psychological mechanisms. Three are published: Pattern Interruption, Mental Availability, and Positioning."
    >
      <defs>
        <pattern id="mechGrid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
        </pattern>
      </defs>
      <rect width="1200" height="400" fill="url(#mechGrid)" className="text-[var(--text-tertiary)]" />

      {/* Signal paths: live-to-live (solid) and live-to-ghost (dashed) */}
      <g stroke="var(--brand)" strokeWidth="1" opacity="0.45">
        <path d="M300 110 L610 250" />
        <path d="M610 250 L950 130" />
        <path d="M300 110 Q620 40 950 130" />
      </g>
      <g stroke="var(--text-tertiary)" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.35">
        <path d="M300 110 L90 70" /><path d="M300 110 L250 180" /><path d="M300 110 L420 60" />
        <path d="M610 250 L520 300" /><path d="M610 250 L555 210" /><path d="M610 250 L760 330" /><path d="M610 250 L640 150" />
        <path d="M950 130 L860 190" /><path d="M950 130 L1020 70" /><path d="M950 130 L1130 170" />
        <path d="M250 180 L150 300" /><path d="M420 60 L640 150" /><path d="M860 190 L930 300" />
      </g>

      {/* Ghost nodes: the unpublished 15 */}
      {ghosts.map((name, i) => {
        const [x, y] = ghostPos[i];
        return (
          <g key={name} className="text-[var(--text-tertiary)]">
            <circle cx={x} cy={y} r="4" fill="currentColor" opacity="0.35" />
            <circle cx={x} cy={y} r="8" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
            <text
              x={x}
              y={y + 22}
              textAnchor="middle"
              fill="currentColor"
              opacity="0.45"
              style={{ font: '500 10px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.08em' }}
            >
              {name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Live nodes: published mechanisms, clickable */}
      {live.map((m) => {
        const [x, y] = livePos[m.id];
        return (
          <a key={m.id} href={`/mechanisms/${m.id}`} className="group/node cursor-pointer">
            <circle cx={x} cy={y} r="22" fill="var(--brand)" opacity="0.1" />
            <circle cx={x} cy={y} r="13" stroke="var(--brand)" strokeWidth="1" fill="var(--background)" />
            <circle cx={x} cy={y} r="5.5" fill="var(--brand)" className="node-pulse" />
            <text
              x={x}
              y={y - 26}
              textAnchor="middle"
              fill="var(--text-primary)"
              style={{ font: '600 12.5px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.1em' }}
            >
              {m.name.toUpperCase()}
            </text>
            <text
              x={x}
              y={y + 36}
              textAnchor="middle"
              fill="var(--brand)"
              style={{ font: '500 9.5px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.14em' }}
            >
              ● WATCH
            </text>
          </a>
        );
      })}
    </svg>
  );
}

/* ---------- Page ---------- */

export default function MechanismsHub() {
  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      <SiteHeader />

      {/* Hero: editorial opening */}
      <section className="px-6 pt-20 md:pt-28 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="kicker-chip">
              <span className="kicker-n">03</span>
              <span className="kicker-sep" aria-hidden="true">/</span>
              <span>18 Published</span>
            </span>
            <span className="kicker-line" style={{ transform: 'scaleX(1)' }} aria-hidden="true" />
          </div>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[1.05] mb-6 max-w-4xl text-balance">
            The psychology your <span className="text-brand">customers run on</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl text-pretty">
            Every buying decision runs through the same mental machinery: what gets noticed,
            what gets remembered, what gets chosen. We map those mechanisms and engineer
            around them. Three explainers are live. The rest of the library is in production.
          </p>
        </div>
      </section>

      {/* Network diagram: the library as a system */}
      <section className="px-6 pb-8 hidden md:block" aria-hidden="false">
        <div className="max-w-7xl mx-auto border border-dashed border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              Fig. 01 — Mechanism network · 18 nodes
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              ● Live &nbsp;&nbsp;○ In production
            </span>
          </div>
          <NetworkDiagram />
        </div>
      </section>

      {/* Editorial index: the published mechanisms */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-dashed border-[var(--border)]">
            {live.map((m) => (
              <Link
                key={m.id}
                href={`/mechanisms/${m.id}`}
                className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_64px_1fr_auto_auto] items-center gap-5 md:gap-8 py-8 md:py-10 border-b border-dashed border-[var(--border)] transition-colors hover:bg-[var(--surface)]"
              >
                <span className="text-brand tabular-nums text-sm md:text-base" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  {m.n}
                </span>
                <span className="hidden md:block w-16 h-16 text-brand opacity-80 group-hover:opacity-100 transition-opacity">
                  {m.glyph}
                </span>
                <span>
                  <span className="block font-display uppercase text-2xl md:text-4xl leading-tight group-hover:text-brand transition-colors">
                    {m.name}
                  </span>
                  <span className="block text-sm md:text-base text-[var(--text-tertiary)] mt-2 max-w-xl">
                    {m.line}
                  </span>
                </span>
                <span className="hidden md:flex flex-col items-end gap-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  <span>{m.pillar} Pillar</span>
                  <span className="text-brand">Video Explainer</span>
                </span>
                <span className="text-brand text-2xl transition-transform group-hover:translate-x-1.5" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>

          {/* In production: the remaining library, as an honest roadmap */}
          <div className="mt-14">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-tertiary)] mb-5" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              In production — 15 remaining
            </p>
            <div className="flex flex-wrap gap-2.5">
              {ghosts.map((name) => (
                <span
                  key={name}
                  className="px-3.5 py-1.5 text-xs text-[var(--text-tertiary)] border border-dashed border-[var(--border)] rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-16 md:py-24 section-dashed">
        <div className="max-w-7xl mx-auto md:flex items-end justify-between gap-10">
          <div>
            <h2 className="font-display uppercase text-3xl md:text-5xl leading-tight mb-4 max-w-2xl">
              Theory is free. <span className="text-brand">Application is the service.</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl">
              Watch how these mechanisms took a gym from invisible to the #1 result in its city.
            </p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0 shrink-0">
            <Link href="/#contact" className="btn-primary px-7 py-3.5 rounded-full text-sm font-semibold transition-colors">
              Get My Free Audit
            </Link>
            <Link href="/#why" className="px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--border)] hover:border-brand transition-colors">
              See the Case Study
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

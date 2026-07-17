/* Inline Lucide-style icons (24×24 grid, 2px stroke, rounded caps: MIT, no
   external asset so nothing to hotlink and nothing for the CSP to block).
   Pure, prop-driven decorative components: no homepage state, safe to reuse
   or move without touching behavior. */

const svgBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

const icons: Record<string, React.ReactNode> = {
  // Google Rankings: location + magnifier (local search positioning)
  search: (<svg {...svgBase}><circle cx="11" cy="11" r="6" /><path d="m16 16 5 5" /><path d="M12 7v8m-4-4h8" /></svg>),
  // Meta Ads: megaphone + play (social ad conversion)
  megaphone: (<svg {...svgBase}><path d="M3 11l6-3v10l-6-3v-4m13-6v14m0-14l4-2v18l-4-2" /><path d="M8 13l-2 1m0-4l2 1" /></svg>),
  // Content That Sells: target + checkmark (conversion-focused content)
  pen: (<svg {...svgBase}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="2" /><path d="m15 9 3-3m-6 9 4 4" /></svg>),
  // No lock-in: open padlock
  unlock: (<svg {...svgBase}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>),
  // Full visibility: bar chart
  chart: (<svg {...svgBase}><line x1="4" y1="20" x2="4" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="20" y1="20" x2="20" y2="14" /></svg>),
};

export function IconTile({ name }: { name: string }) {
  return (
    <span
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-brand"
      style={{ background: 'var(--icon-tile)', border: '1px solid var(--icon-tile-border)' }}
    >
      {icons[name]}
    </span>
  );
}

// Social Icons: Instagram, LinkedIn, Website (24×24px Lucide-style)
export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37" fill="currentColor" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
  </svg>
);

export const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const WebsiteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Process Flow Component: Visual representation of 4-step process
export const ProcessFlow = () => (
  <svg viewBox="0 0 1000 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" aria-hidden>
    <defs>
      <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Connection line */}
    <line x1="80" y1="60" x2="920" y2="60" stroke="url(#processGrad)" strokeWidth="2" />
    {/* Step circles and labels */}
    {[1, 2, 3, 4].map((n) => {
      const x = 80 + (n - 1) * 280;
      return (
        <g key={n}>
          <circle cx={x} cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x={x} y="68" textAnchor="middle" className="text-xs font-bold fill-current">0{n}</text>
        </g>
      );
    })}
  </svg>
);

/* Registration corner marks: technical drawing accents on hover */
export const RegMarks = () => (
  <div className="reg-marks" aria-hidden="true">
    <span /><span /><span /><span />
  </div>
);

// Client Success Badge
export const FAQTag = ({ category }: { category: 'timeline' | 'pricing' | 'service' | 'contract' }) => {
  const colors = {
    timeline: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    pricing: 'bg-green-500/20 border-green-500/50 text-green-400',
    service: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    contract: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
  };
  const labels = {
    timeline: 'Timeline',
    pricing: 'Pricing',
    service: 'Service',
    contract: 'Contract',
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[category]}`}>
      {labels[category]}
    </span>
  );
};

// Premium Principle Icons for Why Us section
export const PrincipleExclusivityIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="exclusivityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Shield shape */}
    <path d="M32 8 L48 16 L48 34 Q48 48 32 56 Q16 48 16 34 L16 16 Z" fill="url(#exclusivityGrad)" />
    {/* Checkmark inside shield */}
    <path d="M26 34 L30 38 L38 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {/* Border glow */}
    <path d="M32 8 L48 16 L48 34 Q48 48 32 56 Q16 48 16 34 L16 16 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

export const PrincipleTransparencyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="transparencyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Eye shape */}
    <ellipse cx="32" cy="32" rx="20" ry="16" fill="url(#transparencyGrad)" opacity="0.2" />
    <path d="M12 32 Q32 18 52 32 Q32 46 12 32" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Iris */}
    <circle cx="32" cy="32" r="8" fill="url(#transparencyGrad)" />
    {/* Pupil */}
    <circle cx="32" cy="32" r="4" fill="currentColor" />
    {/* Highlight */}
    <circle cx="34" cy="30" r="1.5" fill="white" />
  </svg>
);

export const PrincipleNoLockInIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Contract/document - solid outline */}
    <rect x="16" y="14" width="32" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" />
    {/* Document lines */}
    <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    {/* Large X breaking through borders (freedom breaking free) */}
    <line x1="10" y1="6" x2="54" y2="58" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="54" y1="6" x2="10" y2="58" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

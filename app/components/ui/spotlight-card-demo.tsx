import { GlowCard } from './spotlight-card';

export default function SpotlightCardDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-8 sm:flex-row">
      <GlowCard glowColor="steel">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <span className="text-sm uppercase tracking-[0.16em] text-white/60">Steel (brand default)</span>
        </div>
      </GlowCard>
      <GlowCard glowColor="blue">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <span className="text-sm uppercase tracking-[0.16em] text-white/60">Blue (generic, non-brand)</span>
        </div>
      </GlowCard>
      <GlowCard glowColor="green">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <span className="text-sm uppercase tracking-[0.16em] text-white/60">Green (generic, non-brand)</span>
        </div>
      </GlowCard>
    </div>
  );
}

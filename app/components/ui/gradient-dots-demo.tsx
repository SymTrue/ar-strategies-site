import { GradientDots } from './gradient-dots';

export default function GradientDotsDemo() {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-white/10">
      <GradientDots duration={24} />
      <div className="relative z-10 flex h-full items-center justify-center">
        <h3 className="font-display text-4xl uppercase text-white">Gradient Dots</h3>
      </div>
    </div>
  );
}

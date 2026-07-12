'use client';

export function ShaderGradientBg() {
  return (
    <>
      {/* Animated shader gradient background with orange/black colors */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at 20% 50%,
              rgba(234, 88, 12, 0.4) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 80% 80%,
              rgba(234, 88, 12, 0.2) 0%,
              transparent 50%
            ),
            linear-gradient(135deg, #000000 0%, #1a0f00 50%, #000000 100%)
          `,
          animation: 'gradientShift 15s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}

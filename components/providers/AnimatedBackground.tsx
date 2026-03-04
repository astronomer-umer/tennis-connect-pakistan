"use client";

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Smooth flowing glow background */}
      <div className="absolute inset-0 bg-[#0a1628]">
        {/* Main ambient glow - moves slowly */}
        <div className="absolute inset-0 animate-ambient-flow">
          {/* Soft lime glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-lime-500/8 via-lime-500/4 to-transparent blur-3xl" />
          {/* Subtle orange accent */}
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-radial from-orange-500/6 via-orange-500/2 to-transparent blur-3xl" />
          {/* Secondary lime glow */}
          <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-radial from-lime-500/5 via-lime-500/2 to-transparent blur-3xl" />
        </div>
        
        {/* Noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

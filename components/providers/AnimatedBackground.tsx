"use client";

import { TennisRacketLogo } from "./TennisIcons";

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Fluid buttery spotlight background */}
      <div className="absolute inset-0 bg-[#0a1628]">
        {/* Animated spotlight - moves smoothly like liquid */}
        <div className="absolute inset-0">
          {/* Main lime spotlight - slow flowing */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-lime-500/12 via-lime-500/6 to-transparent blur-3xl animate-spotlight-1" />
          </div>
          
          {/* Secondary orange spotlight */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-orange-500/8 via-orange-500/3 to-transparent blur-3xl animate-spotlight-2" />
          </div>
          
          {/* Bottom lime accent */}
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-lime-500/6 via-lime-500/2 to-transparent blur-3xl animate-spotlight-3" />
          </div>
          
          {/* Subtle center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-lime-500/4 via-transparent to-transparent blur-2xl animate-spotlight-4" />
          </div>
        </div>
        
        {/* Semi-transparent racket watermark - centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8 pointer-events-none">
          <TennisRacketLogo size={400} />
        </div>
        
        {/* Very subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

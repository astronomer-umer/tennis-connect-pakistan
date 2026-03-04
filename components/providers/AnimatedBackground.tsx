"use client";

import { TennisBallWithRacket } from "./TennisIcons";

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a1628]">
        
        {/* Animated fluid spotlights */}
        <div className="absolute inset-0">
          {/* Main spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-lime-500/10 via-lime-500/4 to-transparent blur-3xl animate-spotlight-1" />
          </div>
          
          {/* Orange accent */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-orange-500/6 via-orange-500/2 to-transparent blur-3xl animate-spotlight-2" />
          </div>
          
          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-lime-500/5 via-lime-500/1 to-transparent blur-3xl animate-spotlight-3" />
          </div>
        </div>
        
        {/* Realistic ball+racket watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <TennisBallWithRacket size={350} />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

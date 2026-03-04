"use client";

import { useTheme } from "./ThemeProvider";

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Animated gradient background */}
      <AnimatedGradient />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function AnimatedGradient() {
  return (
    <>
      {/* Dark mode gradient */}
      <div className="dark:block hidden absolute inset-0">
        <div className="absolute inset-0 animate-gradient-1 opacity-80">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0f2744]" />
        </div>
        <div className="absolute inset-0 animate-gradient-2 opacity-60">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/10 blur-[100px] transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute inset-0 animate-gradient-3 opacity-40">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#f97316]/10 blur-[80px] transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="absolute top-1/2 left-1/2 animate-gradient-4 opacity-30">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#22c55e]/5 blur-[60px] transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
        </div>
      </div>

      {/* Light mode gradient */}
      <div className="dark:hidden block absolute inset-0">
        <div className="absolute inset-0 animate-gradient-1 opacity-80">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#f0fdf4]" />
        </div>
        <div className="absolute inset-0 animate-gradient-2 opacity-50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#16a34a]/10 blur-[80px] transform translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="absolute inset-0 animate-gradient-3 opacity-40">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#f97316]/10 blur-[60px] transform -translate-x-1/3 translate-y-1/3" />
        </div>
      </div>
    </>
  );
}

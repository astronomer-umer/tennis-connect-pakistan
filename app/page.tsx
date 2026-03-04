"use client";

import { CitySelector } from "@/components/discover/CitySelector";
import { HotCarousel } from "@/components/discover/HotCarousel";
import { SwipeStack } from "@/components/discover/SwipeStack";
import { TennisRacketLogo, TennisBallIcon } from "@/components/providers/TennisIcons";

function FloatingTennisBall({ style, delay }: { style?: React.CSSProperties; delay?: string }) {
  return (
    <div 
      className="absolute opacity-20 pointer-events-none" 
      style={{ 
        ...style, 
        animationDelay: delay || '0s',
        animation: 'float 4s ease-in-out infinite'
      }}
    >
      <TennisBallIcon size={36} />
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-dvh pb-tab relative overflow-hidden">
      {/* Floating decorations */}
      <FloatingTennisBall style={{ top: '5%', left: '2%' }} />
      <FloatingTennisBall style={{ top: '15%', right: '2%', animationDelay: '0.5s' }} />
      <FloatingTennisBall style={{ top: '40%', left: '5%', animationDelay: '1s' }} />
      
      {/* Top Bar */}
      <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Racket Logo */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-lg lime-glow">
              <TennisRacketLogo size={32} className="text-black" />
            </div>
            <div>
              <h1 className="text-foreground font-bold text-xl leading-none">
                Tennis Connect
              </h1>
              <p className="text-orange-500 text-xs font-bold tracking-widest uppercase">
                Pakistan
              </p>
            </div>
          </div>
        </div>
      </header>

      <CitySelector />

      <HotCarousel />

      <div className="mx-4 my-3 flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/50 text-sm font-medium tracking-wide uppercase">Discover</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <SwipeStack />
    </div>
  );
}

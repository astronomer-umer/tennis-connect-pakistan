"use client";

import { CitySelector } from "@/components/discover/CitySelector";
import { HotCarousel } from "@/components/discover/HotCarousel";
import { SwipeStack } from "@/components/discover/SwipeStack";
import { ThemeToggle } from "@/components/providers/ThemeToggle";

function TennisBall({ style, delay }: { style?: React.CSSProperties; delay?: string }) {
  return (
    <div 
      className="absolute opacity-20 pointer-events-none" 
      style={{ 
        ...style, 
        animationDelay: delay || '0s',
        animation: 'float 4s ease-in-out infinite'
      }}
    >
      <svg width="50" height="50" viewBox="0 0 40 40" className="text-lime-400">
        <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.2"/>
        <path d="M8 20 Q20 5 32 20 Q20 35 8 20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 20 Q20 35 32 20 Q20 5 8 20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-dvh pb-tab relative overflow-hidden">
      {/* Tennis ball decorations */}
      <TennisBall style={{ top: '5%', left: '2%' }} />
      <TennisBall style={{ top: '15%', right: '2%', animationDelay: '0.5s' }} />
      <TennisBall style={{ top: '40%', left: '5%', animationDelay: '1s' }} />
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 glass dark:glass border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center shadow-lg lime-glow">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-black">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12 Q12 4 16 12 Q12 20 8 12" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none tracking-tight">
                Tennis Connect
              </h1>
              <p className="text-orange-500 text-[10px] font-semibold tracking-widest uppercase">
                Pakistan
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <CitySelector />

      <HotCarousel />

      <div className="mx-4 my-3 flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/50 text-xs font-medium tracking-wide uppercase">Discover</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <SwipeStack />
    </div>
  );
}

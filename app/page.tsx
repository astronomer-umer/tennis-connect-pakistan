"use client";

import { CitySelector } from "@/components/discover/CitySelector";
import { HotCarousel } from "@/components/discover/HotCarousel";
import { SwipeStack } from "@/components/discover/SwipeStack";
import { TennisBallLogo } from "@/components/providers/TennisIcons";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-dvh pb-tab relative">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          {/* New Tennis Ball Logo */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center lime-glow">
            <TennisBallLogo size={44} />
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

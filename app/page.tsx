"use client";

import { useState } from "react";
import { CitySelector } from "@/components/discover/CitySelector";
import { HotCarousel } from "@/components/discover/HotCarousel";
import { SwipeStack } from "@/components/discover/SwipeStack";
import { TennisBallLogo } from "@/components/providers/TennisIcons";
import { ChevronDown, Target, MapPin, Zap, Trophy } from "lucide-react";

function MatchingExplanation() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-4 mt-4 mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-card/50 rounded-2xl border border-white/5"
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-lime-500" />
          <span className="text-sm font-medium text-white/80">How Matching Works</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      
      {expanded && (
        <div className="mt-3 p-4 bg-card/30 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-lime-500/10 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-lime-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">City First</h4>
              <p className="text-white/50 text-xs">Players in your city appear first for easy coordination</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Zap size={14} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Skill Level</h4>
              <p className="text-white/50 text-xs">We match players within ±0.5 level for fair games</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <Trophy size={14} className="text-orange-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Playing Style</h4>
              <p className="text-white/50 text-xs">Find players with compatible styles — grinders, attackers, all-courters</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-dvh pb-tab relative">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
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
        <div className="flex-1 net-divider" />
        <span className="text-white/50 text-sm font-medium tracking-wide uppercase">Discover</span>
        <div className="flex-1 net-divider" />
      </div>

      <SwipeStack />

      <MatchingExplanation />
    </div>
  );
}

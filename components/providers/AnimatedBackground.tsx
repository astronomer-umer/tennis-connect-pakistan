"use client";

import { TennisBallWithRacket } from "./TennisIcons";

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a1628]">

        {/* Animated fluid spotlights */}
        <div className="absolute inset-0">
          {/* Main lime spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-lime-500/10 via-lime-500/4 to-transparent blur-3xl animate-spotlight-1" />
          </div>

          {/* Orange accent top-right */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-orange-500/6 via-orange-500/2 to-transparent blur-3xl animate-spotlight-2" />
          </div>

          {/* Lime accent bottom-left */}
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px]">
            <div className="w-full h-full rounded-full bg-gradient-radial from-lime-500/5 via-lime-500/1 to-transparent blur-3xl animate-spotlight-3" />
          </div>
        </div>

        {/* Tennis court line overlay — subtle baseline + service box lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" preserveAspectRatio="none" viewBox="0 0 400 800">
          {/* Outer boundary */}
          <rect x="40" y="60" width="320" height="680" stroke="#22c55e" strokeWidth="1.5" fill="none" />
          {/* Center service line */}
          <line x1="200" y1="60" x2="200" y2="740" stroke="#22c55e" strokeWidth="1" />
          {/* Baseline */}
          <line x1="40" y1="400" x2="360" y2="400" stroke="#22c55e" strokeWidth="1" />
          {/* Service boxes */}
          <line x1="40" y1="230" x2="360" y2="230" stroke="#22c55e" strokeWidth="0.8" />
          <line x1="40" y1="570" x2="360" y2="570" stroke="#22c55e" strokeWidth="0.8" />
          {/* Doubles tramlines */}
          <line x1="80" y1="60" x2="80" y2="740" stroke="#22c55e" strokeWidth="0.5" />
          <line x1="320" y1="60" x2="320" y2="740" stroke="#22c55e" strokeWidth="0.5" />
        </svg>

        {/* Net mesh overlay — horizontal stripe across center */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 40">
            {/* Net mesh grid */}
            <g stroke="#FFFFFF" strokeWidth="0.3">
              {/* Vertical threads */}
              {Array.from({ length: 40 }, (_, i) => (
                <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="40" />
              ))}
              {/* Horizontal threads */}
              {[5, 10, 15, 20, 25, 30, 35].map((y) => (
                <line key={`h-${y}`} x1="0" y1={y} x2="400" y2={y} />
              ))}
            </g>
            {/* Top cable */}
            <line x1="0" y1="1" x2="400" y2="1" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* Floating ball particles — 3 small balls drifting */}
        <div className="absolute w-3 h-3 rounded-full bg-lime-400/15 animate-ball-float-1 top-[15%] left-[20%] pointer-events-none" />
        <div className="absolute w-2 h-2 rounded-full bg-lime-400/10 animate-ball-float-2 top-[60%] right-[15%] pointer-events-none" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-orange-400/10 animate-ball-float-3 bottom-[25%] left-[65%] pointer-events-none" />

        {/* 3D mesh ball+racket watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none animate-spotlight-4">
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

"use client";

import { useState, useEffect } from "react";
import { TennisRacketLogo, TennisBallIcon } from "./TennisIcons";

export function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1628] to-[#1e3a5f]">
      {/* Court line decorations */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute top-[20%] left-[15%] right-[15%] h-[1px] bg-lime-500" />
        <div className="absolute bottom-[20%] left-[15%] right-[15%] h-[1px] bg-lime-500" />
        <div className="absolute top-[20%] bottom-[20%] left-[15%] w-[1px] bg-lime-500" />
        <div className="absolute top-[20%] bottom-[20%] right-[15%] w-[1px] bg-lime-500" />
        <div className="absolute top-[20%] bottom-[20%] left-1/2 w-[1px] bg-lime-500" />
      </div>

      {/* Animated logo */}
      <div className="relative mb-10">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center lime-glow animate-pulse mesh-shimmer">
          <TennisRacketLogo size={64} className="text-black animate-racket-swing" />
        </div>
        {/* Floating ball with bounce */}
        <div className="absolute -top-4 -right-4 animate-ball-bounce">
          <TennisBallIcon size={28} />
        </div>
      </div>

      {/* Logo text */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white tracking-wider">
          TENNIS<span className="text-lime-500">CONNECT</span>
        </h1>
        <p className="text-orange-500 text-sm font-bold tracking-[0.4em] mt-3">
          PAKISTAN
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-72 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-lime-500 to-orange-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="text-white/50 text-sm mt-5 font-medium">
        Loading{progress < 30 ? '' : progress < 60 ? '..' : '...'}
      </p>
    </div>
  );
}

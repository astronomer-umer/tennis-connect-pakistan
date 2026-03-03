"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increments to simulate realistic loading
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    // Hide splash after progress completes
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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1628] to-[#152a45]">
      {/* Animated tennis ball */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-lime-400/20 flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-lime-400/40 flex items-center justify-center animate-pulse">
            <svg viewBox="0 0 40 40" className="w-12 h-12 text-lime-400 animate-spin">
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 20 Q20 5 32 20 Q20 35 8 20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 20 Q20 35 32 20 Q20 5 8 20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-lime-400/30 blur-xl -z-10 animate-pulse" />
      </div>

      {/* Logo text */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-wider">
          TENNIS<span className="text-lime-400">CONNECT</span>
        </h1>
        <p className="text-orange-500 text-sm font-medium tracking-[0.3em] mt-2">
          PAKISTAN
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-lime-400 to-orange-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="text-white/50 text-xs mt-4 font-medium">
        Loading{progress < 30 ? '' : progress < 60 ? '..' : '...'}
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Zap, User, MessageCircle, Trophy, Calendar, Music2, Music } from "lucide-react";
import { useSoundContext } from "@/components/providers/SoundProvider";

const TABS = [
  { href: "/", label: "Discover", Icon: Zap },
  { href: "/courts", label: "Courts", Icon: MapPin },
  { href: "/matches", label: "Matches", Icon: MessageCircle },
  { href: "/profile", label: "Profile", Icon: User },
];

const EXTRA_TABS = [
  { href: "/leaderboard", label: "Rank", Icon: Trophy },
  { href: "/tournaments", label: "Events", Icon: Calendar },
];

const HIDDEN_PATHS = ["/onboarding", "/login", "/signup", "/admin-login", "/admin", "/leaderboard", "/tournaments"];

export function BottomTabBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { isMuted, toggleMute, isMusicPlaying, toggleMusic, playSound } = useSoundContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Hide tab bar on auth, onboarding, and admin pages
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass pb-safe">
      {/* Court-line top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-lime-500/20 to-transparent" />
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 h-16">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-200 ${
                active ? "text-lime-500" : "text-white/50"
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-2xl bg-lime-500/10 brand-glow" />
              )}

              <Icon
                size={24}
                strokeWidth={active ? 2.5 : 1.8}
              />

              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors ${
                  active ? "text-lime-500" : "text-white/50"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
        {/* Extra tabs as icons */}
        {EXTRA_TABS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-200 ${
                active ? "text-lime-500" : "text-white/50"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold ${active ? "text-lime-500" : "text-white/50"}`}>
                {label}
              </span>
            </Link>
          );
        })}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={() => { playSound("tap"); toggleMusic(); }}
            className={`p-2 rounded-xl transition-all ${isMusicPlaying ? "text-brand" : "text-white/40"}`}
            aria-label={isMusicPlaying ? "Stop music" : "Play music"}
          >
            {isMusicPlaying ? <Music2 size={18} /> : <Music size={18} />}
          </button>
          <button
            onClick={() => { playSound("tap"); toggleMute(); }}
            className={`p-2 rounded-xl transition-all ${isMuted ? "text-red-400" : "text-white/40"}`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <span className="text-xs font-bold">{isMuted ? "🔇" : "🔊"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

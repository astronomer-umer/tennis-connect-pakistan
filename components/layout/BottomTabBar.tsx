"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Zap, User, Flame } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

function TennisIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

const TABS = [
  { href: "/", label: "Discover", Icon: TennisIcon },
  { href: "/courts", label: "Courts", Icon: MapPin },
  { href: "/matches", label: "Matches", Icon: Zap },
  { href: "/profile", label: "Profile", Icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const matchCount = useAppStore((s) => s.matches.length);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 glass pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 h-14">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          const showBadge = href === "/matches" && matchCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-all duration-200 ${
                active ? "text-brand" : "text-muted-foreground"
              }`}
            >
              {/* Glow pill behind active icon */}
              {active && (
                <span className="absolute inset-0 rounded-2xl bg-brand/10 brand-glow" />
              )}

              <span className="relative">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? "drop-shadow-[0_0_8px_#00ff9d]" : ""}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse-orange">
                    {matchCount > 9 ? "9+" : matchCount}
                  </span>
                )}
              </span>

              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors ${
                  active ? "text-brand" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

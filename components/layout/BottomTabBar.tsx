"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Zap, User, MessageCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const TABS = [
  { href: "/", label: "Discover", Icon: Zap },
  { href: "/courts", label: "Courts", Icon: MapPin },
  { href: "/chat", label: "Chat", Icon: MessageCircle },
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

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 ${
                active ? "text-lime-500" : "text-muted-foreground"
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-2xl bg-lime-500/10 brand-glow" />
              )}

              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? "drop-shadow-[0_0_8px_#22c55e]" : ""}
              />

              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors ${
                  active ? "text-lime-500" : "text-muted-foreground"
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

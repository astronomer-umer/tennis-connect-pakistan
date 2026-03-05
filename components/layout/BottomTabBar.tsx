"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Zap, User, MessageCircle } from "lucide-react";

const TABS = [
  { href: "/", label: "Discover", Icon: Zap },
  { href: "/courts", label: "Courts", Icon: MapPin },
  { href: "/chat", label: "Chat", Icon: MessageCircle },
  { href: "/profile", label: "Profile", Icon: User },
];

const HIDDEN_PATHS = ["/onboarding", "/login", "/signup", "/admin-login", "/admin"];

export function BottomTabBar() {
  const pathname = usePathname();

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
              className={`relative flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all duration-200 ${
                active ? "text-lime-500" : "text-white/50"
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-2xl bg-lime-500/10 brand-glow" />
              )}

              <Icon
                size={26}
                strokeWidth={active ? 2.5 : 1.8}
              />

              <span
                className={`text-[11px] font-semibold tracking-wide transition-colors ${
                  active ? "text-lime-500" : "text-white/50"
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

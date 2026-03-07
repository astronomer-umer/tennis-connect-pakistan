"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, UserPlus } from "lucide-react";
import { useSession } from "@/lib/auth/client";

const HIDDEN_PATHS = ["/onboarding", "/login", "/signup", "/admin-login", "/admin"];
const DISMISS_KEY = "tcp-banner-dismissed";

export function SignUpBanner() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true); // default hidden until hydrated

  useEffect(() => {
    // Check sessionStorage on mount
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    setDismissed(wasDismissed);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  // Don't show while loading, if user is authenticated, if dismissed, or on auth pages
  if (isPending || session || dismissed) return null;
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-lime-500 to-lime-600 text-black px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
      {/* Court-line bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-lime-700/50 via-lime-800/30 to-lime-700/50" />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <UserPlus size={18} className="shrink-0" />
        <p className="text-sm font-semibold truncate">
          Complete your profile to connect with players!
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/onboarding"
          className="px-4 py-1.5 bg-black text-lime-400 font-bold text-sm rounded-xl hover:bg-black/80 transition-colors"
        >
          Get Started
        </Link>
        <button
          onClick={dismiss}
          className="p-1 hover:bg-black/10 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus, X } from "lucide-react";
import { useSession } from "@/lib/auth/client";

const HIDDEN_PATHS = ["/onboarding", "/login", "/signup", "/admin-login", "/admin", "/docs"];
const DISMISS_KEY = "tcp-banner-dismissed";

export function SignUpBanner() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    setDismissed(wasDismissed);
    if (!wasDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
    setTimeout(() => setDismissed(true), 400);
  };

  if (isPending || session || dismissed) return null;
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className={`fixed bottom-20 right-4 left-4 sm:left-auto sm:w-auto sm:max-w-sm z-50 transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-lime-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
        
        <div className="relative bg-gradient-to-br from-lime-400 to-lime-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
              <UserPlus size={24} className="text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-black font-bold text-sm leading-tight">
                Complete your profile
              </p>
              <p className="text-black/70 text-xs">
                Connect with players
              </p>
            </div>
          </div>
          
          <div className="flex border-t border-black/10">
            <Link
              href="/onboarding"
              className="flex-1 px-4 py-2.5 bg-black text-lime-400 font-bold text-sm text-center hover:bg-black/90 transition-colors"
              onClick={dismiss}
            >
              Get Started
            </Link>
            <button
              onClick={dismiss}
              className="px-4 py-2.5 bg-black/10 text-black/60 hover:bg-black/20 transition-colors"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-lime-500 rotate-45 hidden sm:block" />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus, X, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth/client";

const HIDDEN_PATHS = ["/onboarding", "/login", "/signup", "/admin-login", "/admin", "/docs", "/forgot-password", "/profile", "/matches", "/courts", "/chat"];
const DISMISS_KEY = "tcp_banner_dismissed";
const DISMISSED_AT_KEY = "tcp_banner_dismissed_at";

export function SignUpBanner() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPending || session) return;
    
    const dismissedAt = sessionStorage.getItem(DISMISSED_AT_KEY);
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }
    
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [isPending, session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    sessionStorage.setItem(DISMISSED_AT_KEY, Date.now().toString());
    setIsExpanded(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (isPending || session) return null;
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      ref={bannerRef}
      className={`fixed bottom-24 right-4 z-40 transition-all duration-300 ease-out ${
        isVisible 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {isExpanded ? (
        <div className="bg-gradient-to-br from-[#0f2744] to-[#0a1628] border border-lime-500/30 rounded-2xl shadow-2xl w-72 overflow-hidden animate-fade-in">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lime-400" />
                <span className="font-bold text-white">Complete Your Profile</span>
              </div>
              <button
                onClick={dismiss}
                className="text-gray-500 hover:text-white transition-colors p-1"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Set up your profile to connect with tennis players and book courts near you.
            </p>
            <div className="space-y-2">
              <Link
                href="/onboarding"
                onClick={dismiss}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl transition-colors"
              >
                <UserPlus size={18} />
                Set Up Profile
              </Link>
              <button
                onClick={dismiss}
                className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-lime-500 to-lime-400" />
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative"
          aria-label="Complete your profile"
        >
          <div className="absolute -inset-2 bg-lime-500/20 rounded-full blur-md group-hover:bg-lime-500/30 transition-colors animate-pulse" />
          <div className="relative w-14 h-14 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <UserPlus size={24} className="text-black" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles size={12} className="text-white" />
          </div>
        </button>
      )}
    </div>
  );
}

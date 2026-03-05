"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { getProfile } from "@/lib/api";

// Pages that should NOT trigger any redirect
const EXCLUDED_PATHS = ["/onboarding", "/login", "/signup", "/admin-login"];

export function OnboardingRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: sessionLoading } = useSession();

  useEffect(() => {
    if (sessionLoading) return;

    // Never redirect if we're already on an excluded page
    if (EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) return;

    // Also skip admin pages — they have their own auth
    if (pathname.startsWith("/admin")) return;

    const checkAndRedirect = async () => {
      if (!session) {
        // Unauthenticated user: check localStorage for onboarding completion
        const completed = localStorage.getItem("onboarding_completed");
        if (!completed) {
          router.push("/onboarding");
        }
        // If completed, let them browse freely (no redirect)
        return;
      }

      // Authenticated user: check DB profile
      try {
        const profile = await getProfile();
        if (!profile || !profile.name) {
          router.push("/onboarding");
        }
      } catch {
        // 404 or error means no profile exists — check if localStorage has data
        // If they completed onboarding while unauthenticated, the signup/login
        // page will sync that data. For now, send them to onboarding.
        router.push("/onboarding");
      }
    };

    checkAndRedirect();
  }, [session, sessionLoading, router, pathname]);

  return null;
}

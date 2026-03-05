"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { getProfile } from "@/lib/api";

// Pages that should NOT be redirected (auth pages + onboarding itself)
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
      // Unauthenticated users go to login, not onboarding
      if (!session) {
        router.push("/login");
        return;
      }

      // Authenticated users without a profile go to onboarding
      try {
        const profile = await getProfile();
        if (!profile || !profile.name) {
          router.push("/onboarding");
        }
      } catch {
        // 404 or error means no profile exists
        router.push("/onboarding");
      }
    };

    checkAndRedirect();
  }, [session, sessionLoading, router, pathname]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { getProfile } from "@/lib/api";

export function OnboardingRedirect() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  useEffect(() => {
    if (sessionLoading) return;

    const checkAndRedirect = async () => {
      if (!session) {
        router.push("/onboarding");
        return;
      }

      try {
        const profile = await getProfile();
        if (!profile || !profile.name) {
          router.push("/onboarding");
        }
      } catch {
        router.push("/onboarding");
      }
    };

    checkAndRedirect();
  }, [session, sessionLoading, router]);

  return null;
}

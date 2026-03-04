"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";

export function OnboardingRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await getProfile();
        if (!profile || !profile.name) {
          router.push("/onboarding");
        }
      } catch {
        // Not logged in - stay on current page (login/signup)
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [router]);

  return null;
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "@/lib/auth/client";
import { getProfile, updateProfile } from "@/lib/api";
import { TennisRacketLogo } from "@/components/providers/TennisIcons";

export const dynamic = "force-dynamic";

const ONBOARDING_DATA_KEY = "onboarding_data";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect authenticated users away from login
  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Check if user already has a DB profile
      let hasProfile = false;
      try {
        const profile = await getProfile();
        hasProfile = !!(profile && profile.name);
      } catch {
        // No profile
      }

      if (hasProfile) {
        // Existing user with profile — go home
        router.push("/");
        return;
      }

      // No DB profile — check if there's localStorage onboarding data to sync
      try {
        const raw = localStorage.getItem(ONBOARDING_DATA_KEY);
        if (raw) {
          const onboardingData = JSON.parse(raw);
          await updateProfile({
            name: onboardingData.name || "",
            city: onboardingData.city || "Lahore",
            level: onboardingData.level ?? 3.5,
            playType: onboardingData.playType || "Both",
            bio: onboardingData.bio || "",
            age: onboardingData.age ?? 25,
            gender: onboardingData.gender || "M",
            preferredCities: onboardingData.preferredCities || ["Lahore"],
            photoUrl: onboardingData.photoUrl || null,
          });
          localStorage.removeItem(ONBOARDING_DATA_KEY);
          router.push("/");
          return;
        }
      } catch {
        console.error("Failed to sync onboarding data from localStorage");
      }

      // No localStorage data either — send to onboarding
      router.push("/onboarding");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="p-8 pt-14">
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center mb-6 lime-glow">
          <TennisRacketLogo size={48} className="text-black" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground text-lg">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-base">
            {error}
          </div>
        )}

        <div>
          <label className="text-base font-medium text-foreground mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-500 text-lg"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="text-base font-medium text-foreground mb-2 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-500 text-lg"
            placeholder="Enter password"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 mt-4 bg-lime-500 hover:bg-lime-600 text-black font-bold text-lg rounded-2xl"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="p-6 text-center space-y-3">
        <Link href="/forgot-password" className="text-muted-foreground text-base hover:text-lime-500 transition-colors">
          Forgot your password?
        </Link>
        <p className="text-muted-foreground text-base">
          Do not have an account?{" "}
          <Link href="/signup" className="text-lime-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

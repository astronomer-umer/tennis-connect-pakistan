"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signUp, useSession } from "@/lib/auth/client";
import { updateProfile } from "@/lib/api";
import { TennisRacketLogo } from "@/components/providers/TennisIcons";

export const dynamic = "force-dynamic";

const ONBOARDING_DATA_KEY = "onboarding_data";

export default function SignupPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect authenticated users away from signup
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
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
        setLoading(false);
        return;
      }

      // Check if there's onboarding data in localStorage to sync to DB
      try {
        const raw = localStorage.getItem(ONBOARDING_DATA_KEY);
        if (raw) {
          const onboardingData = JSON.parse(raw);
          await updateProfile({
            name: onboardingData.name || name,
            city: onboardingData.city || "Lahore",
            level: onboardingData.level ?? 3.5,
            playType: onboardingData.playType || "Both",
            bio: onboardingData.bio || "",
            age: onboardingData.age ?? 25,
            gender: onboardingData.gender || "M",
            preferredCities: onboardingData.preferredCities || ["Lahore"],
            photoUrl: onboardingData.photoUrl || null,
          });
          // Clear localStorage since data is now in DB
          localStorage.removeItem(ONBOARDING_DATA_KEY);
          // Profile synced — go straight to home
          router.push("/");
          return;
        }
      } catch {
        // If sync fails, no big deal — they can still complete onboarding
        console.error("Failed to sync onboarding data from localStorage");
      }

      // No localStorage data — send to onboarding
      router.push("/onboarding");
    } catch {
      setError("Failed to create account");
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
        <h1 className="text-3xl font-black text-foreground mb-2">Create Account</h1>
        <p className="text-muted-foreground text-lg">Join Pakistan tennis community</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-base">
            {error}
          </div>
        )}

        <div>
          <label className="text-base font-medium text-foreground mb-2 block">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-500 text-lg"
            placeholder="Your name"
            required
          />
        </div>

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
            placeholder="Min 8 characters"
            minLength={8}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 mt-4 bg-lime-500 hover:bg-lime-600 text-black font-bold text-lg rounded-2xl"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="p-6 text-center">
        <p className="text-muted-foreground text-base">
          Already have an account?{" "}
          <Link href="/login" className="text-lime-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

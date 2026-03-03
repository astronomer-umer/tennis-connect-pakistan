"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/client";
import { getProfile } from "@/lib/api";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      } else {
        try {
          const profile = await getProfile();
          if (!profile || !profile.name) {
            router.push("/onboarding");
          } else {
            router.push("/");
          }
        } catch {
          router.push("/onboarding");
        }
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="p-8 pt-14">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center mb-6 lime-glow">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-black">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12 Q12 4 16 12 Q12 20 8 12" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
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
            className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-400 text-lg"
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
            className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-400 text-lg"
            placeholder="Enter password"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 mt-4 bg-lime-400 hover:bg-lime-500 text-black font-bold text-lg rounded-2xl"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="p-6 text-center">
        <p className="text-muted-foreground text-base">
          Don't have an account?{" "}
          <Link href="/signup" className="text-lime-400 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

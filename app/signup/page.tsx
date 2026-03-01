"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth/client";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="p-6 pt-12">
        <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-4">
          <span className="text-brand font-black text-sm">TCP</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-muted-foreground text-sm">Join the tennis community in Pakistan</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-pit border border-line text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-pit border border-line text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-pit border border-line text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
            placeholder="Min 8 characters"
            minLength={8}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-4 bg-brand hover:bg-brand/90 text-black font-semibold"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="p-6 text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-brand font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

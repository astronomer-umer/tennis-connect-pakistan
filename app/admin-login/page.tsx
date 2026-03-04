"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">🎾 Admin Panel</h1>
        <p className="text-gray-400 mb-6">Enter your admin password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-brand focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand text-pit font-bold py-3 rounded-lg hover:brightness-110 transition"
          >
            Access Admin
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 text-sm hover:text-brand">
            ← Back to App
          </Link>
        </div>
      </div>
    </div>
  );
}

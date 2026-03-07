"use client";

import { useEffect } from "react";
import { TennisBallLogo } from "@/components/providers/TennisIcons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
        <TennisBallLogo size={40} className="text-orange-500" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground text-center mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-lime-500 hover:bg-lime-600 text-black font-bold rounded-xl"
      >
        Try again
      </button>
    </div>
  );
}

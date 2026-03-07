import Link from "next/link";
import { TennisCourtIcon } from "@/components/providers/TennisIcons";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 rounded-full bg-lime-500/20 flex items-center justify-center mb-6">
        <TennisCourtIcon size={40} className="text-lime-500" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-center mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-lime-500 hover:bg-lime-600 text-black font-bold rounded-xl"
      >
        Go Home
      </Link>
    </div>
  );
}

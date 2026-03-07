import { TennisBallLogo } from "@/components/providers/TennisIcons";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center">
      <div className="animate-ball-bounce">
        <TennisBallLogo size={80} className="text-lime-500" />
      </div>
      <p className="mt-6 text-muted-foreground font-medium">Loading...</p>
    </div>
  );
}

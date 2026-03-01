import { CitySelector } from "@/components/discover/CitySelector";
import { HotCarousel } from "@/components/discover/HotCarousel";
import { SwipeStack } from "@/components/discover/SwipeStack";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background pb-tab">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 glass border-b border-line px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center shadow-[0_0_10px_#00ff9d30]">
              <span className="text-brand font-black text-xs tracking-tight">TCP</span>
            </div>
            <div>
              <h1 className="text-white font-black text-sm leading-none tracking-tight">
                Tennis Connect
              </h1>
              <p className="text-brand text-[10px] font-semibold tracking-widest uppercase">
                Pakistan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">Find players near you</span>
          </div>
        </div>
      </header>

      <CitySelector />

      <div className="mx-4 mb-2 p-2 rounded-lg bg-brand/10 border border-brand/20 text-center">
        <p className="text-brand text-xs font-medium">🎾 Sample players & courts for demo</p>
      </div>

      <HotCarousel />

      <div className="mx-4 my-3 flex items-center gap-3">
        <div className="flex-1 h-px bg-line" />
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Discover</span>
        <div className="flex-1 h-px bg-line" />
      </div>

      <SwipeStack />
    </div>
  );
}

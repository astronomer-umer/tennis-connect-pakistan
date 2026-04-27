"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background px-8 text-center gap-6">
      {/* TCP Logo */}
      <div className="w-20 h-20 rounded-3xl bg-brand/10 border-2 border-brand/30 flex items-center justify-center shadow-[0_0_24px_#00ff9d25]">
        <span className="text-brand font-black text-2xl tracking-tight">TCP</span>
      </div>

      {/* Status */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-orange-400 text-xs font-semibold tracking-wide uppercase">Offline</span>
        </div>
        <h1 className="text-white text-2xl font-black tracking-tight">
          Still Connected 🎾
        </h1>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          No internet? No problem bhai. Your match data & bookings are saved locally. 
          Reconnect to sync with the Pakistan tennis community.
        </p>
      </div>

      {/* Offline features */}
      <div className="w-full space-y-2">
        {[
          "✓  View your saved matches",
          "✓  Check booking history",
          "✓  Browse your profile",
          "✗  Discover new players",
        ].map((item) => (
          <div
            key={item}
            className={`text-sm px-4 py-2.5 rounded-xl ${
              item.startsWith("✓")
                ? "bg-brand/10 text-brand border border-brand/20"
                : "bg-surface text-muted-foreground border border-line"
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.reload()}
        className="w-full py-4 bg-brand text-pit font-black rounded-2xl text-base shadow-[0_0_20px_#00ff9d40] active:scale-95 transition-transform"
      >
        Try Reconnecting
      </button>

      <p className="text-zinc-700 text-xs">Vibe Up · خوش آمدید</p>
    </div>
  );
}

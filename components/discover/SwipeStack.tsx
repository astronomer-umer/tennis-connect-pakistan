"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { MapPin, RefreshCw, Heart, X, Trophy, Users } from "lucide-react";
import confetti from "canvas-confetti";
import type { Player, Coach, SwipeItem } from "@/data";
import { PLAYING_STYLES } from "@/data";
import { useAppStore } from "@/store/useAppStore";
import { getDiscover } from "@/lib/api";

// ─── Swipe Card (draggable wrapper) ──────────────────────────────────────────

function SwipeCardWrapper({
  onSwipeLeft,
  onSwipeRight,
  children,
  triggerDir,
  onTriggerDone,
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
  triggerDir: "left" | "right" | null;
  onTriggerDone: () => void;
}) {
  const [x, setX] = useState(0);
  const [rot, setRot] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const ref = useRef<HTMLDivElement>(null);

  const getWidth = () => ref.current?.offsetWidth ?? 360;

  const startDrag = (cx: number) => {
    startX.current = cx;
    setDragging(true);
  };
  const moveDrag = (cx: number) => {
    const dx = cx - startX.current;
    const w = getWidth();
    setX(dx);
    setRot((dx / w) * 18);
    setOpacity(Math.max(0.55, 1 - Math.abs(dx) / (w * 0.75)));
  };

  const flyOut = useCallback(
    (dir: "left" | "right") => {
      const w = getWidth();
      const m = dir === "right" ? 1 : -1;
      setX(m * w * 1.6);
      setRot(m * 28);
      setOpacity(0);
      setTimeout(() => (dir === "right" ? onSwipeRight() : onSwipeLeft()), 320);
    },
    [onSwipeLeft, onSwipeRight]
  );

  const endDrag = useCallback(() => {
    setDragging(false);
    const threshold = getWidth() * 0.28;
    if (x > threshold) flyOut("right");
    else if (x < -threshold) flyOut("left");
    else {
      setX(0);
      setRot(0);
      setOpacity(1);
    }
  }, [x, flyOut]);

  // Programmatic swipe from action buttons
  useEffect(() => {
    if (triggerDir) {
      flyOut(triggerDir);
      onTriggerDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerDir]);

  const showRight = x > 40;
  const showLeft = x < -40;
  const rightAlpha = Math.min(1, (x - 40) / 90);
  const leftAlpha = Math.min(1, (-x - 40) / 90);

  return (
    <div
      ref={ref}
      className="absolute inset-0 select-none touch-none"
      style={{
        transform: `translateX(${x}px) rotate(${rot}deg)`,
        opacity,
        transition: dragging
          ? "none"
          : "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease",
        willChange: "transform",
        cursor: dragging ? "grabbing" : "grab",
      }}
      onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
      onMouseMove={(e) => { if (e.buttons === 1 && dragging) moveDrag(e.clientX); }}
      onMouseUp={endDrag}
      onMouseLeave={() => { if (dragging) endDrag(); }}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => { if (dragging) moveDrag(e.touches[0].clientX); }}
      onTouchEnd={endDrag}
    >
      {/* CONNECT indicator */}
      {showRight && (
        <div
          className="absolute top-8 left-5 z-20 rotate-[-14deg] border-[3px] border-brand rounded-xl px-3 py-1 pointer-events-none"
          style={{ opacity: rightAlpha }}
        >
          <span className="text-brand font-black text-lg tracking-widest">CONNECT</span>
        </div>
      )}
      {/* PASS indicator */}
      {showLeft && (
        <div
          className="absolute top-8 right-5 z-20 rotate-[14deg] border-[3px] border-red-400 rounded-xl px-3 py-1 pointer-events-none"
          style={{ opacity: leftAlpha }}
        >
          <span className="text-red-400 font-black text-lg tracking-widest">PASS</span>
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Card Content renderers ───────────────────────────────────────────────────

function PlayerCard({ p }: { p: Player }) {
  const styleInfo = PLAYING_STYLES.find(s => s.id === p.playingStyle) || PLAYING_STYLES[4];
  
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden tennis-card">
      <Image src={p.photo} alt={p.name} fill className="object-cover" unoptimized />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      {/* Court-line accent along top edge */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />
      
      {/* Top badges row */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Playing Style badge */}
        <div className="bg-blue-600/80 backdrop-blur-sm text-white font-bold text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
          <span>{styleInfo.icon}</span>
          <span>{styleInfo.name}</span>
        </div>
        
        {/* Level badge */}
        <div className="bg-brand text-pit font-black text-base px-3 py-1.5 rounded-2xl shadow-[0_0_16px_#00ff9d60]">
          {p.level}
        </div>
      </div>
      
      {/* W/L */}
      <div className="absolute top-16 left-5 bg-black/60 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
        <span className="text-brand text-xs font-bold">{p.wins}W </span>
        <span className="text-zinc-400 text-xs">{p.losses}L</span>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-white text-2xl font-extrabold leading-tight">{p.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={12} className="text-brand" />
              <span className="text-zinc-300 text-sm">{p.city} · {p.age} yrs</span>
            </div>
          </div>
          <span className="text-xs bg-surface-2 border border-line text-zinc-300 px-2 py-1 rounded-xl">
            {p.playType}
          </span>
        </div>
        <p className="text-white/75 text-sm mt-2 leading-snug">{p.status}</p>
        
        {/* Style strengths */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {styleInfo.strengths.slice(0, 3).map((strength) => (
            <span key={strength} className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              {strength}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Match Overlay ─────────────────────────────────────────────────────────────

function MatchOverlay({
  profile,
  onDismiss,
}: {
  profile: Player | Coach;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onDismiss}
    >
      <div className="match-pop flex flex-col items-center gap-4 px-8 text-center">
        <div className="text-6xl">🎾</div>
        <h1 className="text-brand text-4xl font-black tracking-tight drop-shadow-[0_0_20px_#00ff9d]">
          IT&apos;S A MATCH!
        </h1>
        <p className="text-white text-lg font-semibold">
          Connected with {profile.name}
        </p>
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-brand shadow-[0_0_24px_#00ff9d60]">
          <Image src={profile.photo} alt={profile.name} fill className="object-cover" unoptimized />
        </div>
        <p className="text-zinc-400 text-sm">Check Matches tab to chat 💬</p>
        <button
          onClick={onDismiss}
          className="mt-2 bg-brand text-pit font-black px-8 py-3 rounded-2xl text-base shadow-[0_0_20px_#00ff9d50] active:scale-95 transition-transform"
        >
          Keep Swiping →
        </button>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyStack({ onReset, hasPlayers }: { onReset: () => void; hasPlayers: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8 court-surface rounded-3xl border border-lime-500/10">
      {/* Net pattern divider */}
      <div className="net-divider w-24 mb-2" />
      {hasPlayers ? (
        <>
          <Trophy size={48} className="text-brand opacity-60" />
          <h3 className="text-white text-xl font-bold">You&apos;ve seen everyone!</h3>
          <p className="text-muted-foreground text-sm">
            Switch city or reset to discover more players.
          </p>
          <div className="net-divider w-24 mt-1" />
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-brand text-pit font-bold px-6 py-3 rounded-2xl active:scale-95 transition-transform"
          >
            <RefreshCw size={16} />
            Reset Deck
          </button>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-lime-500/10 flex items-center justify-center mb-2">
            <Heart size={36} className="text-lime-500/50" />
          </div>
          <h3 className="text-white text-xl font-bold">No Players Yet</h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Be the first to join! Sign up and complete your profile to appear here and connect with other tennis players.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Main SwipeStack ──────────────────────────────────────────────────────────

type TabType = "players";

export function SwipeStack() {
  const { selectedCity, swipedRightIds, swipedLeftIds, swipeLeft, triggerMatch, resetDeck,
    showMatchOverlay, lastMatchedProfile, dismissMatchOverlay } = useAppStore();

  const [tab, setTab] = useState<TabType>("players");
  const [triggerDir, setTriggerDir] = useState<"left" | "right" | null>(null);
  const [apiPlayers, setApiPlayers] = useState<SwipeItem[]>([]);

  useEffect(() => {
    getDiscover(selectedCity === "All" ? undefined : selectedCity)
      .then((data) => {
        if (Array.isArray(data)) {
          setApiPlayers(data);
        }
      })
      .catch(() => setApiPlayers([]));
  }, [selectedCity]);

  // Build filtered deck based on tab + city
  const deck = apiPlayers.filter((p) => selectedCity === "All" || p.city === selectedCity);

  const swipedIds = new Set([...swipedRightIds, ...swipedLeftIds]);
  const remaining = deck.filter((item) => !swipedIds.has(item.id));
  const visible = remaining.slice(-3); // top 3
  const topCard = visible[visible.length - 1];

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#00ff9d", "#ffffff", "#00cc7a", "#b3ffe0"],
      gravity: 0.9,
    });
  };

  const handleSwipeRight = (item: SwipeItem) => {
    fireConfetti();
    triggerMatch(item as Player);
  };

  const handleSwipeLeft = (item: SwipeItem) => {
    swipeLeft(item.id);
  };

  const handleReset = () => {
    resetDeck();
  };

  const TABS: { id: TabType; label: string }[] = [
    { id: "players", label: "Players" },
  ];

  return (
    <>
      {/* Match Overlay */}
      {showMatchOverlay && lastMatchedProfile && (
        <MatchOverlay profile={lastMatchedProfile} onDismiss={dismissMatchOverlay} />
      )}

      <div className="flex flex-col gap-3 px-4">
        {/* Tab switcher */}
        <div className="flex bg-surface rounded-2xl p-1 border border-line">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                tab === id
                  ? "bg-brand text-pit shadow-[0_0_12px_#00ff9d40]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Card stack area */}
        <div className="relative" style={{ height: "calc(100dvh - 360px)", minHeight: "340px" }}>
          {remaining.length === 0 ? (
            <EmptyStack onReset={handleReset} hasPlayers={deck.length > 0} />
          ) : (
            visible.map((item, i, arr) => {
              const fromTop = arr.length - 1 - i; // 0=top
              const isTop = fromTop === 0;

              return (
                <div
                  key={item.id}
                  className="absolute inset-0"
                  style={{
                    zIndex: arr.length - fromTop,
                    transform: `scale(${1 - fromTop * 0.045}) translateY(${fromTop * 11}px)`,
                    transformOrigin: "bottom center",
                    transition: "transform 0.3s ease",
                    pointerEvents: isTop ? "auto" : "none",
                  }}
                >
                  {isTop ? (
                    <SwipeCardWrapper
                      onSwipeRight={() => handleSwipeRight(item)}
                      onSwipeLeft={() => handleSwipeLeft(item)}
                      triggerDir={triggerDir}
                      onTriggerDone={() => setTriggerDir(null)}
                    >
                      <PlayerCard p={item as Player} />
                    </SwipeCardWrapper>
                  ) : (
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <PlayerCard p={item as Player} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Action buttons */}
        {remaining.length > 0 && topCard && (
          <div className="flex items-center justify-center gap-6 pb-1">
            <button
              onClick={() => setTriggerDir("left")}
              className="w-14 h-14 rounded-full bg-surface border border-line flex items-center justify-center text-red-400 hover:bg-red-400/10 hover:border-red-400/40 transition-all active:scale-90 shadow-lg"
              aria-label="Pass"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => setTriggerDir("right")}
              className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-pit hover:brightness-110 transition-all active:scale-90 shadow-[0_0_20px_#00ff9d50]"
              aria-label="Connect"
            >
              <Heart size={26} strokeWidth={2.5} className="fill-pit" />
            </button>

            <button
              onClick={handleReset}
              className="w-14 h-14 rounded-full bg-surface border border-line flex items-center justify-center text-muted-foreground hover:border-brand/40 hover:text-brand transition-all active:scale-90 shadow-lg"
              aria-label="Reset"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Medal, Crown, Users, MapPin, TrendingUp, ChevronLeft, ChevronRight, Share2, Copy, Check } from "lucide-react";
import { cities, type City } from "@/data";
import { useSession } from "@/lib/auth/client";

const LEVEL_LABELS: Record<number, string> = {
  2.5: "Beginner",
  3.0: "Novice",
  3.5: "Intermediate",
  4.0: "Advanced",
  4.5: "Expert",
  5.0: "Pro",
};

interface LeaderboardUser {
  rank: number;
  name: string;
  photo: string;
  city: string;
  level: number;
  wins: number;
  losses: number;
  winRate: number;
  cityRank: number;
  levelRank: number;
}

const DEMO_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Ali Ahmad", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali1", city: "Lahore", level: 4.5, wins: 45, losses: 8, winRate: 85, cityRank: 1, levelRank: 1 },
  { rank: 2, name: "Hamza Khan", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=hamza1", city: "Lahore", level: 4.0, wins: 38, losses: 12, winRate: 76, cityRank: 2, levelRank: 2 },
  { rank: 3, name: "Saifullah", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=saif1", city: "Karachi", level: 4.5, wins: 42, losses: 15, winRate: 74, cityRank: 1, levelRank: 3 },
  { rank: 4, name: "Omer Farooq", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=omer1", city: "Islamabad", level: 3.5, wins: 28, losses: 10, winRate: 74, cityRank: 1, levelRank: 1 },
  { rank: 5, name: "Bilal Ahmed", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=bilal1", city: "Lahore", level: 3.0, wins: 22, losses: 8, winRate: 73, cityRank: 3, levelRank: 2 },
  { rank: 6, name: "Usman Raja", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=usman1", city: "Karachi", level: 3.5, wins: 25, losses: 12, winRate: 68, cityRank: 2, levelRank: 2 },
  { rank: 7, name: "Ahmed Tahir", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed1", city: "Islamabad", level: 3.0, wins: 18, losses: 6, winRate: 75, cityRank: 2, levelRank: 1 },
  { rank: 8, name: "Kashan Malik", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=kashan1", city: "Lahore", level: 2.5, wins: 15, losses: 5, winRate: 75, cityRank: 4, levelRank: 1 },
  { rank: 9, name: "FaisalIqbal", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=faisal1", city: "Karachi", level: 2.5, wins: 12, losses: 4, winRate: 75, cityRank: 3, levelRank: 2 },
  { rank: 10, name: "Rizwan Akhtar", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=rizwan1", city: "Islamabad", level: 2.5, wins: 10, losses: 8, winRate: 56, cityRank: 3, levelRank: 3 },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tab, setTab] = useState<"all" | "city" | "level">("all");
  const [cityFilter, setCityFilter] = useState<City>("Lahore");
  const [levelFilter, setLevelFilter] = useState<number>(3.5);
  const [copied, setCopied] = useState(false);

  const useEffect = require("react").useEffect;

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      router.replace("/onboarding");
    }
  }, [router]);

  const filtered = useMemo(() => {
    if (tab === "city") {
      return DEMO_LEADERBOARD.filter(u => u.city === cityFilter).slice(0, 20);
    }
    if (tab === "level") {
      return DEMO_LEADERBOARD.filter(u => u.level === levelFilter).slice(0, 20);
    }
    return DEMO_LEADERBOARD;
  }, [tab, cityFilter, levelFilter]);

  const currentUserRank = DEMO_LEADERBOARD.findIndex(u => u.name === "Current User") + 1 || null;
  const myRank = session?.user?.name ? DEMO_LEADERBOARD.findIndex(u => u.name.toLowerCase().includes((session.user?.name || "").toLowerCase().split(" ")[0])) + 1 : null;

  const shareLink = () => {
    const url = `${window.location.origin}/leaderboard?ref=${session?.user?.id || "guest"}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-tab">
      <header className="sticky top-0 z-30 glass border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-brand" />
          <h1 className="text-white font-black text-xl tracking-tight">Leaderboard</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex bg-surface rounded-2xl p-1 border border-line">
          <button
            onClick={() => setTab("all")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              tab === "all" ? "bg-brand text-pit shadow-[0_0_12px_#00ff9d40]" : "text-muted-foreground"
            }`}
          >
            <Crown size={14} className="inline mr-1" />
            Top Overall
          </button>
          <button
            onClick={() => setTab("city")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              tab === "city" ? "bg-brand text-pit shadow-[0_0_12px_#00ff9d40]" : "text-muted-foreground"
            }`}
          >
            <MapPin size={14} className="inline mr-1" />
            By City
          </button>
          <button
            onClick={() => setTab("level")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              tab === "level" ? "bg-brand text-pit shadow-[0_0_12px_#00ff9d40]" : "text-muted-foreground"
            }`}
          >
            <Medal size={14} className="inline mr-1" />
            By Level
          </button>
        </div>
      </div>

      {/* City filter (when on city tab) */}
      {tab === "city" && (
        <div className="px-4 mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                cityFilter === c
                  ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d40]"
                  : "bg-surface text-muted-foreground border-line"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Level filter (when on level tab) */}
      {tab === "level" && (
        <div className="px-4 mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {[2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                levelFilter === l
                  ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d40]"
                  : "bg-surface text-muted-foreground border-line"
              }`}
            >
              Level {l}
            </button>
          ))}
        </div>
      )}

      {/* Leaderboard list */}
      <div className="px-4 mt-4 space-y-3">
        {filtered.slice(0, 10).map((player, index) => (
          <div
            key={player.rank}
            className={`flex items-center gap-3 p-3 rounded-2xl border ${
              index === 0 ? "bg-yellow-500/10 border-yellow-500/30" :
              index === 1 ? "bg-zinc-400/10 border-zinc-400/30" :
              index === 2 ? "bg-orange-500/10 border-orange-500/30" :
              "bg-surface border-line"
            }`}
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
              index === 0 ? "bg-yellow-500 text-black" :
              index === 1 ? "bg-zinc-400 text-black" :
              index === 2 ? "bg-orange-500 text-black" :
              "bg-surface-2 text-muted-foreground"
            }`}>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : player.rank}
            </div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand/30">
              <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-bold text-sm truncate">{player.name}</p>
              <p className="text-muted-foreground text-xs">
                <span className="text-brand font-semibold">L{player.level}</span> · {player.city}
              </p>
            </div>

            {/* Stats */}
            <div className="text-right">
              <p className="text-brand font-black text-lg">{player.wins}W</p>
              <p className="text-muted-foreground text-[10px]">{player.winRate}% win rate</p>
            </div>
          </div>
        ))}
      </div>

      {/* My rank highlight */}
      {myRank && myRank > 10 && (
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-brand/10 border border-brand/30">
          <p className="text-muted-foreground text-xs">Your Ranking</p>
          <p className="text-brand font-black text-2xl">#{myRank}</p>
          <p className="text-muted-foreground text-xs mt-1">Keep playing to climb the ranks!</p>
        </div>
      )}

      {/* Share button */}
      <div className="mx-4 mt-4">
        <button
          onClick={shareLink}
          className="w-full py-3 bg-surface border border-line rounded-2xl text-foreground font-bold flex items-center justify-center gap-2"
        >
          {copied ? <Check size={18} className="text-brand" /> : <Share2 size={18} />}
          {copied ? "Link Copied!" : "Share Leaderboard"}
        </button>
      </div>

      {/* Tip */}
      <div className="mx-4 mt-4 p-3 rounded-2xl bg-surface-2 border border-line">
        <p className="text-muted-foreground text-xs flex items-center gap-2">
          <TrendingUp size={12} className="text-brand" />
          Win more matches to climb the leaderboard! Rankings update weekly.
        </p>
      </div>
    </div>
  );
}
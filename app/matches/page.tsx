"use client";

import Image from "next/image";
import { format } from "date-fns";
import { MessageCircle, Zap } from "lucide-react";
import { useAppStore, type Match } from "@/store/useAppStore";
import { ChatModal } from "@/components/matches/ChatModal";

function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
  const lastMsg = match.messages[match.messages.length - 1];
  const unread = match.messages.filter((m) => !m.isMe).length;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2/50 transition-colors active:scale-[0.98]"
    >
      {/* Avatar with brand ring */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand/30">
          <Image
            src={match.profile.photo}
            alt={match.profile.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        {/* Online dot */}
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand rounded-full border-2 border-background" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <p className="text-foreground font-bold text-sm truncate">{match.profile.name}</p>
          <span className="text-muted-foreground text-[10px] shrink-0 ml-2">
            {format(new Date(match.matchedAt), "MMM d")}
          </span>
        </div>
        <p className="text-brand text-xs font-medium mt-0.5">
          {match.profile.kind === "player"
            ? `Level ${match.profile.level} · ${match.profile.city}`
            : match.profile.kind === "coach"
            ? `Coach · ${match.profile.city}`
            : ""}
        </p>
        {lastMsg && (
          <p className="text-muted-foreground text-xs mt-0.5 truncate">
            {lastMsg.isMe ? "You: " : ""}{lastMsg.text}
          </p>
        )}
      </div>

      {/* Unread badge */}
      {unread > 0 && (
        <div className="shrink-0 w-5 h-5 bg-brand rounded-full flex items-center justify-center">
          <span className="text-pit text-[9px] font-black">{unread}</span>
        </div>
      )}
    </button>
  );
}

export default function MatchesPage() {
  const { matches, activeChatMatchId, setActiveChatMatchId } = useAppStore();
  const activeMatch = matches.find((m) => m.id === activeChatMatchId);

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-tab">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-line px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-brand" />
            <h1 className="text-white font-black text-xl tracking-tight">Matches</h1>
          </div>
          <span className="text-muted-foreground text-xs">{matches.length} connections</span>
        </div>
      </header>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="text-6xl">🎾</div>
          <h2 className="text-white text-xl font-bold">No Matches Yet</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Swipe right on players & coaches in Discover to connect with them. It only takes one tap!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {/* Section header */}
          <div className="px-5 py-3">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Your Connect List
            </p>
          </div>

          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onClick={() => setActiveChatMatchId(match.id)}
            />
          ))}
        </div>
      )}

      {/* Pro tip */}
      {matches.length > 0 && (
        <div className="mx-4 mt-4 flex items-start gap-2 bg-brand/5 border border-brand/20 rounded-xl px-3 py-3">
          <MessageCircle size={14} className="text-brand shrink-0 mt-0.5" />
          <p className="text-zinc-400 text-xs leading-relaxed">
            Tap any match to chat in-app or hit <strong className="text-brand">WhatsApp</strong> for instant messaging. 
            Golden Set badge earns you 🏆 priority matching!
          </p>
        </div>
      )}

      {/* Chat Modal */}
      {activeMatch && (
        <ChatModal match={activeMatch} onClose={() => setActiveChatMatchId(null)} />
      )}
    </div>
  );
}

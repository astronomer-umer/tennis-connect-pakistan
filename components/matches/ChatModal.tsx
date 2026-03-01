"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { X, Send, MessageCircle } from "lucide-react";
import { useAppStore, type Match } from "@/store/useAppStore";

interface ChatModalProps {
  match: Match;
  onClose: () => void;
}

export function ChatModal({ match, onClose }: ChatModalProps) {
  const sendMessage = useAppStore((s) => s.sendMessage);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match.messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(match.id, trimmed);
    setText("");
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Hey ${match.profile.name}! Let's set up a match 🎾`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line glass sticky top-0 z-10">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground"
        >
          <X size={16} />
        </button>
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand/40">
          <Image
            src={match.profile.photo}
            alt={match.profile.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-bold text-sm truncate">{match.profile.name}</p>
          <p className="text-brand text-xs">
            {match.profile.kind === "player"
              ? `${match.profile.city} · Level ${match.profile.level}`
              : match.profile.kind === "coach"
              ? `${match.profile.city} · Coach`
              : ""}
          </p>
        </div>
        {/* WhatsApp one-tap */}
        <button
          onClick={openWhatsApp}
          className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-xl active:scale-95 transition-transform"
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {match.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.isMe
                  ? "bg-brand text-pit rounded-br-sm font-medium"
                  : "bg-surface-2 text-foreground border border-line rounded-bl-sm"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-[10px] mt-1 ${
                  msg.isMe ? "text-pit/60 text-right" : "text-muted-foreground"
                }`}
              >
                {format(new Date(msg.sentAt), "h:mm a")}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 py-3 pb-safe glass border-t border-line">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-surface-2 border border-line rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/60 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-11 h-11 rounded-full bg-brand text-pit flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all shadow-[0_0_12px_#00ff9d30]"
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

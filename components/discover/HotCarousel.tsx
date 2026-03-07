"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Player } from "@/data";
import { MapPin } from "lucide-react";
import { getDiscover } from "@/lib/api";

function HotCard({ item }: { item: Player }) {
  return (
    <div className="relative shrink-0 w-36 h-44 rounded-2xl overflow-hidden tennis-card">
      <Image src={item.photo} alt={item.name} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      {/* Court-line accent */}
      <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-lime-500/25 to-transparent" />
      <div className="absolute top-2 right-2 bg-brand text-pit text-[10px] font-black px-2 py-0.5 rounded-lg">
        {item.level}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-xs font-bold">{item.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={9} className="text-brand" />
          <p className="text-zinc-300 text-[10px]">{item.city}</p>
        </div>
        <p className="text-zinc-400 text-[10px] mt-0.5 line-clamp-1">{item.status}</p>
      </div>
    </div>
  );
}

export function HotCarousel() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getDiscover()
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data.slice(0, 10));
        }
      })
      .catch(() => setPlayers([]));
  }, []);

  if (players.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            Players Near You
          </h2>
        </div>
        <div className="flex items-center justify-center py-8 rounded-2xl border border-dashed border-white/10">
          <p className="text-muted-foreground text-sm">Sign up to be the first player in your city!</p>
        </div>
      </div>
    );
  }

  const doubled = [...players, ...players];

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-foreground tracking-tight">
          🔥 Hot Right Now
        </h2>
        <span className="text-[10px] text-muted-foreground">Live</span>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-3"
          style={{
            animation: "carousel-scroll 28s linear infinite",
            width: "max-content",
          }}
        >
          {doubled.map((item, i) => (
            <HotCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

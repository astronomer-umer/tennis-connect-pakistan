"use client";

import Image from "next/image";
import { hotItems } from "@/data";
import type { Player, Coach, Court } from "@/data";
import { Star, MapPin } from "lucide-react";

function HotCard({ item }: { item: Player | Coach | Court }) {
  if (item.kind === "court") {
    return (
      <div className="relative shrink-0 w-36 h-44 rounded-2xl overflow-hidden border border-line">
        <Image src={item.photo} alt={item.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-xs font-bold leading-tight line-clamp-2">
            {item.name}
          </p>
          <p className="text-brand text-xs font-bold mt-0.5">
            Rs.{item.pricePerHour.toLocaleString()}/hr
          </p>
          <span className="inline-block mt-1 text-[10px] bg-brand/20 text-brand px-1.5 py-0.5 rounded-md font-medium">
            {item.surface}
          </span>
        </div>
      </div>
    );
  }

  if (item.kind === "coach") {
    return (
      <div className="relative shrink-0 w-36 h-44 rounded-2xl overflow-hidden border border-line">
        <Image src={item.photo} alt={item.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 rounded-full px-2 py-0.5">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="text-white text-[10px] font-bold">{item.rating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-xs font-bold leading-tight">{item.name}</p>
          <p className="text-zinc-300 text-[10px] mt-0.5">{item.specialization}</p>
          <p className="text-brand text-xs font-bold mt-0.5">
            Rs.{item.ratePerHour.toLocaleString()}/hr
          </p>
        </div>
      </div>
    );
  }

  // Player
  return (
    <div className="relative shrink-0 w-36 h-44 rounded-2xl overflow-hidden border border-line">
      <Image src={item.photo} alt={item.name} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
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
  // Double the list for seamless loop
  const doubled = [...hotItems, ...hotItems];

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

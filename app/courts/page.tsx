"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, Thermometer, ChevronRight } from "lucide-react";
import { cities } from "@/data";
import type { Court, City } from "@/data";
import { BookingModal } from "@/components/courts/BookingModal";
import { getCourts } from "@/lib/api";

const SURFACE_COLORS: Record<string, string> = {
  Hard: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Grass: "bg-green-500/20 text-green-300 border-green-500/30",
  Clay: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function CourtListCard({
  court,
  onBook,
}: {
  court: Court;
  onBook: () => void;
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden fade-in">
      {/* Photo */}
      <div className="relative h-44 w-full">
        <Image src={court.photo} alt={court.name} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {/* Distance pill */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
          <MapPin size={10} className="text-brand" />
          <span className="text-white text-xs font-medium">{court.distance}</span>
        </div>
        {/* Courts count */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-2.5 py-1">
          <span className="text-brand text-xs font-bold">{court.totalCourts} courts</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base leading-tight">{court.name}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">{court.city}</p>
          </div>
          <span className="text-brand font-black text-lg shrink-0">
            Rs.{court.pricePerHour.toLocaleString()}/hr
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${
              SURFACE_COLORS[court.surface] ?? SURFACE_COLORS.Hard
            }`}
          >
            {court.surface}
          </span>
          {court.amenities.slice(0, 2).map((a) => (
            <span key={a} className="text-[10px] text-zinc-500 bg-surface-2 px-2 py-0.5 rounded-md">
              {a}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {court.openTime} – {court.closeTime}
          </span>
          <button
            onClick={onBook}
            className="flex items-center gap-1 bg-brand text-pit text-sm font-black px-4 py-2 rounded-xl active:scale-95 transition-all shadow-[0_0_12px_#00ff9d30]"
          >
            Book Now
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourtsPage() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<City | "All">("All");
  const [bookingCourt, setBookingCourt] = useState<Court | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourts(cityFilter === "All" ? undefined : cityFilter)
      .then(setCourts)
      .catch(() => setCourts([]))
      .finally(() => setLoading(false));
  }, [cityFilter]);

  const filtered = useMemo(() => {
    return courts.filter((c) => {
      const matchCity = cityFilter === "All" || c.city === cityFilter;
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      return matchCity && matchSearch;
    });
  }, [search, cityFilter, courts]);

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-tab">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-line px-5 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-black text-xl tracking-tight">Courts 🎾</h1>
          <span className="text-muted-foreground text-xs">{filtered.length} venues</span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courts or city..."
            className="w-full bg-surface-2 border border-line rounded-2xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/60 transition-colors"
          />
        </div>

        {/* City chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["All", ...cities] as (City | "All")[]).map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                cityFilter === c
                  ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d40]"
                  : "bg-surface text-muted-foreground border-line hover:border-brand/40"
              }`}
            >
              {c === "All" ? "All Cities" : c}
            </button>
          ))}
        </div>
      </header>

      {/* Heat warning banner */}
      <div className="mx-4 mt-4 flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-xl px-3 py-2.5">
        <Thermometer size={15} className="text-orange-400 shrink-0" />
        <p className="text-orange-300 text-xs font-medium">
          42°C today — play before 10 AM bhai, trust me 🥵
        </p>
      </div>

      {/* Courts list */}
      <div className="px-4 mt-4 space-y-4 pb-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading courts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🎾</p>
            <p className="text-muted-foreground">No courts found</p>
            <button
              onClick={() => { setSearch(""); setCityFilter("All"); }}
              className="mt-3 text-brand text-sm font-bold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((court) => (
            <CourtListCard
              key={court.id}
              court={court}
              onBook={() => setBookingCourt(court)}
            />
          ))
        )}
      </div>

      {/* Booking Modal */}
      {bookingCourt && (
        <BookingModal court={bookingCourt} onClose={() => setBookingCourt(null)} />
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, ChevronRight, Clock, Wifi } from "lucide-react";
import { cities, sportTypes, sportLabels, type City, type SportType, type Surface, type Court } from "@/data";
import { BookingModal } from "@/components/courts/BookingModal";
import { getCourts } from "@/lib/api";

const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

const SURFACE_COLORS: Record<string, string> = {
  Hard: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Grass: "bg-green-500/20 text-green-300 border-green-500/30",
  Clay: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Artificial Grass": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Cement: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  Polyester: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const SPORT_ICONS: Record<string, string> = {
  tennis: "🎾",
  padel: "🏐",
};

function CourtListCard({
  court,
  onBook,
}: {
  court: Court;
  onBook: () => void;
}) {
  return (
    <div className="bg-surface tennis-card rounded-2xl overflow-hidden fade-in court-surface">
      {/* Photo */}
      <div className="relative h-44 w-full">
        <Image src={court.photo} alt={court.name} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {/* Sport type badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1.5">
          <span className="text-lg">{SPORT_ICONS[court.sportType] || "🎾"}</span>
          <span className="text-white text-xs font-bold capitalize">{sportLabels[court.sportType] || court.sportType}</span>
        </div>
        {/* Distance pill */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
          <MapPin size={10} className="text-brand" />
          <span className="text-white text-xs font-medium">{court.distance}</span>
        </div>
        {/* Courts count */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-2.5 py-1">
          <span className="text-brand text-xs font-bold">{court.totalCourts} {court.sportType === "padel" ? "courts" : "courts"}</span>
        </div>
        {/* Area */}
        {court.area && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl px-2.5 py-1">
            <span className="text-white/70 text-[10px] font-medium">{court.area}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base leading-tight">{court.name}</h3>
            <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
              <MapPin size={10} /> {court.city} · {court.courtType}
            </p>
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={10} /> {court.openTime} – {court.closeTime}
            </span>
            {court.locationUrl && (
              <a
                href={court.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground hover:text-brand transition-colors"
              >
                <Wifi size={12} />
              </a>
            )}
          </div>
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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<City | "All">("All");
  const [sportFilter, setSportFilter] = useState<SportType | "All">("All");
  const [bookingCourt, setBookingCourt] = useState<Court | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    if (!completed) {
      router.replace("/onboarding");
    }
  }, [router]);

useEffect(() => {
    const params = new URLSearchParams();
    if (cityFilter !== "All") params.set("city", cityFilter);
    if (sportFilter !== "All") params.set("sportType", sportFilter);
    getCourts(params.toString() ? `?${params}` : undefined)
      .then(setCourts)
      .catch(() => setCourts([]))
      .finally(() => setLoading(false));
  }, [cityFilter, sportFilter]);

const filtered = useMemo(() => {
    return courts.filter((c) => {
      const matchCity = cityFilter === "All" || c.city === cityFilter;
      const matchSport = sportFilter === "All" || c.sportType === sportFilter;
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.area?.toLowerCase().includes(search.toLowerCase());
      return matchCity && matchSport && matchSearch;
    });
  }, [search, cityFilter, sportFilter, courts]);

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-tab">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-line px-5 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-black text-xl tracking-tight">Venues</h1>
            <span className="text-2xl">🏟️</span>
          </div>
          <span className="text-muted-foreground text-xs">{filtered.length} venues</span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venues or city..."
            className="w-full bg-surface-2 border border-line rounded-2xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/60 transition-colors"
          />
        </div>

        {/* Sport type chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["All", ...sportTypes] as (SportType | "All")[]).map((s) => (
            <button
              key={s}
              onClick={() => setSportFilter(s as SportType | "All")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                sportFilter === s
                  ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d40]"
                  : "bg-surface text-muted-foreground border-line hover:border-brand/40"
              }`}
            >
              <span>{s === "All" ? "🏟️" : s === "tennis" ? "🎾" : "🏐"}</span>
              {s === "All" ? "All Sports" : sportLabels[s as SportType]}
            </button>
          ))}
        </div>

        {/* City + Surface chips */}
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

      {/* Weather tip banner */}
      <div className="mx-4 mt-4 flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-xl px-3 py-2.5">
        <Clock size={15} className="text-orange-400 shrink-0" />
        <p className="text-orange-300 text-xs font-medium">
          Hot weather! Best to play early morning or evening
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

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Trophy, ChevronRight, Clock, Users, DollarSign, Star, Phone, MessageCircle } from "lucide-react";
import { cities, type City } from "@/data";

interface Tournament {
  id: string;
  name: string;
  city: City;
  sportType: "tennis" | "padel";
  date: string;
  endDate: string;
  venue: string;
  surface: string;
  categories: string[];
  entryFee: number;
  prize: string;
  organizer: string;
  whatsapp: string;
  description: string;
  featured: boolean;
  photo: string;
}

const DEMO_TOURNAMENTS: Tournament[] = [
  {
    id: "1",
    name: "Lahore Winter Open 2026",
    city: "Lahore",
    sportType: "tennis",
    date: "2026-05-15",
    endDate: "2026-05-18",
    venue: "Lahore Gymkhana Club",
    surface: "Hard",
    categories: ["2.5-3.0", "3.0-3.5", "3.5-4.0", "4.0-4.5", "4.5-5.0"],
    entryFee: 5000,
    prize: "Rs.100,000 + Trophy",
    organizer: "PLTA",
    whatsapp: "923392211838",
    description: "Annual open tournament for all skill levels. Cash prizes for winners!",
    featured: true,
    photo: "https://picsum.photos/seed/tourney1/600/400",
  },
  {
    id: "2",
    name: "DHA Padel Championship",
    city: "Lahore",
    sportType: "padel",
    date: "2026-05-20",
    endDate: "2026-05-22",
    venue: "Padel Cafe Lahore",
    surface: "Artificial Grass",
    categories: ["Open", "Intermediate", "Beginner"],
    entryFee: 8000,
    prize: "Rs.50,000 + Medals",
    organizer: "Padel Cafe",
    whatsapp: "923392211838",
    description: "First edition of DHA Padel Championship. Teams of 2 required.",
    featured: true,
    photo: "https://picsum.photos/seed/tourney2/600/400",
  },
  {
    id: "3",
    name: "Karachi Open Tennis",
    city: "Karachi",
    sportType: "tennis",
    date: "2026-06-01",
    endDate: "2026-06-05",
    venue: "Karachi Gymkhana",
    surface: "Hard",
    categories: ["Open", "3.5+", "Amateur"],
    entryFee: 6000,
    prize: "Rs.75,000",
    organizer: "Sindh Tennis Association",
    whatsapp: "923392211838",
    description: "Premiere tennis event of the season in Karachi.",
    featured: true,
    photo: "https://picsum.photos/seed/tourney3/600/400",
  },
  {
    id: "4",
    name: "Islamabad Cup",
    city: "Islamabad",
    sportType: "tennis",
    date: "2026-06-10",
    endDate: "2026-06-12",
    venue: "Islamabad Club",
    surface: "Clay",
    categories: ["All Levels"],
    entryFee: 4000,
    prize: "Rs.50,000",
    organizer: "Islamabad Tennis Federation",
    whatsapp: "923392211838",
    description: "Clay court championship in the federal capital.",
    featured: false,
    photo: "https://picsum.photos/seed/tourney4/600/400",
  },
  {
    id: "5",
    name: "Mixed Doubles Festival",
    city: "Lahore",
    sportType: "tennis",
    date: "2026-06-20",
    endDate: "2026-06-22",
    venue: "DHA Sports Complex",
    surface: "Hard",
    categories: ["Open", "3.5-4.5"],
    entryFee: 3500,
    prize: "Rs.30,000",
    organizer: "Lahore Tennis Academy",
    whatsapp: "923392211838",
    description: "Men's and Women's pairs. Great social event!",
    featured: false,
    photo: "https://picsum.photos/seed/tourney5/600/400",
  },
];

const SPORT_ICONS: Record<string, string> = {
  tennis: "🎾",
  padel: "🏐",
};

export default function TournamentsPage() {
  const router = useRouter();
  const [cityFilter, setCityFilter] = useState<City | "All">("All");
  const [sportFilter, setSportFilter] = useState<"tennis" | "padel" | "All">("All");

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      router.replace("/onboarding");
    }
  }, [router]);

  const filtered = useMemo(() => {
    return DEMO_TOURNAMENTS.filter(t => {
      const matchCity = cityFilter === "All" || t.city === cityFilter;
      const matchSport = sportFilter === "All" || t.sportType === sportFilter;
      return matchCity && matchSport;
    });
  }, [cityFilter, sportFilter]);

  const openWhatsApp = (whatsapp: string, tournament: Tournament) => {
    const msg = encodeURIComponent(
      `Assalam o Alaikum! I'm interested in the ${tournament.name} tournament. When is the last date to register?`
    );
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-tab">
      <header className="sticky top-0 z-30 glass border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-brand" />
          <h1 className="text-white font-black text-xl tracking-tight">Tournaments</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 mt-4 space-y-3">
        {/* Sport filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["All", "tennis", "padel"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                sportFilter === s
                  ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d40]"
                  : "bg-surface text-muted-foreground border-line"
              }`}
            >
              <span>{s === "All" ? "🏆" : s === "tennis" ? "🎾" : "🏐"}</span>
              {s === "All" ? "All Sports" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* City filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["All", ...cities] as (City | "All")[]).map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                cityFilter === c
                  ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d40]"
                  : "bg-surface text-muted-foreground border-line"
              }`}
            >
              {c === "All" ? "All Cities" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments list */}
      <div className="px-4 mt-4 space-y-4 pb-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Trophy size={48} className="text-zinc-600 mx-auto mb-4" />
            <p className="text-muted-foreground">No tournaments found</p>
          </div>
        ) : (
          filtered.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-surface border border-line rounded-2xl overflow-hidden"
            >
              {/* Photo */}
              <div className="relative h-40">
                <Image
                  src={tournament.photo}
                  alt={tournament.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Sport badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1.5">
                  <span className="text-lg">{SPORT_ICONS[tournament.sportType]}</span>
                  <span className="text-white text-xs font-bold capitalize">{tournament.sportType}</span>
                </div>
                {/* Featured */}
                {tournament.featured && (
                  <div className="absolute top-3 right-3 bg-brand text-pit text-[10px] font-bold px-2 py-1 rounded-full">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg">{tournament.name}</h3>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {tournament.date} - {tournament.endDate}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <MapPin size={10} />
                  {tournament.venue} · {tournament.city}
                </div>

                <p className="text-zinc-400 text-sm mt-2">{tournament.description}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {tournament.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] px-2 py-0.5 bg-surface-2 rounded-full text-muted-foreground"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Entry fee & Prize */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                  <div>
                    <p className="text-muted-foreground text-xs">Entry Fee</p>
                    <p className="text-brand font-black text-lg">
                      Rs.{tournament.entryFee.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Prize</p>
                    <p className="text-yellow-400 font-bold text-sm">{tournament.prize}</p>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => openWhatsApp(tournament.whatsapp, tournament)}
                  className="w-full mt-3 py-2.5 bg-brand text-pit font-black rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <MessageCircle size={16} />
                  Register via WhatsApp
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
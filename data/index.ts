// ─── Types ────────────────────────────────────────────────────────────────────

export type City =
  | "Lahore"
  | "Karachi"
  | "Islamabad"
  | "Rawalpindi"
  | "Faisalabad";

export type Surface = "Hard" | "Grass" | "Clay";
export type Level = 2.5 | 3.0 | 3.5 | 4.0 | 4.5 | 5.0;
export type PlayType = "Singles" | "Doubles" | "Both";

export type PlayingStyle =
  | "aggressive-baseliner"
  | "baseline-grinder"
  | "counter-puncher"
  | "serve-and-volley"
  | "all-court"
  | "big-server"
  | "retriever"
  | "orthodox";

export interface PlayingStyleInfo {
  id: PlayingStyle;
  name: string;
  icon: string;
  description: string;
  strengths: string[];
  diagram: string;
}

export const PLAYING_STYLES: PlayingStyleInfo[] = [
  {
    id: "aggressive-baseliner",
    name: "Aggressive Baseliner",
    icon: "🎯",
    description: "Controls points with powerful groundstrokes from the baseline",
    strengths: ["Power", "Aggression", "Court Coverage"],
    diagram: "baseline-deep-angles",
  },
  {
    id: "baseline-grinder",
    name: "Baseline Grinder",
    icon: "⚙️",
    description: "Consistent, physical player who outlasts opponents",
    strengths: ["Endurance", "Consistency", "Mental Toughness"],
    diagram: "baseline-rally",
  },
  {
    id: "counter-puncher",
    name: "Counter-Puncher",
    icon: "🛡️",
    description: "Defensive specialist who turns defense into offense",
    strengths: ["Defense", "Returns", "Patience"],
    diagram: "counter-defense",
  },
  {
    id: "serve-and-volley",
    name: "Serve & Volley",
    icon: "🚀",
    description: "Attacks the net immediately after serving",
    strengths: ["Serve", "Net Play", "Quick Hands"],
    diagram: "serve-volley",
  },
  {
    id: "all-court",
    name: "All-Court",
    icon: "🌐",
    description: "Versatile player comfortable at any position",
    strengths: ["Versatility", "Adaptability", "Footwork"],
    diagram: "all-court",
  },
  {
    id: "big-server",
    name: "Big Server",
    icon: "💥",
    description: "Uses overwhelming serve to dominate points",
    strengths: ["Serve Speed", "Aces", "Free Points"],
    diagram: "big-serve",
  },
  {
    id: "retriever",
    name: "Retriever",
    icon: "🦎",
    description: "Never gives up, retrieves every ball",
    strengths: ["Speed", "Defense", "Persistence"],
    diagram: "retrieval",
  },
  {
    id: "orthodox",
    name: "Classic/Orthodox",
    icon: "📐",
    description: "Traditional playing style with solid technique",
    strengths: ["Technique", "Sportsmanship", "Reliability"],
    diagram: "orthodox-stance",
  },
];

export interface Player {
  id: string;
  kind: "player";
  name: string;
  age: number;
  gender: "M" | "F";
  city: City;
  level: Level;
  playingStyle: PlayingStyle;
  photo: string;
  status: string;
  playType: PlayType;
  wins: number;
  losses: number;
}

export interface Court {
  id: string;
  kind: "court";
  name: string;
  city: City;
  surface: Surface;
  surfaces?: Surface[];
  pricePerHour: number;
  photo: string;
  distance: string;
  totalCourts: number;
  amenities: string[];
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  featured: boolean;
}

export interface Coach {
  id: string;
  kind: "coach";
  name: string;
  age: number;
  gender: "M" | "F";
  city: City;
  specialization: string;
  ratePerHour: number;
  photo: string;
  rating: number;
  yearsExperience: number;
  students: number;
  bio: string;
}

export type SwipeItem = Player | Coach;

// ─── Cities list ───────────────────────────────────────────────────────────────

export const cities: City[] = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
];

// ─── Demo time slots ───────────────────────────────────────────────────────────

export const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00",
];

// All slots available (admin can manage via API)
export function isSlotAvailable(_slot?: string): boolean {
  return true;
}

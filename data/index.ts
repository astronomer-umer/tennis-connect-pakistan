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

export interface Player {
  id: string;
  kind: "player";
  name: string;
  age: number;
  gender: "M" | "F";
  city: City;
  level: Level;
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
export function isSlotAvailable(slot: string): boolean {
  return true;
}

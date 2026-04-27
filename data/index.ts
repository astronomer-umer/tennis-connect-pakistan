// ─── Types ────────────────────────────────────────────────────────────────────

export type City =
  | "Lahore"
  | "Karachi"
  | "Islamabad"
  | "Rawalpindi"
  | "Faisalabad"
  | "Multan"
  | "Peshawar";

export type SportType = "tennis" | "padel";
export type Surface =
  | "Hard"
  | "Clay"
  | "Grass"
  | "Artificial Grass"
  | "Cement"
  | "Polyester";
export type Level = 2.5 | 3.0 | 3.5 | 4.0 | 4.5 | 5.0;
export type PlayType = "Singles" | "Doubles" | "Both";
export type CourtType = "private" | "public" | "semi-private" | "premium" | "commercial" | "restricted";

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
  area: string;
  city: City;
  sportType: SportType;
  surface: Surface;
  surfaces?: Surface[];
  pricePerHour: number;
  photo: string;
  distance: string;
  totalCourts: number;
  amenities: string[];
  courtType: CourtType;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  featured: boolean;
  phone: string;
  whatsapp: string;
  locationUrl: string;
}

export interface Coach {
  id: string;
  kind: "coach";
  name: string;
  age: number;
  gender: "M" | "F";
  city: City;
  sportType: SportType;
  specialization: string;
  ratePerHour: number;
  photo: string;
  rating: number;
  yearsExperience: number;
  students: number;
  bio: string;
}

export interface Tournament {
  id: string;
  name: string;
  city: City;
  sportType: SportType;
  date: string;
  endDate: string;
  venue: string;
  surface: Surface;
  categories: string[];
  entryFee: number;
  prize: string;
  organizer: string;
  whatsapp: string;
  description: string;
  featured: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  city: City;
  level: number;
  wins: number;
  losses: number;
  winRate: number;
  cityRank: number;
  levelRank: number;
}

export type SwipeItem = Player | Coach;

// ─── Cities list ───────────────────────────────────────────────────────────────

export const cities: City[] = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
];

export const sportTypes: SportType[] = ["tennis", "padel"];

export const sportLabels: Record<SportType, string> = {
  tennis: "Tennis",
  padel: "Padel",
};

export const sportLabelsUrdu: Record<SportType, string> = {
  tennis: "ٹینس",
  padel: "پیڈل",
};

// ─── Demo time slots ───────────────────────────────────────────────────────────

export const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
];

export function isSlotAvailable(_slot?: string): boolean {
  return true;
}

// ─── Urdu Translations ─────────────────────────────────────────────────────────

export const urdu = {
  common: {
    discover: "دریافت",
    courts: "کورٹس",
    matches: "میچز",
    profile: "پروفائل",
    home: "ہوم",
    bookNow: "ابھی بک کریں",
    bookCourt: "کورٹ بک کریں",
    tennis: "ٹینس",
    padel: "پیڈل",
    book: "بک",
    back: "واپس",
    cancel: "منسوخ",
    confirm: "تصدیق",
    save: "سیو",
    delete: "حذف",
    edit: "ترمیم",
    add: "شامل",
    search: "تلاش",
    filter: "فلٹر",
    allCities: "تمام شہر",
    allSports: "تمام کھیل",
    allSurfaces: "تمام سرفیس",
    loading: "لوڈ ہو رہا ہے...",
    noResults: "کوئی نتیجہ نہیں",
    clearFilters: "فلٹرز صاف کریں",
  },
  courts: {
    courtsTitle: "کورٹس",
    venue: "مقام",
    surface: "سرفیس",
    hard: "ہارڈ",
    clay: "کلے",
    grass: "گراس",
    pricePerHour: "فی گھنٹہ قیمت",
    totalCourts: "کل کورٹس",
    amenities: "سہولیات",
    open: "کھلا",
    closed: "بند",
    featured: "نمایاں",
    distance: "فاصلہ",
    hours: "گھنٹے",
  },
  match: {
    itsAMatch: "میچ ہو گیا!",
    connectedWith: "سے ملا",
    keepSwiping: "سوائپ جاری رکھیں",
    noMatchesYet: "ابھی تک کوئی میچ نہیں",
    swipeToConnect: "دوسرے کھلاڑیوں سے ملانے کے لیے سوائپ کریں",
    chatNow: "ابھی چیٹ کریں",
  },
  profile: {
    myLevel: "میرا لیول",
    preferredCities: "ترجیحی شہر",
    bookingHistory: "بکنگ ہسٹری",
    wins: "جیت",
    losses: "ہار",
    goldenSets: "گولڈن سیٹس",
    level: "لیول",
    bookings: "بکنگز",
    bio: "بائیو",
    signOut: "سائن آؤٹ",
  },
  onboarding: {
    getStarted: "شروع کریں",
    whoAreYou: "آپ کون ہیں؟",
    yourLevel: "آپ کا لیول؟",
    almostDone: "تقریباً ہو گیا!",
    tellUs: "ہمیں بتائیں",
    lookingFor: "آپ کیا تلاش کر رہے ہیں",
    step: "اسٹیپ",
  },
  action: {
    pass: "پاس",
    connect: "ملایں",
    reset: "ری سیٹ",
    share: "شیئر",
    copy: "کاپی",
    copied: "کاپی ہو گیا!",
  },
};
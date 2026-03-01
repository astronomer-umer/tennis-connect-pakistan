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
  surfaces?: Surface[]; // for dual-surface courts
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

// ─── Players (15) ─────────────────────────────────────────────────────────────

export const players: Player[] = [
  {
    id: "p1",
    kind: "player",
    name: "Ahmed Raza",
    age: 28,
    gender: "M",
    city: "Lahore",
    level: 4.0,
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "Looking for doubles tonight 🎾",
    playType: "Doubles",
    wins: 34,
    losses: 12,
  },
  {
    id: "p2",
    kind: "player",
    name: "Sara Khan",
    age: 24,
    gender: "F",
    city: "Karachi",
    level: 3.5,
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "Anyone for a 7 AM rally? ☀️",
    playType: "Both",
    wins: 18,
    losses: 8,
  },
  {
    id: "p3",
    kind: "player",
    name: "Bilal Hussain",
    age: 32,
    gender: "M",
    city: "Islamabad",
    level: 4.5,
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
    status: "PTCL ranked — need tough practice matches",
    playType: "Singles",
    wins: 67,
    losses: 23,
  },
  {
    id: "p4",
    kind: "player",
    name: "Fatima Malik",
    age: 26,
    gender: "F",
    city: "Lahore",
    level: 3.0,
    photo: "https://randomuser.me/api/portraits/women/17.jpg",
    status: "Learning — patient partner please 🙏",
    playType: "Both",
    wins: 5,
    losses: 15,
  },
  {
    id: "p5",
    kind: "player",
    name: "Hamza Sheikh",
    age: 22,
    gender: "M",
    city: "Karachi",
    level: 3.5,
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
    status: "After-office games, DHA area only",
    playType: "Singles",
    wins: 22,
    losses: 19,
  },
  {
    id: "p6",
    kind: "player",
    name: "Zara Ahmed",
    age: 29,
    gender: "F",
    city: "Islamabad",
    level: 4.0,
    photo: "https://randomuser.me/api/portraits/women/28.jpg",
    status: "Smash queen 👑 looking for mixed doubles",
    playType: "Doubles",
    wins: 31,
    losses: 11,
  },
  {
    id: "p7",
    kind: "player",
    name: "Usman Ali",
    age: 35,
    gender: "M",
    city: "Lahore",
    level: 5.0,
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
    status: "Former national circuit — serious players only",
    playType: "Both",
    wins: 120,
    losses: 34,
  },
  {
    id: "p8",
    kind: "player",
    name: "Ayesha Siddiqui",
    age: 23,
    gender: "F",
    city: "Faisalabad",
    level: 3.0,
    photo: "https://randomuser.me/api/portraits/women/61.jpg",
    status: "Weekend warrior — free Sunday mornings",
    playType: "Both",
    wins: 8,
    losses: 20,
  },
  {
    id: "p9",
    kind: "player",
    name: "Omar Farooq",
    age: 30,
    gender: "M",
    city: "Rawalpindi",
    level: 4.0,
    photo: "https://randomuser.me/api/portraits/men/41.jpg",
    status: "Ranked #3 in Pindi — bring your A game 💪",
    playType: "Singles",
    wins: 45,
    losses: 18,
  },
  {
    id: "p10",
    kind: "player",
    name: "Sana Butt",
    age: 27,
    gender: "F",
    city: "Lahore",
    level: 3.5,
    photo: "https://randomuser.me/api/portraits/women/36.jpg",
    status: "PLTA member — open to all levels",
    playType: "Both",
    wins: 25,
    losses: 16,
  },
  {
    id: "p11",
    kind: "player",
    name: "Adnan Qureshi",
    age: 25,
    gender: "M",
    city: "Karachi",
    level: 4.5,
    photo: "https://randomuser.me/api/portraits/men/78.jpg",
    status: "Karachi circuit regular — intense rallies only",
    playType: "Singles",
    wins: 58,
    losses: 21,
  },
  {
    id: "p12",
    kind: "player",
    name: "Maryam Iqbal",
    age: 31,
    gender: "F",
    city: "Islamabad",
    level: 3.5,
    photo: "https://randomuser.me/api/portraits/women/52.jpg",
    status: "Just moved here — building my tennis squad!",
    playType: "Both",
    wins: 19,
    losses: 14,
  },
  {
    id: "p13",
    kind: "player",
    name: "Kamran Mirza",
    age: 28,
    gender: "M",
    city: "Lahore",
    level: 4.0,
    photo: "https://randomuser.me/api/portraits/men/23.jpg",
    status: "6 AM DHA courts — early birds only 🌅",
    playType: "Singles",
    wins: 38,
    losses: 20,
  },
  {
    id: "p14",
    kind: "player",
    name: "Hira Baig",
    age: 24,
    gender: "F",
    city: "Karachi",
    level: 3.0,
    photo: "https://randomuser.me/api/portraits/women/9.jpg",
    status: "Social player — mostly doubles for fun 🥂",
    playType: "Doubles",
    wins: 12,
    losses: 18,
  },
  {
    id: "p15",
    kind: "player",
    name: "Faisal Nawaz",
    age: 33,
    gender: "M",
    city: "Islamabad",
    level: 4.5,
    photo: "https://randomuser.me/api/portraits/men/88.jpg",
    status: "Improving serve speed this season 🚀",
    playType: "Both",
    wins: 52,
    losses: 29,
  },
];

// ─── Courts (12 — real venues) ────────────────────────────────────────────────

export const courts: Court[] = [
  // ── Lahore ──────────────────────────────────────────────────────────────────
  {
    id: "c1",
    kind: "court",
    name: "Bagh-e-Jinnah PLTA",
    city: "Lahore",
    surface: "Grass",
    surfaces: ["Grass", "Hard"],
    pricePerHour: 800,
    photo: "https://picsum.photos/seed/tcp-c1/600/400",
    distance: "3.2 km",
    totalCourts: 6,
    amenities: ["Changing Rooms", "Cafe", "Parking", "Floodlights"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "21:00",
    featured: true,
  },
  {
    id: "c2",
    kind: "court",
    name: "DHA Phase 8 Sports Complex",
    city: "Lahore",
    surface: "Hard",
    pricePerHour: 1200,
    photo: "https://picsum.photos/seed/tcp-c2/600/400",
    distance: "8.5 km",
    totalCourts: 4,
    amenities: ["AC Lobby", "Pro Shop", "Coaching", "Parking"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "23:00",
    featured: true,
  },
  {
    id: "c3",
    kind: "court",
    name: "DHA XX Block Courts",
    city: "Lahore",
    surface: "Hard",
    pricePerHour: 1000,
    photo: "https://picsum.photos/seed/tcp-c3/600/400",
    distance: "11.2 km",
    totalCourts: 3,
    amenities: ["Parking", "Floodlights", "Water Cooler"],
    isOpen: true,
    openTime: "05:30",
    closeTime: "22:00",
    featured: false,
  },
  {
    id: "c4",
    kind: "court",
    name: "Nishtar Park Tennis Club",
    city: "Lahore",
    surface: "Hard",
    pricePerHour: 900,
    photo: "https://picsum.photos/seed/tcp-c4/600/400",
    distance: "5.7 km",
    totalCourts: 2,
    amenities: ["Changing Rooms", "Parking"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "20:00",
    featured: false,
  },
  {
    id: "c5",
    kind: "court",
    name: "Punjab Tennis Academy",
    city: "Lahore",
    surface: "Hard",
    pricePerHour: 700,
    photo: "https://picsum.photos/seed/tcp-c5/600/400",
    distance: "4.1 km",
    totalCourts: 5,
    amenities: ["Coaching", "Ball Machine", "Parking"],
    isOpen: true,
    openTime: "07:00",
    closeTime: "21:00",
    featured: false,
  },
  // ── Islamabad ────────────────────────────────────────────────────────────────
  {
    id: "c6",
    kind: "court",
    name: "PTF National Training Centre",
    city: "Islamabad",
    surface: "Hard",
    pricePerHour: 1500,
    photo: "https://picsum.photos/seed/tcp-c6/600/400",
    distance: "6.8 km",
    totalCourts: 10,
    amenities: ["World-Class Facility", "Gym", "Physiotherapy", "Cafe", "Coaching"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "22:00",
    featured: true,
  },
  {
    id: "c7",
    kind: "court",
    name: "CDA Tennis Club",
    city: "Islamabad",
    surface: "Hard",
    pricePerHour: 1100,
    photo: "https://picsum.photos/seed/tcp-c7/600/400",
    distance: "9.3 km",
    totalCourts: 4,
    amenities: ["Changing Rooms", "Parking", "Floodlights"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "22:30",
    featured: false,
  },
  {
    id: "c8",
    kind: "court",
    name: "Gulberg Greens Club",
    city: "Islamabad",
    surface: "Hard",
    pricePerHour: 1300,
    photo: "https://picsum.photos/seed/tcp-c8/600/400",
    distance: "14.2 km",
    totalCourts: 3,
    amenities: ["Premium Facilities", "Pool", "Restaurant", "Valet Parking"],
    isOpen: true,
    openTime: "07:00",
    closeTime: "23:00",
    featured: false,
  },
  {
    id: "c9",
    kind: "court",
    name: "F-9 Park Tennis",
    city: "Islamabad",
    surface: "Hard",
    pricePerHour: 600,
    photo: "https://picsum.photos/seed/tcp-c9/600/400",
    distance: "4.5 km",
    totalCourts: 2,
    amenities: ["Free Parking", "Open Air"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "19:00",
    featured: false,
  },
  // ── Karachi ──────────────────────────────────────────────────────────────────
  {
    id: "c10",
    kind: "court",
    name: "Naya Nazimabad Gymkhana",
    city: "Karachi",
    surface: "Hard",
    pricePerHour: 1400,
    photo: "https://picsum.photos/seed/tcp-c10/600/400",
    distance: "7.6 km",
    totalCourts: 4,
    amenities: ["Members Club", "Cafe", "Changing Rooms", "Coaching"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "22:00",
    featured: true,
  },
  {
    id: "c11",
    kind: "court",
    name: "DHA Karachi Sports Complex",
    city: "Karachi",
    surface: "Hard",
    pricePerHour: 1600,
    photo: "https://picsum.photos/seed/tcp-c11/600/400",
    distance: "12.4 km",
    totalCourts: 6,
    amenities: ["Premium Courts", "AC Lounges", "Pro Shop", "Valet"],
    isOpen: true,
    openTime: "06:00",
    closeTime: "23:00",
    featured: false,
  },
  {
    id: "c12",
    kind: "court",
    name: "Defence Club Grass Courts",
    city: "Karachi",
    surface: "Grass",
    pricePerHour: 1800,
    photo: "https://picsum.photos/seed/tcp-c12/600/400",
    distance: "15.1 km",
    totalCourts: 3,
    amenities: ["Heritage Grass Courts", "Clubhouse", "Fine Dining", "Valet"],
    isOpen: true,
    openTime: "07:00",
    closeTime: "21:00",
    featured: true,
  },
];

// ─── Coaches (8) ──────────────────────────────────────────────────────────────

export const coaches: Coach[] = [
  {
    id: "co1",
    kind: "coach",
    name: "Coach Tariq Ahmed",
    age: 42,
    gender: "M",
    city: "Lahore",
    specialization: "Serve & Volley",
    ratePerHour: 2500,
    photo: "https://randomuser.me/api/portraits/men/90.jpg",
    rating: 4.9,
    yearsExperience: 15,
    students: 85,
    bio: "Pakistan Under-18 coach 2016-2020. Trained 3 national ranked players.",
  },
  {
    id: "co2",
    kind: "coach",
    name: "Coach Maria Khan",
    age: 35,
    gender: "F",
    city: "Karachi",
    specialization: "Junior Development",
    ratePerHour: 2000,
    photo: "https://randomuser.me/api/portraits/women/90.jpg",
    rating: 4.8,
    yearsExperience: 10,
    students: 120,
    bio: "Grooming the next generation. ITF Level 2 certified. U-12 specialist.",
  },
  {
    id: "co3",
    kind: "coach",
    name: "Coach Azhar Iqbal",
    age: 48,
    gender: "M",
    city: "Islamabad",
    specialization: "Match Strategy",
    ratePerHour: 3000,
    photo: "https://randomuser.me/api/portraits/men/72.jpg",
    rating: 4.7,
    yearsExperience: 20,
    students: 45,
    bio: "Former PTF certified coach. Mental game & tactical masterclass.",
  },
  {
    id: "co4",
    kind: "coach",
    name: "Coach Imran Butt",
    age: 38,
    gender: "M",
    city: "Lahore",
    specialization: "Fitness & Power",
    ratePerHour: 2200,
    photo: "https://randomuser.me/api/portraits/men/47.jpg",
    rating: 4.6,
    yearsExperience: 12,
    students: 60,
    bio: "ATP fitness methodology certified. Explosive movement & agility drills.",
  },
  {
    id: "co5",
    kind: "coach",
    name: "Coach Fatima Rehman",
    age: 33,
    gender: "F",
    city: "Karachi",
    specialization: "Technical Groundstrokes",
    ratePerHour: 1800,
    photo: "https://randomuser.me/api/portraits/women/74.jpg",
    rating: 4.9,
    yearsExperience: 8,
    students: 95,
    bio: "ITF Level 2 certified. Perfect technique, perfect results.",
  },
  {
    id: "co6",
    kind: "coach",
    name: "Coach Sajid Ali",
    age: 44,
    gender: "M",
    city: "Rawalpindi",
    specialization: "All-round Game",
    ratePerHour: 1500,
    photo: "https://randomuser.me/api/portraits/men/62.jpg",
    rating: 4.5,
    yearsExperience: 18,
    students: 150,
    bio: "Most affordable elite coaching in Pindi. 150+ students transformed.",
  },
  {
    id: "co7",
    kind: "coach",
    name: "Coach Zubair Hassan",
    age: 40,
    gender: "M",
    city: "Lahore",
    specialization: "Competition Prep",
    ratePerHour: 3500,
    photo: "https://randomuser.me/api/portraits/men/37.jpg",
    rating: 4.8,
    yearsExperience: 16,
    students: 30,
    bio: "Exclusively trains ranked players. Serious about winning.",
  },
  {
    id: "co8",
    kind: "coach",
    name: "Coach Seema Rana",
    age: 36,
    gender: "F",
    city: "Islamabad",
    specialization: "Beginner–Intermediate",
    ratePerHour: 1600,
    photo: "https://randomuser.me/api/portraits/women/57.jpg",
    rating: 4.7,
    yearsExperience: 9,
    students: 110,
    bio: "Super patient, confidence-building approach. Zero intimidation zone.",
  },
];

// ─── Featured Hot Items (for carousel) ────────────────────────────────────────

export const hotItems = [
  courts.find((c) => c.id === "c1")!,
  players.find((p) => p.id === "p7")!,
  courts.find((c) => c.id === "c6")!,
  coaches.find((c) => c.id === "co1")!,
  courts.find((c) => c.id === "c12")!,
  players.find((p) => p.id === "p3")!,
  coaches.find((c) => c.id === "co5")!,
  courts.find((c) => c.id === "c2")!,
];

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

// Some slots are "unavailable" for demo — pseudo-random based on slot index
export function isSlotAvailable(slot: string): boolean {
  const unavailable = new Set(["10:00", "11:00", "14:00", "15:00", "19:00"]);
  return !unavailable.has(slot);
}

"server-only";

import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

function getClient(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    // Turso cloud or local file DB
    client = createClient({ url, authToken });
  } else {
    // Fallback: in-memory SQLite (works on Vercel but data resets on cold start)
    console.warn(
      "TURSO_DATABASE_URL not set — using in-memory SQLite. Data will not persist between serverless invocations."
    );
    client = createClient({ url: ":memory:" });
  }

  return client;
}

let tablesInitialized = false;

async function initializeTables() {
  if (tablesInitialized) return;

  const db = getClient();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      city TEXT,
      level REAL DEFAULT 3.5,
      play_type TEXT DEFAULT 'Both',
      bio TEXT,
      photo_url TEXT,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      golden_sets INTEGER DEFAULT 0,
      preferred_cities TEXT DEFAULT '[]',
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS courts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      area TEXT,
      city TEXT NOT NULL,
      sport_type TEXT NOT NULL DEFAULT 'tennis',
      surface TEXT NOT NULL,
      surfaces TEXT,
      price_per_hour INTEGER NOT NULL,
      photo TEXT,
      distance TEXT,
      total_courts INTEGER DEFAULT 1,
      amenities TEXT DEFAULT '[]',
      court_type TEXT DEFAULT 'public',
      is_open INTEGER DEFAULT 1,
      open_time TEXT,
      close_time TEXT,
      featured INTEGER DEFAULT 0,
      phone TEXT,
      whatsapp TEXT,
      location_url TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      court_id TEXT NOT NULL,
      court_name TEXT NOT NULL,
      city TEXT NOT NULL,
      surface TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration_hours INTEGER DEFAULT 1,
      payment TEXT,
      total_cost INTEGER NOT NULL,
      status TEXT DEFAULT 'confirmed',
      booked_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      profile_type TEXT NOT NULL,
      matched_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      match_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      text TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      sent_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      swiped_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      city TEXT NOT NULL,
      professional_status TEXT,
      age_group TEXT,
      message TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      reported_user_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      blocker_id TEXT NOT NULL,
      blocked_id TEXT NOT NULL,
      created_at INTEGER
    );
  `);

  // Seed courts if empty (for in-memory fallback or fresh DB)
  const courtCount = await db.execute("SELECT COUNT(*) as cnt FROM courts");
  const count = (courtCount.rows[0] as unknown as { cnt: number }).cnt;
  if (count === 0) {
    await seedCourts(db);
  }

  tablesInitialized = true;
  console.log("Database tables initialized" + (process.env.TURSO_DATABASE_URL ? " on Turso" : " (in-memory)"));
}

async function seedCourts(db: Client) {
  const now = Date.now();
  
  const tennisCourts = {
    // Lahore Tennis
    "lhr-tennis-1": { name: "Lahore Gymkhana Club", area: "Mall Road", city: "Lahore", sport: "tennis", surface: "Hard", price: 2500, total: 4, type: "private", amenities: "Floodlights,Pro Shop,Changing Rooms", featured: 1, open: "06:00", close: "22:00" },
    "lhr-tennis-2": { name: "Punjab Lawn Tennis Association (PLTA)", area: "Bagh-e-Jinnah", city: "Lahore", sport: "tennis", surface: "Clay", price: 1500, total: 3, type: "public", amenities: "Floodlights,Coaching", featured: 1, open: "07:00", close: "21:00" },
    "lhr-tennis-3": { name: "DHA Sports Complex", area: "DHA Phase 5", city: "Lahore", sport: "tennis", surface: "Hard", price: 2800, total: 4, type: "semi-private", amenities: "Floodlights,Gym,Parking", featured: 1, open: "06:00", close: "22:00" },
    "lhr-tennis-4": { name: "Lahore Garrison Club", area: "Cantt", city: "Lahore", sport: "tennis", surface: "Hard", price: 3000, total: 3, type: "private", amenities: "Floodlights,Changing Rooms,Cafe", featured: 0, open: "06:00", close: "21:00" },
    "lhr-tennis-5": { name: "Model Town Club", area: "Model Town", city: "Lahore", sport: "tennis", surface: "Hard", price: 2200, total: 2, type: "private", amenities: "Floodlights,Parking", featured: 0, open: "06:00", close: "21:00" },
    "lhr-tennis-6": { name: "Valencia Town Sports Complex", area: "Valencia", city: "Lahore", sport: "tennis", surface: "Hard", price: 1800, total: 2, type: "semi-private", amenities: "Floodlights,Parking", featured: 0, open: "07:00", close: "20:00" },
    "lhr-tennis-7": { name: "Samanabad Sports Arena", area: "Samanabad", city: "Lahore", sport: "tennis", surface: "Hard", price: 1200, total: 2, type: "public", amenities: "Floodlights", featured: 0, open: "07:00", close: "19:00" },
    "lhr-tennis-8": { name: "Jallo Park Tennis Courts", area: "Jallo", city: "Lahore", sport: "tennis", surface: "Hard", price: 800, total: 2, type: "public", amenities: "Parking", featured: 0, open: "07:00", close: "18:00" },
    "lhr-tennis-9": { name: "University of Lahore Courts", area: "UOL", city: "Lahore", sport: "tennis", surface: "Hard", price: 1500, total: 3, type: "semi-private", amenities: "Floodlights,Changing Rooms", featured: 0, open: "06:00", close: "20:00" },
    "lhr-tennis-10": { name: "Packages Mall Club Courts", area: "Gulberg", city: "Lahore", sport: "tennis", surface: "Hard", price: 2500, total: 2, type: "private", amenities: "Floodlights,Parking,Cafe", featured: 0, open: "06:00", close: "21:00" },
    // Karachi Tennis
    "khi-tennis-1": { name: "Karachi Gymkhana", area: "Saddar", city: "Karachi", sport: "tennis", surface: "Hard", price: 3000, total: 4, type: "private", amenities: "Floodlights,Pro Shop,Cafe", featured: 1, open: "06:00", close: "22:00" },
    "khi-tennis-2": { name: "Sindh Tennis Association Complex", area: "Clifton", city: "Karachi", sport: "tennis", surface: "Hard", price: 1800, total: 3, type: "public", amenities: "Floodlights,Coaching", featured: 1, open: "07:00", close: "21:00" },
    "khi-tennis-3": { name: "KMC Sports Complex", area: "Kashmir Road", city: "Karachi", sport: "tennis", surface: "Hard", price: 1200, total: 2, type: "public", amenities: "Floodlights", featured: 0, open: "08:00", close: "20:00" },
    "khi-tennis-4": { name: "DA Creek Club", area: "Defence", city: "Karachi", sport: "tennis", surface: "Hard", price: 3500, total: 4, type: "private", amenities: "Floodlights,Gym,Swimming Pool,Cafe", featured: 1, open: "06:00", close: "23:00" },
    "khi-tennis-5": { name: "Arabian Sea Country Club", area: "Gadap", city: "Karachi", sport: "tennis", surface: "Hard", price: 2800, total: 3, type: "private", amenities: "Floodlights,Parking,Cafe", featured: 0, open: "06:00", close: "21:00" },
    "khi-tennis-6": { name: "Modern Club", area: "PECHS", city: "Karachi", sport: "tennis", surface: "Clay", price: 2200, total: 2, type: "private", amenities: "Floodlights,Changing Rooms", featured: 0, open: "06:00", close: "21:00" },
    "khi-tennis-7": { name: "Hill Park Sports Complex", area: "PECHS", city: "Karachi", sport: "tennis", surface: "Hard", price: 1000, total: 2, type: "public", amenities: "Parking", featured: 0, open: "08:00", close: "20:00" },
    "khi-tennis-8": { name: "Karachi Club", area: "Civil Lines", city: "Karachi", sport: "tennis", surface: "Hard", price: 2500, total: 3, type: "private", amenities: "Floodlights,Changing Rooms", featured: 0, open: "06:00", close: "21:00" },
    "khi-tennis-9": { name: "KDA Sports Complex", area: "KDA", city: "Karachi", sport: "tennis", surface: "Hard", price: 1500, total: 2, type: "public", amenities: "Floodlights", featured: 0, open: "08:00", close: "20:00" },
    "khi-tennis-10": { name: "Navy Sports Complex", area: "Karsaz", city: "Karachi", sport: "tennis", surface: "Hard", price: 1800, total: 3, type: "restricted", amenities: "Floodlights,Gym", featured: 0, open: "06:00", close: "20:00" },
    // Islamabad Tennis
    "isb-tennis-1": { name: "Islamabad Club", area: "Sector F-6", city: "Islamabad", sport: "tennis", surface: "Hard", price: 3500, total: 4, type: "private", amenities: "Floodlights,Pro Shop,Gym,Cafe", featured: 1, open: "06:00", close: "22:00" },
    "isb-tennis-2": { name: "PST Tennis Complex", area: "Islamabad", city: "Islamabad", sport: "tennis", surface: "Hard", price: 1800, total: 4, type: "public", amenities: "Floodlights,Coaching", featured: 1, open: "07:00", close: "21:00" },
    "isb-tennis-3": { name: "DHA Islamabad Sports Complex", area: "DHA", city: "Islamabad", sport: "tennis", surface: "Hard", price: 2800, total: 3, type: "private", amenities: "Floodlights,Gym,Parking", featured: 1, open: "06:00", close: "22:00" },
    "isb-tennis-4": { name: "Naval Complex Islamabad", area: "E-8", city: "Islamabad", sport: "tennis", surface: "Hard", price: 2000, total: 2, type: "restricted", amenities: "Floodlights", featured: 0, open: "06:00", close: "20:00" },
    "isb-tennis-5": { name: "Bahria Sports Complex", area: "Bahria Town", city: "Islamabad", sport: "tennis", surface: "Hard", price: 2200, total: 3, type: "private", amenities: "Floodlights,Parking,Gym", featured: 0, open: "06:00", close: "21:00" },
    "isb-tennis-6": { name: "Margalla Sports Complex", area: "Islamabad", city: "Islamabad", sport: "tennis", surface: "Hard", price: 1200, total: 2, type: "public", amenities: "Floodlights,Parking", featured: 0, open: "07:00", close: "20:00" },
    "isb-tennis-7": { name: "F-9 Park Tennis Courts", area: "F-9", city: "Islamabad", sport: "tennis", surface: "Hard", price: 800, total: 2, type: "public", amenities: "Parking", featured: 0, open: "07:00", close: "19:00" },
    "isb-tennis-8": { name: "Islamabad Tennis Academy", area: "Islamabad", city: "Islamabad", sport: "tennis", surface: "Clay", price: 2000, total: 3, type: "semi-private", amenities: "Floodlights,Coaching", featured: 0, open: "06:00", close: "21:00" },
    "isb-tennis-9": { name: "Army Sports Complex", area: "Rawalpindi", city: "Islamabad", sport: "tennis", surface: "Hard", price: 1800, total: 3, type: "restricted", amenities: "Floodlights,Gym", featured: 0, open: "06:00", close: "20:00" },
    "isb-tennis-10": { name: "G-5 Sports Complex", area: "G-5", city: "Islamabad", sport: "tennis", surface: "Hard", price: 1000, total: 2, type: "public", amenities: "Floodlights", featured: 0, open: "07:00", close: "20:00" },
  };

  const padelCourts = {
    // Lahore Padel
    "lhr-padel-1": { name: "Padel Cafe Lahore", area: "DHA Phase 6", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 4500, total: 2, type: "private", amenities: "Cafe,Parking,AC", featured: 1, open: "10:00", close: "23:00" },
    "lhr-padel-2": { name: "Club Padel Lahore", area: "DHA / Goldcrest", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 5000, total: 2, type: "private", amenities: "Cafe,Pro Shop,AC", featured: 1, open: "10:00", close: "23:00" },
    "lhr-padel-3": { name: "The Courts", area: "Gulberg", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 6000, total: 2, type: "premium", amenities: "Cafe,Gym,Pro Shop,AC", featured: 1, open: "10:00", close: "23:00" },
    "lhr-padel-4": { name: "Padel Park Lahore", area: "DHA", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 4000, total: 2, type: "private", amenities: "Parking,Cafe", featured: 0, open: "12:00", close: "22:00" },
    "lhr-padel-5": { name: "The Padel Club", area: "DHA", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 4500, total: 2, type: "private", amenities: "Cafe,AC", featured: 0, open: "10:00", close: "23:00" },
    "lhr-padel-6": { name: "Padel Arena (K21)", area: "Model Town", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 3500, total: 1, type: "semi-private", amenities: "Parking", featured: 0, open: "12:00", close: "22:00" },
    "lhr-padel-7": { name: "Padel Zone (JumpZone)", area: "Gulberg", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 3000, total: 1, type: "commercial", amenities: "Arcade,Food Court", featured: 0, open: "12:00", close: "23:00" },
    "lhr-padel-8": { name: "Padel Plus", area: "EME", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 4000, total: 2, type: "private", amenities: "Parking,Cafe", featured: 0, open: "10:00", close: "22:00" },
    "lhr-padel-9": { name: "Padel Land", area: "Johar Town", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 3500, total: 2, type: "private", amenities: "Parking", featured: 0, open: "12:00", close: "22:00" },
    "lhr-padel-10": { name: "DHA Raya Padel Courts", area: "DHA Raya", city: "Lahore", sport: "padel", surface: "Artificial Grass", price: 4500, total: 2, type: "private", amenities: "Cafe,AC", featured: 0, open: "10:00", close: "23:00" },
    // Karachi Padel
    "khi-padel-1": { name: "Padel Factory Karachi", area: "DHA", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 6000, total: 2, type: "premium", amenities: "Cafe,Gym,Pro Shop,AC", featured: 1, open: "10:00", close: "23:00" },
    "khi-padel-2": { name: "Vamos Padel Club", area: "Clifton", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 5000, total: 2, type: "private", amenities: "Cafe,AC", featured: 1, open: "10:00", close: "23:00" },
    "khi-padel-3": { name: "Champions Club Padel", area: "Karachi", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 4500, total: 2, type: "private", amenities: "Cafe,Parking", featured: 0, open: "12:00", close: "22:00" },
    "khi-padel-4": { name: "House of Padel", area: "Karachi", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 4000, total: 2, type: "private", amenities: "Cafe", featured: 0, open: "10:00", close: "22:00" },
    "khi-padel-5": { name: "Matchbox Padel", area: "Karachi", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 3500, total: 1, type: "private", amenities: "Arcade", featured: 0, open: "12:00", close: "22:00" },
    "khi-padel-6": { name: "Sport On Padel", area: "Karachi", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 3000, total: 1, type: "commercial", amenities: "Food Court", featured: 0, open: "12:00", close: "23:00" },
    "khi-padel-7": { name: "Clifton Courtyard Padel", area: "Clifton", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 4500, total: 2, type: "private", amenities: "Cafe,AC", featured: 0, open: "10:00", close: "22:00" },
    "khi-padel-8": { name: "Smash X Padel (KDA)", area: "KDA", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 5500, total: 2, type: "premium", amenities: "Pro Shop,Cafe,AC", featured: 1, open: "10:00", close: "23:00" },
    "khi-padel-9": { name: "Smash X Padel (Gulshan)", area: "Gulshan", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 5000, total: 2, type: "premium", amenities: "Cafe,AC", featured: 0, open: "10:00", close: "22:00" },
    "khi-padel-10": { name: "Karachi Padel Complex", area: "Karachi", city: "Karachi", sport: "padel", surface: "Artificial Grass", price: 3500, total: 3, type: "semi-private", amenities: "Parking,Cafe", featured: 0, open: "10:00", close: "22:00" },
    // Islamabad Padel
    "isb-padel-1": { name: "Legends Arena Padel", area: "Islamabad", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 6000, total: 2, type: "premium", amenities: "Cafe,Gym,AC", featured: 1, open: "10:00", close: "23:00" },
    "isb-padel-2": { name: "Shamsi Padel Academy", area: "Islamabad", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 5500, total: 2, type: "premium", amenities: "Coaching,Cafe,AC", featured: 1, open: "10:00", close: "22:00" },
    "isb-padel-3": { name: "Padel Club Islamabad", area: "Islamabad", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 4500, total: 2, type: "private", amenities: "Cafe,AC", featured: 0, open: "10:00", close: "23:00" },
    "isb-padel-4": { name: "DHA Islamabad Padel Courts", area: "DHA", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 5000, total: 2, type: "private", amenities: "Cafe,Parking,AC", featured: 1, open: "10:00", close: "23:00" },
    "isb-padel-5": { name: "Bahria Town Padel Courts", area: "Bahria", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 4000, total: 2, type: "private", amenities: "Cafe,Parking", featured: 0, open: "12:00", close: "22:00" },
    "isb-padel-6": { name: "Sports Complex Padel Courts", area: "Islamabad", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 3000, total: 2, type: "public", amenities: "Parking", featured: 0, open: "12:00", close: "21:00" },
    "isb-padel-7": { name: "Embassy Club Padel Courts", area: "Islamabad", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 5500, total: 1, type: "restricted", amenities: "Cafe,AC", featured: 0, open: "10:00", close: "21:00" },
    "isb-padel-8": { name: "Park View Padel Courts", area: "Islamabad", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 3500, total: 2, type: "private", amenities: "Parking,Cafe", featured: 0, open: "12:00", close: "22:00" },
    "isb-padel-9": { name: "Capital Padel Club", area: "Islamabad", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 4500, total: 2, type: "private", amenities: "Cafe,AC", featured: 0, open: "10:00", close: "22:00" },
    "isb-padel-10": { name: "Twin City Padel Courts", area: "Islamabad/Rawalpindi", city: "Islamabad", sport: "padel", surface: "Artificial Grass", price: 3500, total: 2, type: "semi-private", amenities: "Parking", featured: 0, open: "10:00", close: "22:00" },
  };

  const allCourts = { ...tennisCourts, ...padelCourts };

  for (const [id, c] of Object.entries(allCourts)) {
    await db.execute({
      sql: `INSERT INTO courts (id, name, area, city, sport_type, surface, surfaces, price_per_hour, photo, distance, total_courts, amenities, court_type, is_open, open_time, close_time, featured, phone, whatsapp, location_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, c.name, c.area, c.city, c.sport, c.surface, c.surface, c.price, `https://picsum.photos/seed/${id}/600/400`, "0 km", c.total, `[${c.amenities.split(",").map(a => `"${a.trim()}"`).join(",")}]`, c.type, 1, c.open, c.close, c.featured, "", "", "", now],
    });
  }
  console.log(`Seeded ${Object.keys(allCourts).length} courts (${Object.keys(tennisCourts).length} tennis, ${Object.keys(padelCourts).length} padel)`);
}

export async function runQuery<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | null)[] = []
): Promise<T[]> {
  await initializeTables();
  const db = getClient();
  const result = await db.execute({ sql, args: params });
  return result.rows as unknown as T[];
}

export async function runStatement(
  sql: string,
  params: (string | number | null)[] = []
) {
  await initializeTables();
  const db = getClient();
  await db.execute({ sql, args: params });
}

export async function sendPushNotification(title: string, body: string, icon?: string) {
  if (typeof window === "undefined") return;
  
  if (!("Notification" in window)) {
    console.log("Notifications not supported");
    return;
  }
  
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: icon || "/icons/icon-192.svg",
      badge: "/icons/icon-192.svg",
    });
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(title, { body, icon: icon || "/icons/icon-192.svg" });
    }
  }
}

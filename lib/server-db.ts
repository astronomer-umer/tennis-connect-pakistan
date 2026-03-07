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
      city TEXT NOT NULL,
      surface TEXT NOT NULL,
      surfaces TEXT,
      price_per_hour INTEGER NOT NULL,
      photo TEXT,
      distance TEXT,
      total_courts INTEGER DEFAULT 1,
      amenities TEXT DEFAULT '[]',
      is_open INTEGER DEFAULT 1,
      open_time TEXT,
      close_time TEXT,
      featured INTEGER DEFAULT 0,
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
  const courts = [
    // Lahore
    { id: "court-1", name: "Lahore Gymkhana Tennis Courts", city: "Lahore", surface: "Hard", surfaces: "Hard,Clay", price: 2500, photo: "https://picsum.photos/seed/lhr-gymkhana/600/400", distance: "2.3 km", totalCourts: 4, amenities: '["Floodlights","Pro Shop","Changing Rooms"]', featured: 1, open: "06:00", close: "22:00" },
    { id: "court-2", name: "Punjab Club Tennis Complex", city: "Lahore", surface: "Clay", surfaces: "Clay", price: 2000, photo: "https://picsum.photos/seed/lhr-punjab/600/400", distance: "5.1 km", totalCourts: 3, amenities: '["Floodlights","Coaching"]', featured: 0, open: "07:00", close: "21:00" },
    { id: "court-3", name: "Defence Raya Tennis Club", city: "Lahore", surface: "Grass", surfaces: "Grass,Hard", price: 3500, photo: "https://picsum.photos/seed/lhr-raya/600/400", distance: "8.2 km", totalCourts: 5, amenities: '["Floodlights","Pro Shop","Swimming Pool","Cafe"]', featured: 1, open: "06:00", close: "22:00" },
    { id: "court-4", name: "LCCA Tennis Academy", city: "Lahore", surface: "Hard", surfaces: "Hard", price: 1800, photo: "https://picsum.photos/seed/lhr-lcca/600/400", distance: "3.5 km", totalCourts: 2, amenities: '["Coaching","Floodlights"]', featured: 0, open: "07:00", close: "20:00" },
    { id: "court-5", name: "Model Town Club Courts", city: "Lahore", surface: "Hard", surfaces: "Hard,Clay", price: 2200, photo: "https://picsum.photos/seed/lhr-model/600/400", distance: "6.0 km", totalCourts: 3, amenities: '["Floodlights","Changing Rooms","Parking"]', featured: 0, open: "06:00", close: "21:00" },
    // Karachi
    { id: "court-6", name: "Karachi Gymkhana Tennis Courts", city: "Karachi", surface: "Hard", surfaces: "Hard,Clay", price: 2800, photo: "https://picsum.photos/seed/khi-gymkhana/600/400", distance: "1.5 km", totalCourts: 6, amenities: '["Floodlights","Pro Shop","Coaching","Cafe"]', featured: 1, open: "06:00", close: "22:00" },
    { id: "court-7", name: "Creek Club Tennis Complex", city: "Karachi", surface: "Hard", surfaces: "Hard", price: 3000, photo: "https://picsum.photos/seed/khi-creek/600/400", distance: "4.2 km", totalCourts: 4, amenities: '["Floodlights","Gym","Swimming Pool"]', featured: 1, open: "06:00", close: "23:00" },
    { id: "court-8", name: "Sindh Sports Board Courts", city: "Karachi", surface: "Hard", surfaces: "Hard", price: 1500, photo: "https://picsum.photos/seed/khi-ssb/600/400", distance: "3.7 km", totalCourts: 2, amenities: '["Floodlights"]', featured: 0, open: "08:00", close: "20:00" },
    { id: "court-9", name: "DHA Tennis Club Karachi", city: "Karachi", surface: "Clay", surfaces: "Clay,Hard", price: 2500, photo: "https://picsum.photos/seed/khi-dha/600/400", distance: "7.0 km", totalCourts: 3, amenities: '["Floodlights","Coaching","Changing Rooms"]', featured: 0, open: "06:00", close: "21:00" },
    // Islamabad
    { id: "court-10", name: "Islamabad Tennis Complex", city: "Islamabad", surface: "Hard", surfaces: "Hard,Grass", price: 3000, photo: "https://picsum.photos/seed/isb-itc/600/400", distance: "1.8 km", totalCourts: 6, amenities: '["Floodlights","Pro Shop","Gym","Cafe"]', featured: 1, open: "06:00", close: "22:00" },
    { id: "court-11", name: "Islamabad Club Tennis Courts", city: "Islamabad", surface: "Clay", surfaces: "Clay,Hard", price: 2800, photo: "https://picsum.photos/seed/isb-club/600/400", distance: "3.2 km", totalCourts: 4, amenities: '["Floodlights","Coaching","Pro Shop"]', featured: 1, open: "06:00", close: "21:00" },
    { id: "court-12", name: "F-6 Markaz Sports Complex", city: "Islamabad", surface: "Hard", surfaces: "Hard", price: 1800, photo: "https://picsum.photos/seed/isb-f6/600/400", distance: "2.5 km", totalCourts: 2, amenities: '["Floodlights","Parking"]', featured: 0, open: "07:00", close: "20:00" },
    // Rawalpindi
    { id: "court-13", name: "Rawalpindi Club Tennis Courts", city: "Rawalpindi", surface: "Hard", surfaces: "Hard,Clay", price: 2000, photo: "https://picsum.photos/seed/rwp-club/600/400", distance: "2.0 km", totalCourts: 3, amenities: '["Floodlights","Coaching","Changing Rooms"]', featured: 1, open: "06:00", close: "21:00" },
    { id: "court-14", name: "Ayub Park Tennis Facility", city: "Rawalpindi", surface: "Hard", surfaces: "Hard", price: 1200, photo: "https://picsum.photos/seed/rwp-ayub/600/400", distance: "5.0 km", totalCourts: 2, amenities: '["Parking","Floodlights"]', featured: 0, open: "07:00", close: "19:00" },
    { id: "court-15", name: "Punjab Tennis Academy Rawalpindi", city: "Rawalpindi", surface: "Clay", surfaces: "Clay", price: 1600, photo: "https://picsum.photos/seed/rwp-pta/600/400", distance: "4.3 km", totalCourts: 2, amenities: '["Coaching","Floodlights"]', featured: 0, open: "06:00", close: "20:00" },
    // Faisalabad
    { id: "court-16", name: "Faisalabad Gymkhana Tennis Courts", city: "Faisalabad", surface: "Hard", surfaces: "Hard", price: 1500, photo: "https://picsum.photos/seed/fsd-gymkhana/600/400", distance: "1.5 km", totalCourts: 3, amenities: '["Floodlights","Coaching"]', featured: 1, open: "06:00", close: "21:00" },
    { id: "court-17", name: "Chenab Club Tennis Complex", city: "Faisalabad", surface: "Hard", surfaces: "Hard,Clay", price: 1800, photo: "https://picsum.photos/seed/fsd-chenab/600/400", distance: "3.8 km", totalCourts: 2, amenities: '["Floodlights","Changing Rooms","Parking"]', featured: 0, open: "07:00", close: "20:00" },
    { id: "court-18", name: "Lyallpur Tennis Academy", city: "Faisalabad", surface: "Clay", surfaces: "Clay", price: 1200, photo: "https://picsum.photos/seed/fsd-lyallpur/600/400", distance: "5.5 km", totalCourts: 2, amenities: '["Coaching"]', featured: 0, open: "07:00", close: "19:00" },
  ];

  for (const c of courts) {
    await db.execute({
      sql: `INSERT INTO courts (id, name, city, surface, surfaces, price_per_hour, photo, distance, total_courts, amenities, featured, open_time, close_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [c.id, c.name, c.city, c.surface, c.surfaces, c.price, c.photo, c.distance, c.totalCourts, c.amenities, c.featured, c.open, c.close, Date.now()],
    });
  }
  console.log(`Seeded ${courts.length} courts`);
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

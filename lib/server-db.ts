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

  // Seed players if empty
  const playerCount = await db.execute("SELECT COUNT(*) as cnt FROM user_profiles WHERE user_id LIKE 'seed-%'");
  const pCount = (playerCount.rows[0] as unknown as { cnt: number }).cnt;
  if (pCount === 0) {
    await seedPlayers(db);
  }

  tablesInitialized = true;
  console.log("Database tables initialized" + (process.env.TURSO_DATABASE_URL ? " on Turso" : " (in-memory)"));
}

async function seedCourts(db: Client) {
  const courts = [
    { id: "court-1", name: "Lahore Gymkhana Tennis Courts", city: "Lahore", surface: "Hard", surfaces: "Hard,Clay", price: 2500, photo: "https://picsum.photos/seed/court1/600/400", distance: "2.3 km", totalCourts: 4, amenities: '["Floodlights","Pro Shop","Changing Rooms"]', featured: 1 },
    { id: "court-2", name: "Punjab Club Tennis Complex", city: "Lahore", surface: "Clay", surfaces: "Clay", price: 2000, photo: "https://picsum.photos/seed/court2/600/400", distance: "5.1 km", totalCourts: 3, amenities: '["Floodlights","Coaching"]', featured: 0 },
    { id: "court-3", name: "Islamabad Tennis Complex", city: "Islamabad", surface: "Hard", surfaces: "Hard,Grass", price: 3000, photo: "https://picsum.photos/seed/court3/600/400", distance: "1.8 km", totalCourts: 6, amenities: '["Floodlights","Pro Shop","Gym","Cafe"]', featured: 1 },
    { id: "court-4", name: "Karachi Sindh Sports Board", city: "Karachi", surface: "Hard", surfaces: "Hard", price: 1500, photo: "https://picsum.photos/seed/court4/600/400", distance: "3.7 km", totalCourts: 2, amenities: '["Floodlights"]', featured: 0 },
    { id: "court-5", name: "Defence Raya Tennis Club", city: "Lahore", surface: "Grass", surfaces: "Grass,Hard", price: 3500, photo: "https://picsum.photos/seed/court5/600/400", distance: "8.2 km", totalCourts: 5, amenities: '["Floodlights","Pro Shop","Swimming Pool","Cafe"]', featured: 1 },
    { id: "court-6", name: "Peshawar Services Club", city: "Peshawar", surface: "Clay", surfaces: "Clay", price: 1200, photo: "https://picsum.photos/seed/court6/600/400", distance: "4.5 km", totalCourts: 2, amenities: '["Floodlights","Coaching"]', featured: 0 },
  ];

  for (const c of courts) {
    await db.execute({
      sql: `INSERT INTO courts (id, name, city, surface, surfaces, price_per_hour, photo, distance, total_courts, amenities, featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [c.id, c.name, c.city, c.surface, c.surfaces, c.price, c.photo, c.distance, c.totalCourts, c.amenities, c.featured, Date.now()],
    });
  }
  console.log(`Seeded ${courts.length} courts`);
}

async function seedPlayers(db: Client) {
  const players = [
    { id: "seed-1", name: "Ahmed Khan", age: 28, gender: "M", city: "Lahore", level: 4.0, playType: "Singles", bio: "Competitive player looking for tough matches" },
    { id: "seed-2", name: "Sara Ali", age: 24, gender: "F", city: "Islamabad", level: 3.5, playType: "Both", bio: "Love playing tennis on weekends" },
    { id: "seed-3", name: "Omar Farooq", age: 32, gender: "M", city: "Karachi", level: 4.5, playType: "Singles", bio: "Former national junior player" },
    { id: "seed-4", name: "Fatima Zahra", age: 22, gender: "F", city: "Lahore", level: 3.0, playType: "Doubles", bio: "New to tennis, eager to learn and play" },
    { id: "seed-5", name: "Bilal Hussain", age: 35, gender: "M", city: "Islamabad", level: 4.0, playType: "Both", bio: "Weekend warrior, always up for a game" },
    { id: "seed-6", name: "Ayesha Malik", age: 27, gender: "F", city: "Lahore", level: 3.5, playType: "Singles", bio: "Training for upcoming tournament" },
    { id: "seed-7", name: "Hassan Raza", age: 30, gender: "M", city: "Karachi", level: 5.0, playType: "Singles", bio: "Coach and competitive player" },
    { id: "seed-8", name: "Zainab Qureshi", age: 26, gender: "F", city: "Peshawar", level: 3.0, playType: "Doubles", bio: "Looking for doubles partners in Peshawar" },
  ];

  for (const p of players) {
    await db.execute({
      sql: `INSERT INTO user_profiles (id, user_id, name, age, gender, city, level, play_type, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.id, p.name, p.age, p.gender, p.city, p.level, p.playType, p.bio, Date.now(), Date.now()],
    });
  }
  console.log(`Seeded ${players.length} players`);
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

"server-only";

import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

function getClient(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Please create a Turso database and set the environment variable."
    );
  }

  client = createClient({
    url,
    authToken,
  });

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

  tablesInitialized = true;
  console.log("Database tables initialized on Turso");
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

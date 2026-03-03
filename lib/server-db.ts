"server-only";

import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";

let db: SqlJsDatabase | null = null;
let dbPath: string;

export async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();
  dbPath = path.join(process.cwd(), "tennis-connect.db");

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  initializeTables();
  return db;
}

function initializeTables() {
  if (!db) return;

  db.run(`
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
    )
  `);

  db.run(`
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
    )
  `);

  db.run(`
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
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      profile_type TEXT NOT NULL,
      matched_at INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      match_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      text TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      sent_at INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      swiped_at INTEGER
    )
  `);

  saveDb();
  console.log("Database initialized (empty - use admin panel to add data)");
}

export function saveDb() {
  if (!db || !dbPath) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export async function runQuery(sql: string, params: any[] = []) {
  const database = await getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    results.push(columns.reduce((obj: any, col: string, i: number) => {
      obj[col] = values[i];
      return obj;
    }, {}));
  }
  stmt.free();
  return results;
}

export async function runStatement(sql: string, params: any[] = []) {
  const database = await getDb();
  database.run(sql, params);
  saveDb();
}

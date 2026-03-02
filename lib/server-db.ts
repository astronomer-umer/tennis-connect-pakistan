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

  const courtsResult = db.exec("SELECT COUNT(*) as count FROM courts");
  const courtsCount = courtsResult.length > 0 ? courtsResult[0].values[0][0] : 0;
  
  if (courtsCount === 0) {
    const courts = [
      { id: "c1", name: "Bagh-e-Jinnah PLTA", city: "Lahore", surface: "Grass", surfaces: "Grass,Hard", pricePerHour: 800, distance: "3.2 km", totalCourts: 6, amenities: "Changing Rooms,Cafe,Parking,Floodlights", isOpen: 1, openTime: "06:00", closeTime: "21:00", featured: 1 },
      { id: "c2", name: "DHA Phase 8 Sports Complex", city: "Lahore", surface: "Hard", surfaces: "Hard", pricePerHour: 1200, distance: "8.5 km", totalCourts: 4, amenities: "AC Lobby,Pro Shop,Coaching,Parking", isOpen: 1, openTime: "06:00", closeTime: "23:00", featured: 1 },
      { id: "c3", name: "DHA XX Block Courts", city: "Lahore", surface: "Hard", surfaces: "Hard", pricePerHour: 1000, distance: "11.2 km", totalCourts: 3, amenities: "Parking,Floodlights,Water Cooler", isOpen: 1, openTime: "05:30", closeTime: "22:00", featured: 0 },
      { id: "c4", name: "Nishtar Park Tennis Club", city: "Lahore", surface: "Hard", surfaces: "Hard", pricePerHour: 900, distance: "5.7 km", totalCourts: 2, amenities: "Changing Rooms,Parking", isOpen: 1, openTime: "06:00", closeTime: "20:00", featured: 0 },
      { id: "c5", name: "Punjab Tennis Academy", city: "Lahore", surface: "Hard", surfaces: "Hard", pricePerHour: 700, distance: "4.1 km", totalCourts: 5, amenities: "Coaching,Ball Machine,Parking", isOpen: 1, openTime: "07:00", closeTime: "21:00", featured: 0 },
      { id: "c6", name: "PTF National Training Centre", city: "Islamabad", surface: "Hard", surfaces: "Hard", pricePerHour: 1500, distance: "6.8 km", totalCourts: 10, amenities: "World-Class Facility,Gym,Physiotherapy,Cafe,Coaching", isOpen: 1, openTime: "06:00", closeTime: "22:00", featured: 1 },
      { id: "c7", name: "CDA Tennis Club", city: "Islamabad", surface: "Hard", surfaces: "Hard", pricePerHour: 1100, distance: "9.3 km", totalCourts: 4, amenities: "Changing Rooms,Parking,Floodlights", isOpen: 1, openTime: "06:00", closeTime: "22:30", featured: 0 },
      { id: "c8", name: "Gulberg Greens Club", city: "Islamabad", surface: "Hard", surfaces: "Hard", pricePerHour: 1300, distance: "14.2 km", totalCourts: 3, amenities: "Premium Facilities,Pool,Restaurant,Valet Parking", isOpen: 1, openTime: "07:00", closeTime: "23:00", featured: 0 },
      { id: "c9", name: "F-9 Park Tennis", city: "Islamabad", surface: "Hard", surfaces: "Hard", pricePerHour: 600, distance: "4.5 km", totalCourts: 2, amenities: "Free Parking,Open Air", isOpen: 1, openTime: "06:00", closeTime: "19:00", featured: 0 },
      { id: "c10", name: "Naya Nazimabad Gymkhana", city: "Karachi", surface: "Hard", surfaces: "Hard", pricePerHour: 1400, distance: "7.6 km", totalCourts: 4, amenities: "Members Club,Cafe,Changing Rooms,Coaching", isOpen: 1, openTime: "06:00", closeTime: "22:00", featured: 1 },
      { id: "c11", name: "DHA Karachi Sports Complex", city: "Karachi", surface: "Hard", surfaces: "Hard", pricePerHour: 1600, distance: "12.4 km", totalCourts: 6, amenities: "Premium Courts,AC Lounges,Pro Shop,Valet", isOpen: 1, openTime: "06:00", closeTime: "23:00", featured: 0 },
      { id: "c12", name: "Defence Club Grass Courts", city: "Karachi", surface: "Grass", surfaces: "Grass", pricePerHour: 1800, distance: "15.1 km", totalCourts: 3, amenities: "Heritage Grass Courts,Clubhouse,Fine Dining,Valet", isOpen: 1, openTime: "07:00", closeTime: "21:00", featured: 1 },
    ];

    const stmt = db.prepare(`
      INSERT INTO courts (id, name, city, surface, surfaces, price_per_hour, distance, total_courts, amenities, is_open, open_time, close_time, featured, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const court of courts) {
      stmt.run([
        court.id, court.name, court.city, court.surface, court.surfaces,
        court.pricePerHour, court.distance, court.totalCourts, court.amenities,
        court.isOpen, court.openTime, court.closeTime, court.featured, Date.now()
      ]);
    }
    stmt.free();
  }

  saveDb();
  console.log("Database initialized");
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

import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";
import type { Court } from "@/data";

interface CourtRow {
  id: string;
  name: string;
  area: string;
  city: string;
  sport_type: string;
  surface: string;
  surfaces: string;
  price_per_hour: number;
  photo: string;
  distance: string;
  total_courts: number;
  amenities: string;
  court_type: string;
  is_open: number;
  open_time: string;
  close_time: string;
  featured: number;
  phone: string;
  whatsapp: string;
  location_url: string;
}

function parseCourt(row: CourtRow): Court {
  let amenitiesArray: string[] = [];
  try {
    const parsed = JSON.parse(row.amenities || "[]");
    amenitiesArray = Array.isArray(parsed) ? parsed : [];
  } catch {
    amenitiesArray = [];
  }

  const surfaces = row.surfaces
    ? row.surfaces.split(",").map((s) => s.trim())
    : [row.surface];

  return {
    id: row.id,
    kind: "court",
    name: row.name,
    area: row.area || "",
    city: row.city as Court["city"],
    sportType: (row.sport_type as Court["sportType"]) || "tennis",
    surface: row.surface as Court["surface"],
    surfaces: surfaces as Court["surfaces"],
    pricePerHour: row.price_per_hour,
    photo: row.photo || `https://picsum.photos/seed/${row.id}/600/400`,
    distance: row.distance || "0 km",
    totalCourts: row.total_courts,
    amenities: amenitiesArray,
    courtType: (row.court_type as Court["courtType"]) || "public",
    isOpen: row.is_open === 1,
    openTime: row.open_time || "06:00",
    closeTime: row.close_time || "22:00",
    featured: row.featured === 1,
    phone: row.phone || "",
    whatsapp: row.whatsapp || "",
    locationUrl: row.location_url || "",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const sportType = searchParams.get("sportType");
  const surface = searchParams.get("surface");
  const featured = searchParams.get("featured") === "true";

  let sql = "SELECT * FROM courts WHERE 1=1";
  const params: (string | number)[] = [];

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  if (sportType && sportType !== "All") {
    sql += " AND sport_type = ?";
    params.push(sportType);
  }

  if (surface && surface !== "All") {
    sql += " AND (surface = ? OR surfaces LIKE ?)";
    params.push(surface, `%${surface}%`);
  }

  if (featured) {
    sql += " AND featured = 1";
  }

  sql += " ORDER BY featured DESC, name ASC";

  const courts = await runQuery<CourtRow>(sql, params);
  const result = courts.map(parseCourt);

  return NextResponse.json(result);
}
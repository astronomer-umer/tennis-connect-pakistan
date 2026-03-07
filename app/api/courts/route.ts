import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";

interface CourtRow {
  id: string;
  name: string;
  city: string;
  surface: string;
  surfaces: string;
  price_per_hour: number;
  photo: string;
  distance: string;
  total_courts: number;
  amenities: string;
  is_open: number;
  open_time: string;
  close_time: string;
  featured: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const featured = searchParams.get("featured");

  let sql = "SELECT * FROM courts WHERE 1=1";
  const params: string[] = [];

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  if (featured === "true") {
    sql += " AND featured = 1";
  }

  sql += " ORDER BY featured DESC, name ASC";

  const courts = await runQuery<CourtRow>(sql, params);

  const result = courts.map((c) => {
    let amenitiesArray: string[] = [];
    try {
      const parsed = JSON.parse(c.amenities || "[]");
      amenitiesArray = Array.isArray(parsed) ? parsed : [];
    } catch {
      amenitiesArray = [];
    }
    
    return {
      id: c.id,
      kind: "court",
      name: c.name,
      city: c.city,
      surface: c.surface,
      surfaces: c.surfaces ? c.surfaces.split(",") : [c.surface],
      pricePerHour: c.price_per_hour,
      photo: c.photo || `https://picsum.photos/seed/${c.id}/600/400`,
      distance: c.distance || "0 km",
      totalCourts: c.total_courts,
      amenities: amenitiesArray,
      isOpen: c.is_open === 1,
      openTime: c.open_time,
      closeTime: c.close_time,
      featured: c.featured === 1,
    };
  });

  return NextResponse.json(result);
}

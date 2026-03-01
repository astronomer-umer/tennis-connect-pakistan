import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const featured = searchParams.get("featured");

  let sql = "SELECT * FROM courts WHERE 1=1";
  const params: any[] = [];

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  if (featured === "true") {
    sql += " AND featured = 1";
  }

  sql += " ORDER BY featured DESC, name ASC";

  const courts = await runQuery(sql, params);

  const result = courts.map((c: any) => ({
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
    amenities: c.amenities ? c.amenities.split(",") : [],
    isOpen: c.is_open === 1,
    openTime: c.open_time,
    closeTime: c.close_time,
    featured: c.featured === 1,
  }));

  return NextResponse.json(result);
}

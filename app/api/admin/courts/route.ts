import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { adminGuard } from "@/lib/admin-auth";

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const courts = await runQuery("SELECT * FROM courts ORDER BY featured DESC, city ASC, name ASC");
  return NextResponse.json(courts);
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const body = await request.json();
  const { name, area, city, sportType, surface, surfaces, pricePerHour, photo, distance, totalCourts, amenities, courtType, isOpen, openTime, closeTime, featured, phone, whatsapp, locationUrl } = body;
  
  const id = `${city?.toLowerCase() || "court"}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await runStatement(
    `INSERT INTO courts (id, name, area, city, sport_type, surface, surfaces, price_per_hour, photo, distance, total_courts, amenities, court_type, is_open, open_time, close_time, featured, phone, whatsapp, location_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, area || "", city, sportType || "tennis", surface, surfaces || surface, pricePerHour, photo || "", distance || "0 km", totalCourts || 1, amenities || "[]", courtType || "public", isOpen ? 1 : 0, openTime || "06:00", closeTime || "22:00", featured ? 1 : 0, phone || "", whatsapp || "", locationUrl || "", Date.now()]
  );

  return NextResponse.json({ success: true, id });
}

export async function PUT(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const body = await request.json();
  const { id, name, area, city, sportType, surface, surfaces, pricePerHour, photo, distance, totalCourts, amenities, courtType, isOpen, openTime, closeTime, featured, phone, whatsapp, locationUrl } = body;
  
  await runStatement(
    `UPDATE courts SET name = ?, area = ?, city = ?, sport_type = ?, surface = ?, surfaces = ?, price_per_hour = ?, photo = ?, distance = ?, total_courts = ?, amenities = ?, court_type = ?, is_open = ?, open_time = ?, close_time = ?, featured = ?, phone = ?, whatsapp = ?, location_url = ? WHERE id = ?`,
    [name, area || "", city, sportType || "tennis", surface, surfaces || surface, pricePerHour, photo || "", distance || "0 km", totalCourts || 1, amenities || "[]", courtType || "public", isOpen ? 1 : 0, openTime || "06:00", closeTime || "22:00", featured ? 1 : 0, phone || "", whatsapp || "", locationUrl || "", id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  
  await runStatement("DELETE FROM courts WHERE id = ?", [id]);
  
  return NextResponse.json({ success: true });
}
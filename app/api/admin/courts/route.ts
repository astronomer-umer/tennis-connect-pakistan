import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";

export async function GET() {
  const courts = await runQuery("SELECT * FROM courts ORDER BY featured DESC, name ASC");
  return NextResponse.json(courts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, city, surface, surfaces, pricePerHour, distance, totalCourts, amenities, isOpen, openTime, closeTime, featured } = body;
  
  const id = `court-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await runStatement(
    `INSERT INTO courts (id, name, city, surface, surfaces, price_per_hour, distance, total_courts, amenities, is_open, open_time, close_time, featured, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, city, surface, surfaces || surface, pricePerHour, distance || "0 km", totalCourts || 1, amenities || "", isOpen ? 1 : 0, openTime || "06:00", closeTime || "22:00", featured ? 1 : 0, Date.now()]
  );

  return NextResponse.json({ success: true, id });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, city, surface, surfaces, pricePerHour, distance, totalCourts, amenities, isOpen, openTime, closeTime, featured } = body;
  
  await runStatement(
    `UPDATE courts SET name = ?, city = ?, surface = ?, surfaces = ?, price_per_hour = ?, distance = ?, total_courts = ?, amenities = ?, is_open = ?, open_time = ?, close_time = ?, featured = ? WHERE id = ?`,
    [name, city, surface, surfaces || surface, pricePerHour, distance || "0 km", totalCourts || 1, amenities || "", isOpen ? 1 : 0, openTime || "06:00", closeTime || "22:00", featured ? 1 : 0, id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  
  await runStatement("DELETE FROM courts WHERE id = ?", [id]);
  
  return NextResponse.json({ success: true });
}

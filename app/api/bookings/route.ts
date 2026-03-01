import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  let sql = "SELECT * FROM bookings WHERE user_id = ?";
  const params: any[] = [session.user.id];

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  sql += " ORDER BY booked_at DESC";

  const bookings = await runQuery(sql, params);

  const result = bookings.map((b: any) => ({
    id: b.id,
    courtId: b.court_id,
    courtName: b.court_name,
    city: b.city,
    surface: b.surface,
    date: b.date,
    time: b.time,
    durationHours: b.duration_hours,
    payment: b.payment,
    totalCost: b.total_cost,
    status: b.status,
    bookedAt: b.booked_at * 1000,
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { courtId, courtName, city, surface, date, time, durationHours, payment, totalCost } = body;

  const id = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await runStatement(
    `INSERT INTO bookings (id, user_id, court_id, court_name, city, surface, date, time, duration_hours, payment, total_cost, status, booked_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, session.user.id, courtId, courtName, city, surface, date, time, durationHours, payment, totalCost, "confirmed", Math.floor(Date.now() / 1000)]
  );

  return NextResponse.json({
    id,
    courtId,
    courtName,
    city,
    surface,
    date,
    time,
    durationHours,
    payment,
    totalCost,
    status: "confirmed",
    bookedAt: Date.now(),
  });
}

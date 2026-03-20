import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { auth } from "@/lib/auth";

interface BookingRow {
  id: string;
  court_id: string;
  court_name: string;
  city: string;
  surface: string;
  date: string;
  time: string;
  duration_hours: number;
  payment: string;
  total_cost: number;
  status: string;
  booked_at: number;
}

async function checkBookingConflict(
  courtId: string,
  date: string,
  time: string,
  durationHours: number,
  excludeBookingId?: string
): Promise<boolean> {
  const startTime = parseInt(time.split(":")[0]);
  const endTime = startTime + durationHours;

  const existingBookings = await runQuery<BookingRow>(
    "SELECT * FROM bookings WHERE court_id = ? AND date = ? AND status != 'cancelled'",
    [courtId, date]
  );

  for (const booking of existingBookings) {
    if (excludeBookingId && booking.id === excludeBookingId) continue;

    const bookingStart = parseInt(booking.time.split(":")[0]);
    const bookingEnd = bookingStart + booking.duration_hours;

    const overlaps = startTime < bookingEnd && endTime > bookingStart;
    if (overlaps) {
      return true;
    }
  }

  return false;
}

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
  const params: string[] = [session.user.id];

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  sql += " ORDER BY booked_at DESC";

  const bookings = await runQuery<BookingRow>(sql, params);

  const result = bookings.map((b) => ({
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

  const hasConflict = await checkBookingConflict(courtId, date, time, durationHours);
  if (hasConflict) {
    return NextResponse.json(
      { error: "This time slot is already booked. Please choose a different time." },
      { status: 409 }
    );
  }

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

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
  }

  const existing = await runQuery<{ user_id: string }>(
    "SELECT user_id FROM bookings WHERE id = ?",
    [id]
  );

  if (existing.length === 0) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (existing[0].user_id !== session.user.id) {
    return NextResponse.json({ error: "Not authorized to cancel this booking" }, { status: 403 });
  }

  await runStatement(
    "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
    [id]
  );

  return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
}

import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";

export async function GET() {
  const bookings = await runQuery("SELECT * FROM bookings ORDER BY booked_at DESC");
  return NextResponse.json(bookings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status } = body;
  
  await runStatement(
    `UPDATE bookings SET status = ? WHERE id = ?`,
    [status, id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  
  await runStatement("DELETE FROM bookings WHERE id = ?", [id]);
  
  return NextResponse.json({ success: true });
}

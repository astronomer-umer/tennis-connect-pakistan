import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { adminGuard } from "@/lib/admin-auth";

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const bookings = await runQuery("SELECT * FROM bookings ORDER BY booked_at DESC");
  return NextResponse.json(bookings);
}

export async function PUT(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const body = await request.json();
  const { id, status } = body;
  
  await runStatement(
    `UPDATE bookings SET status = ? WHERE id = ?`,
    [status, id]
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
  
  await runStatement("DELETE FROM bookings WHERE id = ?", [id]);
  
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { adminGuard } from "@/lib/admin-auth";

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const players = await runQuery("SELECT * FROM user_profiles ORDER BY created_at DESC");
  return NextResponse.json(players);
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const body = await request.json();
  const { name, city, level, playType, bio, age, gender, wins, losses } = body;
  
  const id = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const userId = `manual-${id}`;
  
  await runStatement(
    `INSERT INTO user_profiles (id, user_id, name, city, level, play_type, bio, age, gender, wins, losses, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, name, city || "Lahore", level || 3.5, playType || "Both", bio || "", age || 25, gender || "M", wins || 0, losses || 0, Date.now(), Date.now()]
  );

  return NextResponse.json({ success: true, id });
}

export async function PUT(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const body = await request.json();
  const { id, name, city, level, playType, bio, age, gender, wins, losses } = body;
  
  await runStatement(
    `UPDATE user_profiles SET name = ?, city = ?, level = ?, play_type = ?, bio = ?, age = ?, gender = ?, wins = ?, losses = ?, updated_at = ? WHERE id = ?`,
    [name, city, level, playType, bio, age, gender, wins, losses, Date.now(), id]
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
  
  await runStatement("DELETE FROM user_profiles WHERE id = ?", [id]);
  
  return NextResponse.json({ success: true });
}

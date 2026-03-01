import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  let sql = "SELECT * FROM user_profiles WHERE 1=1";
  const params: any[] = [];

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  sql += " ORDER BY created_at DESC";

  const players = await runQuery(sql, params);

  const result = players.map((p: any) => ({
    id: p.user_id,
    kind: "player",
    name: p.name,
    age: p.age || 25,
    gender: p.gender || "M",
    city: p.city || "Lahore",
    level: p.level || 3.5,
    photo: p.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`,
    status: p.bio || "Looking to play tennis!",
    playType: p.play_type || "Both",
    wins: p.wins || 0,
    losses: p.losses || 0,
  }));

  return NextResponse.json(result);
}

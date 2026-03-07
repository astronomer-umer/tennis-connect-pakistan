import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";
import { auth } from "@/lib/auth";

interface ProfileRow {
  user_id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  level: number;
  photo_url: string;
  bio: string;
  play_type: string;
  wins: number;
  losses: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const session = await auth.api.getSession({ headers: request.headers });
  const currentUserId = session?.session?.userId;

  let sql = "SELECT * FROM user_profiles WHERE 1=1";
  const params: string[] = [];

  if (currentUserId) {
    sql += " AND user_id != ?";
    params.push(currentUserId);
  }

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  sql += " ORDER BY created_at DESC";

  const players = await runQuery<ProfileRow>(sql, params);

  const result = players.map((p) => ({
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

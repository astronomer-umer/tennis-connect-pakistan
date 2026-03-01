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
  const level = searchParams.get("level");
  const playType = searchParams.get("playType");

  let sql = "SELECT * FROM user_profiles WHERE user_id != ?";
  const params: any[] = [session.user.id];

  if (city && city !== "All") {
    sql += " AND city = ?";
    params.push(city);
  }

  if (level) {
    sql += " AND level = ?";
    params.push(level);
  }

  if (playType && playType !== "Both") {
    sql += " AND play_type = ?";
    params.push(playType);
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

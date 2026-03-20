import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";
import { adminGuard } from "@/lib/admin-auth";

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;

  const profiles = await runQuery<{
    id: string;
    user_id: string;
    name: string;
    city: string;
    level: number;
    age: number;
    gender: string;
    created_at: number;
  }>(`
    SELECT up.id, up.user_id, up.name, up.city, up.level, up.age, up.gender, up.created_at
    FROM user_profiles up
    ORDER BY up.created_at DESC
  `);

  const usersWithCounts = await Promise.all(
    profiles.map(async (profile) => {
      const bookings = await runQuery(
        "SELECT COUNT(*) as cnt FROM bookings WHERE user_id = ?",
        [profile.user_id]
      );
      const matches = await runQuery(
        "SELECT COUNT(*) as cnt FROM matches WHERE user_id = ?",
        [profile.user_id]
      );
      return {
        id: profile.id,
        userId: profile.user_id,
        name: profile.name,
        email: `${profile.user_id.slice(0, 8)}...@tcp.local`,
        city: profile.city,
        level: profile.level,
        age: profile.age,
        gender: profile.gender,
        bookingCount: (bookings[0] as { cnt: number })?.cnt || 0,
        matchCount: (matches[0] as { cnt: number })?.cnt || 0,
        createdAt: profile.created_at * 1000,
      };
    })
  );

  return NextResponse.json(usersWithCounts);
}

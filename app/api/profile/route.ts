import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { auth } from "@/lib/auth";

interface ProfileRow {
  name: string;
  city: string;
  level: number;
  play_type: string;
  bio: string;
  age: number;
  gender: string;
  wins: number;
  losses: number;
  golden_sets: number;
  preferred_cities: string;
  photo_url: string | null;
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

  const profiles = await runQuery<ProfileRow>("SELECT * FROM user_profiles WHERE user_id = ?", [session.user.id]);
  const profile = profiles.length > 0 ? profiles[0] : null;

  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 404 });
  }

  return NextResponse.json({
    name: profile.name,
    email: session.user.email,
    city: profile.city,
    level: profile.level,
    playType: profile.play_type,
    bio: profile.bio,
    age: profile.age,
    gender: profile.gender,
    wins: profile.wins,
    losses: profile.losses,
    goldenSets: profile.golden_sets,
    preferredCities: profile.preferred_cities ? JSON.parse(profile.preferred_cities) : [],
    photoUrl: profile.photo_url || null,
  });
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
  const { name, city, level, playType, bio, age, gender, preferredCities, photoUrl } = body;

  const existing = await runQuery("SELECT id FROM user_profiles WHERE user_id = ?", [session.user.id]);

  if (existing.length > 0) {
    await runStatement(
      `UPDATE user_profiles SET name = ?, city = ?, level = ?, play_type = ?, bio = ?, age = ?, gender = ?, preferred_cities = ?, photo_url = ?, updated_at = ? WHERE user_id = ?`,
      [name, city, level, playType, bio, age, gender, JSON.stringify(preferredCities || []), photoUrl || null, Math.floor(Date.now() / 1000), session.user.id]
    );
  } else {
    const id = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await runStatement(
      `INSERT INTO user_profiles (id, user_id, name, city, level, play_type, bio, age, gender, preferred_cities, photo_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, session.user.id, name, city, level, playType, bio, age, gender, JSON.stringify(preferredCities || []), photoUrl || null, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)]
    );
  }

  return NextResponse.json({ success: true });
}

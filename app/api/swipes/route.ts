import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { auth } from "@/lib/auth";

interface SwipeRow {
  id: string;
  user_id: string;
  profile_id: string;
  direction: string;
  swiped_at: number;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const swipes = await runQuery<SwipeRow>(
    "SELECT * FROM swipes WHERE user_id = ? ORDER BY swiped_at DESC",
    [session.user.id]
  );

  const swipedRight = swipes.filter((s) => s.direction === "right").map((s) => s.profile_id);
  const swipedLeft = swipes.filter((s) => s.direction === "left").map((s) => s.profile_id);

  return NextResponse.json({ swipedRight, swipedLeft });
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
  const { profileId, direction } = body;

  if (!profileId || !direction) {
    return NextResponse.json({ error: "profileId and direction required" }, { status: 400 });
  }

  const existing = await runQuery<SwipeRow>(
    "SELECT id FROM swipes WHERE user_id = ? AND profile_id = ?",
    [session.user.id, profileId]
  );

  if (existing.length > 0) {
    await runStatement(
      "UPDATE swipes SET direction = ?, swiped_at = ? WHERE user_id = ? AND profile_id = ?",
      [direction, Math.floor(Date.now() / 1000), session.user.id, profileId]
    );
  } else {
    const id = `swipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await runStatement(
      "INSERT INTO swipes (id, user_id, profile_id, direction, swiped_at) VALUES (?, ?, ?, ?, ?)",
      [id, session.user.id, profileId, direction, Math.floor(Date.now() / 1000)]
    );
  }

  return NextResponse.json({ success: true });
}

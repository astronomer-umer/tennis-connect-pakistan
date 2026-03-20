import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { auth } from "@/lib/auth";

interface MatchRow {
  id: string;
  user_id: string;
  profile_id: string;
  profile_type: string;
  matched_at: number;
}

interface MessageRow {
  id: string;
  match_id: string;
  sender_id: string;
  text: string;
  is_read: number;
  sent_at: number;
}

export async function GET() {
  const session = await auth.api.getSession({
    headers: {
      cookie: headers().get("cookie") || "",
    },
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const matches = await runQuery<MatchRow>(
    "SELECT * FROM matches WHERE user_id = ? ORDER BY matched_at DESC",
    [session.user.id]
  );

  const matchIds = matches.map((m) => m.id);
  const messages = matchIds.length > 0
    ? await runQuery<MessageRow>(
        `SELECT * FROM messages WHERE match_id IN (${matchIds.map(() => "?").join(",")}) ORDER BY sent_at ASC`,
        matchIds
      )
    : [];

  const result = matches.map((m) => ({
    id: m.id,
    profileId: m.profile_id,
    profileType: m.profile_type,
    matchedAt: m.matched_at * 1000,
    messages: messages
      .filter((msg) => msg.match_id === m.id)
      .map((msg) => ({
        id: msg.id,
        text: msg.text,
        isMe: msg.sender_id === session.user.id,
        sentAt: msg.sent_at * 1000,
      })),
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
  const { profileId, profileType } = body;

  const existing = await runQuery<MatchRow>(
    "SELECT id FROM matches WHERE user_id = ? AND profile_id = ?",
    [session.user.id, profileId]
  );

  if (existing.length > 0) {
    return NextResponse.json({ id: existing[0].id, alreadyExists: true });
  }

  const id = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  await runStatement(
    "INSERT INTO matches (id, user_id, profile_id, profile_type, matched_at) VALUES (?, ?, ?, ?, ?)",
    [id, session.user.id, profileId, profileType, Math.floor(Date.now() / 1000)]
  );

  return NextResponse.json({ id });
}

function headers() {
  return new Headers();
}

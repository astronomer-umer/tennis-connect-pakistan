import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { auth } from "@/lib/auth";

interface MessageRow {
  id: string;
  match_id: string;
  sender_id: string;
  text: string;
  is_read: number;
  sent_at: number;
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

  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  const messages = await runQuery<MessageRow>(
    "SELECT * FROM messages WHERE match_id = ? ORDER BY sent_at ASC",
    [matchId]
  );

  return NextResponse.json(
    messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      isMe: msg.sender_id === session.user.id,
      sentAt: msg.sent_at * 1000,
    }))
  );
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
  const { matchId, text } = body;

  if (!matchId || !text) {
    return NextResponse.json({ error: "matchId and text required" }, { status: 400 });
  }

  const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const sentAt = Math.floor(Date.now() / 1000);

  await runStatement(
    "INSERT INTO messages (id, match_id, sender_id, text, is_read, sent_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, matchId, session.user.id, text, 0, sentAt]
  );

  return NextResponse.json({
    id,
    text,
    isMe: true,
    sentAt: sentAt * 1000,
  });
}

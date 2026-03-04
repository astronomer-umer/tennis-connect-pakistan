import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";

export async function GET() {
  const users = await runQuery("SELECT * FROM users ORDER BY created_at DESC");
  return NextResponse.json(users);
}

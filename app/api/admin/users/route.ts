import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { auth } from "@/lib/auth";

export async function GET() {
  const users = await runQuery("SELECT * FROM users ORDER BY created_at DESC");
  return NextResponse.json(users);
}

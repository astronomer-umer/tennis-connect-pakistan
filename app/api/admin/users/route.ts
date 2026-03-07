import { NextResponse } from "next/server";
import { runQuery } from "@/lib/server-db";
import { adminGuard } from "@/lib/admin-auth";

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;
  
  const users = await runQuery("SELECT * FROM users ORDER BY created_at DESC");
  return NextResponse.json(users);
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminToken, ADMIN_TOKEN_COOKIE } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!password || !adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createAdminToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function requireAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin-auth");
  
  if (!adminCookie || !adminCookie.value) {
    return false;
  }
  
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminCookie.value !== adminPassword) {
    return false;
  }
  
  return true;
}

export async function adminGuard() {
  const isAuthorized = await requireAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

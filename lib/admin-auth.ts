import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

const ADMIN_TOKEN_COOKIE = "tcp-admin-token";
const TOKEN_EXPIRY = 60 * 60 * 24;

function createAdminToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const data = `${timestamp}.${random}`;
  const signature = createHmac("sha256", process.env.ADMIN_PASSWORD || "default-secret")
    .update(data)
    .digest("hex");
  return Buffer.from(`${data}.${signature}`).toString("base64url");
}

function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [timestamp, random, signature] = decoded.split(".");
    const expectedSignature = createHmac("sha256", process.env.ADMIN_PASSWORD || "default-secret")
      .update(`${timestamp}.${random}`)
      .digest("hex");
    
    if (signature !== expectedSignature) {
      return false;
    }
    
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > TOKEN_EXPIRY * 1000) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export { createAdminToken, verifyAdminToken, ADMIN_TOKEN_COOKIE };

export async function requireAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_TOKEN_COOKIE);
  
  if (!adminCookie || !adminCookie.value) {
    return false;
  }
  
  return verifyAdminToken(adminCookie.value);
}

export async function adminGuard() {
  const isAuthorized = await requireAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

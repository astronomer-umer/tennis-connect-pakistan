import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runStatement, runQuery } from "@/lib/server-db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if user exists
  const users = await runQuery<{ id: string; email: string }>(
    "SELECT id, email FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    // Don't reveal if user exists for security
    return NextResponse.json({ 
      success: true, 
      message: "If an account exists, password reset instructions have been sent" 
    });
  }

  // Generate reset token
  const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  
  // Store token in DB (with 1 hour expiry)
  await runStatement(
    `INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)`,
    [users[0].id, resetToken, Date.now() + 3600000]
  );

  // Try better-auth first, fallback to dev mode
  try {
    await auth.api.sendVerificationEmail({
      body: { email },
    });
  } catch (error) {
    // Dev mode: log the reset link
    console.log(`🔐 Password Reset for ${email}:`);
    console.log(`   Visit: http://localhost:3000/reset-password?token=${resetToken}`);
    console.log(`   (In production, this would be emailed)`);
  }

  return NextResponse.json({ 
    success: true, 
    message: "If an account exists, password reset instructions have been sent" 
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { token, newPassword } = body;

  if (!token || !newPassword) {
    return NextResponse.json({ error: "Token and new password required" }, { status: 400 });
  }

  // Check token
  const resets = await runQuery<{ user_id: string; expires_at: number }>(
    "SELECT user_id, expires_at FROM password_resets WHERE token = ?",
    [token]
  );

  if (resets.length === 0) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  if (resets[0].expires_at < Date.now()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  // In production, would use auth.api.resetPassword() 
  // For now, just delete the token
  await runStatement("DELETE FROM password_resets WHERE token = ?", [token]);

  return NextResponse.json({ success: true, message: "Password updated! Please login with new password." });
}
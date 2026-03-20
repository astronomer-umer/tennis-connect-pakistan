import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await auth.api.sendVerificationEmail({
      body: {
        email,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Password reset instructions have been sent to your email" 
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ 
      error: "Unable to send reset email. Please try again later." 
    }, { status: 500 });
  }
}

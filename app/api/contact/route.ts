import { NextResponse } from "next/server";
import { runStatement } from "@/lib/server-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, city, professionalStatus, ageGroup, message } = body;

    if (!name || !city || !professionalStatus || !ageGroup) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await runStatement(
      `INSERT INTO contacts (id, name, phone, city, professional_status, age_group, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, phone || "", city, professionalStatus, ageGroup, message || "", Date.now()]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}

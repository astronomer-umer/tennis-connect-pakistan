import { NextResponse } from "next/server";
import { runQuery, runStatement } from "@/lib/server-db";
import { adminGuard } from "@/lib/admin-auth";

interface ContactRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  professional_status: string;
  age_group: string;
  message: string;
  created_at: number;
}

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;

  const contacts = await runQuery<ContactRow>("SELECT * FROM contacts ORDER BY created_at DESC");
  return NextResponse.json(contacts);
}

export async function DELETE(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await runStatement("DELETE FROM contacts WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}

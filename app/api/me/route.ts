import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = cookies(); // ✅ FIX
  const userId = (await cookieStore).get("user_id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const [rows] = await db.execute<any[]>(
    "SELECT id, email, name FROM user WHERE id = ?",
    [userId]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const user = rows[0];

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}

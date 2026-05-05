import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();

  // Hapus semua cookie sesi termasuk token JWT
  cookieStore.set("token", "", { path: "/", maxAge: 0 });
  cookieStore.set("user_id", "", { path: "/", maxAge: 0 });
  cookieStore.set("role", "", { path: "/", maxAge: 0 });

  return NextResponse.json({ success: true });
}
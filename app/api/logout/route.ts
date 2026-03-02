import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  
  // Hapus semua cookie dengan cara set maxAge ke 0
  cookieStore.set("user_id", "", { path: "/", maxAge: 0 });
  cookieStore.set("role", "", { path: "/", maxAge: 0 });

  return NextResponse.json({ success: true });
}
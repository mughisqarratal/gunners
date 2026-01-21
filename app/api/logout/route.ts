// app/api/logout/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // pastikan runtime nodejs

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Hapus cookie
  response.cookies.set("user_id", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

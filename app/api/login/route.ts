import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const [rows] = await db.execute<any[]>(
      "SELECT id, password, role FROM User WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 401 });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const cookieConfig = {
      httpOnly: true,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production", // Otomatis true di hosting
      maxAge: 60 * 60 * 24, // Cookie tahan 24 jam
    };

    // Set cookies
    cookieStore.set("user_id", String(user.id), cookieConfig);
    cookieStore.set("role", user.role, cookieConfig);

    return NextResponse.json({
      success: true,
      role: user.role,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
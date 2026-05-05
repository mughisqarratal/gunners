import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export const runtime = "nodejs";

// Ambil JWT secret dari env, fallback ke default (ganti di .env!)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const [rows] = await db.execute<any[]>(
      "SELECT id, password, role FROM User WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Generate JWT Token menggunakan `jose`
    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Token berlaku 24 jam
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    const cookieConfig = {
      httpOnly: true,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 jam
    };

    // Set cookies: token JWT + data pendukung
    cookieStore.set("token", token, cookieConfig);       
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
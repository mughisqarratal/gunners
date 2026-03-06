import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const { email, password } = await req.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return NextResponse.json({ message: "Sesi habis" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });

    // VALIDASI 1: Password Konfirmasi Salah
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Konfirmasi password salah!" }, { status: 403 });
    }

    // VALIDASI 2: Email Sudah Terdaftar
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExists && emailExists.id !== user.id) {
      return NextResponse.json({ message: "Email sudah digunakan oleh akun lain!" }, { status: 409 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email },
    });

    // Logout paksa agar user login dengan email baru
    cookieStore.delete("user_id");
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
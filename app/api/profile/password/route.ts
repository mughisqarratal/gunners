import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return NextResponse.json({ message: "Sesi habis" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });

    // VALIDASI 3: Password Lama Salah
    const isOldPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isOldPasswordCorrect) {
      return NextResponse.json({ message: "Password lama yang Anda masukkan salah!" }, { status: 403 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
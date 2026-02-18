import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, password } = await req.json();

    // 1. Validasi Input
    if (!email || !otp || !password) {
      return NextResponse.json(
        { message: "Data tidak lengkap. Email, OTP, dan Password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    // 2. Cari token (OTP) yang valid di database
    // Kita cari berdasarkan token dan hubungkan dengan email user-nya
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: otp,
        used: false,
        user: {
          email: email,
        },
      },
      include: {
        user: true, // Ambil data user terkait
      },
    });

    // 3. Validasi Token: Jika tidak ketemu atau sudah kadaluarsa
    if (!resetToken) {
      return NextResponse.json(
        { message: "Kode OTP salah atau tidak ditemukan." },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { message: "Kode OTP telah kadaluarsa. Silakan minta kode baru." },
        { status: 400 }
      );
    }

    // 4. Hash Password Baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Jalankan Update Database secara berurutan (Transaction)
    await prisma.$transaction([
      // Update password user
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      // Tandai token sudah digunakan atau hapus token tersebut
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
      // Opsi tambahan: Hapus semua token sisa milik user ini agar bersih
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId }
      })
    ]);

    return NextResponse.json({
      message: "Password berhasil direset. Silakan login kembali.",
    });

  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
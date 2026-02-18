import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendOtpEmail } from "@/lib/mail"; // Import fungsi kirim email yang baru dibuat

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Security: Tetap kembalikan sukses meski user tidak ada agar email tidak bisa di-scan
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: "Jika email terdaftar, kode OTP akan dikirimkan." 
      });
    }

    // 1. Generate OTP 4 Karakter (Angka)
    const otp = crypto.randomInt(1000, 9999).toString();

    // 2. Set Expiry (5 Menit)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    // 3. Hapus token lama milik user ini agar tidak menumpuk
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    });

    // 4. Simpan OTP ke tabel PasswordResetToken
    await prisma.passwordResetToken.create({
      data: {
        token: otp,
        userId: user.id,
        expiresAt,
      },
    });

    // 5. Kirim email via Nodemailer
    try {
      await sendOtpEmail(email, otp);
      
      // Log tetap ada untuk mempermudah debugging di terminal
      console.log("========================================");
      console.log(`EMAIL TERKIRIM KE: ${email}`);
      console.log(`KODE OTP: ${otp}`);
      console.log("========================================");
    } catch (mailError) {
      console.error("Gagal mengirim email:", mailError);
      return NextResponse.json(
        { message: "Gagal mengirim email OTP. Silakan coba lagi nanti." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
        success: true, 
        message: "Kode OTP telah dikirim ke email Anda." 
    });

  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
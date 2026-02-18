import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

// Gunakan konfigurasi yang lebih fleksibel untuk hosting
const transporter = nodemailer.createTransport({
  // Hostinger/Gmail biasanya lebih stabil dengan host & port eksplisit
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 465,
  secure: true, // true untuk port 465
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  // --- PERBAIKAN PATH LOGO UNTUK HOSTING ---
  // Di hosting, terkadang process.cwd() merujuk ke root yang berbeda.
  // Kita cek keberadaan file sebelum mengirim agar aplikasi tidak crash (Error 500)
  const logoPath = path.join(process.cwd(), "public", "images", "gnr_compress.png");
  const hasLogo = fs.existsSync(logoPath);

  const mailOptions: any = {
    from: `"Guns N' Roses IDN Admin" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: "Kode OTP Reset Password - Guns N' Roses IDN",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; color: #333; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          ${hasLogo 
            ? `<img src="cid:logo_gunners" alt="Gunners Logo" style="width: 150px; height: auto; margin-bottom: 10px; display: inline-block;" />`
            : `<h2 style="color: #00838f;">Guns N' Roses IDN</h2>` 
          }
          <h1 style="color: #00838f; margin: 0; font-size: 24px;">- Guns N' Roses IDN -</h1>
          <p style="font-size: 14px; color: #666; margin-top: 5px;">Keamanan Akun Anda</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; text-align: center; border: 1px dashed #ddd;">
          <p style="margin-top: 0; font-size: 16px;">Halo,</p>
          <p style="font-size: 15px; color: #555;">Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Gunakan kode OTP di bawah ini:</p>
          
          <div style="margin: 25px 0; font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #00838f; background: #ffffff; padding: 15px; border-radius: 8px; display: inline-block; border: 1px solid #eee;">
            ${otp}
          </div>
          
          <p style="font-size: 13px; color: #d32f2f; margin-top: 20px;">
            <strong>Penting:</strong> Kode ini hanya berlaku selama <strong>5 menit</strong>.
          </p>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 25px; text-align: center; line-height: 1.5;">
          Jika Anda tidak merasa meminta pengaturan ulang kata sandi, silakan abaikan email ini atau hubungi tim dukungan kami jika ada aktivitas mencurigakan.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
        
        <p style="font-size: 11px; color: #bbb; text-align: center;">
          &copy; ${new Date().getFullYear()} Gunners Project. All rights reserved. <br/>
          South Tangerang, Banten, Indonesia.
        </p>
      </div>
    `,
  };

  // Hanya tambahkan attachment jika filenya benar-benar ada di server
  if (hasLogo) {
    mailOptions.attachments = [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logo_gunners",
      },
    ];
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ EMAIL BERHASIL TERKIRIM:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ ERROR NODEMAILER:", error);
    // Di hosting, jangan lempar error yang terlalu teknis ke user
    throw new Error("Gagal mengirim email verifikasi. Periksa konfigurasi SMTP server.");
  }
};
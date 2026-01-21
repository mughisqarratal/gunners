import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Data tidak lengkap" },
      { status: 400 }
    );
  }

  /**
   * TODO:
   * 1. Validasi token dari database
   * 2. Cek expiry
   * 3. Hash password baru
   * 4. Update password user
   * 5. Hapus token
   */

  return NextResponse.json({
    message: "Password berhasil direset",
  });
}

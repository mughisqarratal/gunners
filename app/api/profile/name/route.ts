import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const { name } = await req.json();

    // 1. Validasi input: Nama minimal 3 karakter
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { message: "Nama minimal harus 3 karakter" },
        { status: 400 }
      );
    }

    // 2. Ambil user_id dari cookie secara asinkron
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    // 3. Cek apakah user sudah login atau belum
    if (!userId) {
      return NextResponse.json(
        { message: "Sesi tidak ditemukan, silakan login kembali" },
        { status: 401 }
      );
    }

    // 4. Update data ke database menggunakan Prisma
    // Pakai Number(userId) karena biasanya ID di MySQL itu tipe datanya Integer
    await prisma.user.update({
      where: { 
        id: Number(userId) 
      },
      data: { 
        name: name.trim() 
      },
    });

    return NextResponse.json({
      success: true,
      message: "Nama berhasil diperbarui"
    });

  } catch (error) {
    console.error("UPDATE_NAME_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui nama di database" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { uploadToCloudinary } from "@/lib/cloudinary";

/* ================= GET ================= */
export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { order: "asc" } },
      },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

/* ================= POST ================= */
export async function POST(req: Request) {
  const role = (await cookies()).get("role")?.value;
  if (role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const venue = formData.get("venue")?.toString();
    const files = formData.getAll("images") as File[];

    if (!title || !venue || files.length === 0) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const imagesData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const upload = await uploadToCloudinary(file, "gallery");

      imagesData.push({
        id: upload.public_id, // Gunakan public_id sebagai ID String di DB
        url: upload.secure_url,
        order: i,
      });
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        venue,
        images: { create: imagesData },
      },
      include: {
        images: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
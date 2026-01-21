import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

/* ================= DELETE GALLERY ================= */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 🔐 ADMIN CHECK
  const role = (await cookies()).get("role")?.value;
  if (role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!gallery) {
    return NextResponse.json({ message: "Gallery not found" }, { status: 404 });
  }

  // 🧹 hapus file fisik
  for (const img of gallery.images) {
    const filePath = path.join(process.cwd(), "public", img.url);
    await fs.unlink(filePath).catch(() => {});
  }

  // 🗑️ hapus gallery (images ikut via cascade)
  await prisma.gallery.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

/* ================= UPDATE GALLERY ================= */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const formData = await req.formData();

  const title = formData.get("title")?.toString();
  const venue = formData.get("venue")?.toString();
  const files = formData.getAll("images") as File[];

  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!gallery) {
    return NextResponse.json({ message: "Gallery not found" }, { status: 404 });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads/gallery");
  await fs.mkdir(uploadDir, { recursive: true });

  let orderStart = gallery.images.length;
  const newImages = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    newImages.push({
      id: nanoid(),
      url: `/uploads/gallery/${filename}`,
      order: orderStart++,
    });
  }

  await prisma.gallery.update({
    where: { id },
    data: {
      title,
      venue,
      images: {
        create: newImages,
      },
    },
  });

  return NextResponse.json({ success: true });
}

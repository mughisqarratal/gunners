import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/* =========================
   UPDATE BIOGRAPHY
========================= */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const file = formData.get("image") as File | null;

  const biography = await prisma.biography.findUnique({ where: { id } });
  if (!biography) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  let imagePath = biography.image;

  if (file && file.type.startsWith("image/")) {
    const uploadDir = path.join(process.cwd(), "public/uploads/biographies");
    await fs.mkdir(uploadDir, { recursive: true });

    if (imagePath) {
      const oldPath = path.join(process.cwd(), "public", imagePath);
      await fs.unlink(oldPath).catch(() => {});
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    imagePath = `/uploads/biographies/${filename}`;
  }

  await prisma.biography.update({
    where: { id },
    data: { name, role, bio, image: imagePath },
  });

  return NextResponse.json({ success: true });
}

/* =========================
   DELETE BIOGRAPHY
========================= */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  const biography = await prisma.biography.findUnique({ where: { id } });
  if (!biography) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (biography.image) {
    const filePath = path.join(process.cwd(), "public", biography.image);
    await fs.unlink(filePath).catch(() => {});
  }

  await prisma.biography.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

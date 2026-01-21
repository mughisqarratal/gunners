import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/* ===== DELETE IMAGE ===== */
export async function DELETE(req: Request) {
  const { imageId } = await req.json();

  const image = await prisma.galleryImage.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }

  // hapus file fisik
  const filePath = path.join(process.cwd(), "public", image.url);
  await fs.unlink(filePath).catch(() => {});

  // hapus DB
  await prisma.galleryImage.delete({
    where: { id: imageId },
  });

  return NextResponse.json({ success: true });
}

/* ===== REORDER ===== */
export async function PUT(req: Request) {
  const { orders } = await req.json();

  await Promise.all(
    orders.map((o: { id: string; order: number }) =>
      prisma.galleryImage.update({
        where: { id: o.id },
        data: { order: o.order },
      })
    )
  );

  return NextResponse.json({ success: true });
}

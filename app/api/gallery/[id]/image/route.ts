import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

/* ===== DELETE IMAGE ===== */
export async function DELETE(req: Request) {
  try {
    const { imageId } = await req.json(); // imageId adalah Public ID String

    const image = await prisma.galleryImage.findUnique({
      where: { id: imageId },
    });

    if (!image) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Hapus dari Cloudinary (Gunakan ID-nya langsung karena ID = Public ID)
    await deleteFromCloudinary(image.id);

    // Hapus dari DB
    await prisma.galleryImage.delete({ where: { id: imageId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

/* ===== REORDER ===== */
export async function PUT(req: Request) {
  try {
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
  } catch (error) {
    return NextResponse.json({ message: "Reorder failed" }, { status: 500 });
  }
}
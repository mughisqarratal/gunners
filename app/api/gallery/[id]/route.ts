import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

/* ================= DELETE GALLERY ================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = (await cookies()).get("role")?.value;
  if (role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const galleryId = Number(id);

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: { images: true },
    });

    if (!gallery) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Hapus semua foto dari Cloudinary
    const deletePromises = gallery.images.map((img) => deleteFromCloudinary(img.id));
    await Promise.all(deletePromises);

    await prisma.gallery.delete({ where: { id: galleryId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

/* ================= UPDATE GALLERY ================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryId = Number(id);
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const venue = formData.get("venue")?.toString();
    const files = formData.getAll("images") as File[];

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: { images: true },
    });

    if (!gallery) return NextResponse.json({ message: "Not found" }, { status: 404 });

    let orderStart = gallery.images.length;
    const newImages = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const upload = await uploadToCloudinary(file, "gallery");
      newImages.push({
        id: upload.public_id,
        url: upload.secure_url,
        order: orderStart++,
      });
    }

    await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        title,
        venue,
        images: { create: newImages },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
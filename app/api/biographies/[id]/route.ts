import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 15 async params
  const biographyId = parseInt(id);

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const file = formData.get("image") as File | null;

  const biography = await prisma.biography.findUnique({ where: { id: biographyId } });
  if (!biography) return NextResponse.json({ message: "Not found" }, { status: 404 });

  let imagePath = biography.image;
  let imageId = biography.imageId;

  if (file && file.type.startsWith("image/")) {
    // Hapus yang lama dari Cloud jika ada
    if (biography.imageId) await deleteFromCloudinary(biography.imageId);

    const upload = await uploadToCloudinary(file, "biographies");
    imagePath = upload.secure_url;
    imageId = upload.public_id;
  }

  await prisma.biography.update({
    where: { id: biographyId },
    data: { name, role, bio, image: imagePath, imageId: imageId },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const biographyId = parseInt(id);

  const biography = await prisma.biography.findUnique({ where: { id: biographyId } });
  if (!biography) return NextResponse.json({ message: "Not found" }, { status: 404 });

  // Hapus file fisik di Cloudinary
  if (biography.imageId) {
    await deleteFromCloudinary(biography.imageId);
  }

  await prisma.biography.delete({ where: { id: biographyId } });
  return NextResponse.json({ success: true });
}
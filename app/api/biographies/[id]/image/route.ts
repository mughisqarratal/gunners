import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const biographyId = parseInt(id);

  const biography = await prisma.biography.findUnique({ where: { id: biographyId } });
  if (!biography) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Invalid image" }, { status: 400 });
  }

  // 1. Hapus image lama di Cloudinary
  if (biography.imageId) {
    await deleteFromCloudinary(biography.imageId);
  }

  // 2. Upload baru
  const upload = await uploadToCloudinary(file, "biographies");

  // 3. Update DB
  await prisma.biography.update({
    where: { id: biographyId },
    data: { 
      image: upload.secure_url, 
      imageId: upload.public_id 
    },
  });

  return NextResponse.json({ image: upload.secure_url });
}
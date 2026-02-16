import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

/* ======================
    ADD IMAGES (POST)
   ====================== */
export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Gunakan Promise untuk Next.js 15
) {
  try {
    const { id } = await params; // Await params di sini
    const newsId = Number(id);
    
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    
    // Ambil jumlah gambar terakhir untuk menentukan urutan (order)
    const count = await prisma.newsImage.count({ where: { newsId } });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.type.startsWith("image/")) continue;

      // Upload ke Cloudinary
      const upload = await uploadToCloudinary(file, "news");

      // Simpan ke Database
      await prisma.newsImage.create({
        data: {
          image: upload.secure_url,
          imageId: upload.public_id,
          newsId,
          order: count + i,
        },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

/* ======================
    DELETE IMAGE (DELETE)
   ====================== */
export async function DELETE(req: Request) {
  try {
    const { imageId } = await req.json(); // imageId adalah ID dari tabel NewsImage (Int)

    // 1. Cari data gambar di DB
    const img = await prisma.newsImage.findUnique({ 
      where: { id: Number(imageId) } 
    });

    if (!img) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    // 2. Hapus dari Cloudinary jika ada publicId-nya
    if (img.imageId) {
      await deleteFromCloudinary(img.imageId);
    }

    // 3. Hapus dari database
    await prisma.newsImage.delete({ 
      where: { id: Number(imageId) } 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
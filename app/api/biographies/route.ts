import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const data = await prisma.biography.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const file = formData.get("image") as File | null;

    let imagePath: string | null = null;
    let imageId: string | null = null;

    if (file && file.type.startsWith("image/")) {
      // Upload ke Cloudinary folder 'biographies'
      const upload = await uploadToCloudinary(file, "biographies");
      imagePath = upload.secure_url;
      imageId = upload.public_id;
    }

    const biography = await prisma.biography.create({
      data: { name, role, bio, image: imagePath, imageId: imageId },
    });

    return NextResponse.json(biography);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
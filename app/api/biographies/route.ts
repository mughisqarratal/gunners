import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

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
  // ✅ Cek admin
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const file = formData.get("image") as File | null;

    let imagePath: string | null = null;
    let imageId: string | null = null;

    if (file && file.type.startsWith("image/")) {
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
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ Cek admin
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const biographyId = parseInt(id);

  const biography = await prisma.biography.findUnique({ where: { id: biographyId } });
  if (!biography) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Invalid image" }, { status: 400 });
  }

  if (biography.imageId) {
    await deleteFromCloudinary(biography.imageId);
  }

  const upload = await uploadToCloudinary(file, "biographies");

  await prisma.biography.update({
    where: { id: biographyId },
    data: {
      image: upload.secure_url,
      imageId: upload.public_id,
    },
  });

  return NextResponse.json({ image: upload.secure_url });
}
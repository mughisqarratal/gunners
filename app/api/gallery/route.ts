import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

/* ================= GET ================= */
export async function GET() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(galleries);
}

/* ================= POST ================= */
export async function POST(req: Request) {
  const role = (await cookies()).get("role")?.value;
  if (role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const title = formData.get("title")?.toString();
  const venue = formData.get("venue")?.toString();
  const files = formData.getAll("images") as File[];

  if (!title || !venue || files.length === 0) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads/gallery");
  await fs.mkdir(uploadDir, { recursive: true });

  const imagesData = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    await fs.writeFile(path.join(uploadDir, filename), buffer);

    imagesData.push({
      id: nanoid(),
      url: `/uploads/gallery/${filename}`,
      order: i,
    });
  }

  const gallery = await prisma.gallery.create({
    data: {
      title,
      venue,
      images: {
        create: imagesData,
      },
    },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(gallery);
}

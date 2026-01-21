import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/* =========================
   GET ALL BIOGRAPHIES
========================= */
export async function GET() {
  try {
    const data = await prisma.biography.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET biographies error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/* =========================
   CREATE BIOGRAPHY
========================= */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const file = formData.get("image") as File | null;

    let imagePath: string | null = null;

    if (file && file.type.startsWith("image/")) {
      const uploadDir = path.join(process.cwd(), "public/uploads/biographies");
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);

      imagePath = `/uploads/biographies/${filename}`;
    }

    const biography = await prisma.biography.create({
      data: { name, role, bio, image: imagePath },
    });

    return NextResponse.json(biography);
  } catch (error) {
    console.error("POST biography error:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

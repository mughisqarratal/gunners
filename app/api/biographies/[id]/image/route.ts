import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const biographyId = Number(params.id);

  const biography = await prisma.biography.findUnique({
    where: { id: biographyId },
  });

  if (!biography) {
    return NextResponse.json(
      { message: "Biography not found" },
      { status: 404 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "File image tidak valid" },
      { status: 400 }
    );
  }

  const uploadDir = path.join(
    process.cwd(),
    "public/uploads/biographies"
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  const filename = `${Date.now()}-${file.name.replace(
    /\s+/g,
    "-"
  )}`;

  await fs.writeFile(
    path.join(uploadDir, filename),
    buffer
  );

  // hapus image lama
  if (biography.image) {
    await fs
      .unlink(
        path.join(process.cwd(), "public", biography.image)
      )
      .catch(() => {});
  }

  const imagePath = `/uploads/biographies/${filename}`;

  await prisma.biography.update({
    where: { id: biographyId },
    data: { image: imagePath },
  });

  return NextResponse.json({ image: imagePath });
}

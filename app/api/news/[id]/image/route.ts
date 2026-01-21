import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/* ======================
   ADD IMAGE
====================== */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const newsId = Number(params.id);
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  const uploadDir = path.join(process.cwd(), "public/uploads/news");
  await fs.mkdir(uploadDir, { recursive: true });

  const count = await prisma.newsImage.count({ where: { newsId } });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith("image/")) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    await prisma.newsImage.create({
      data: {
        image: `/uploads/news/${filename}`,
        newsId,
        order: count + i,
      },
    });
  }

  return NextResponse.json({ success: true });
}

/* ======================
   DELETE IMAGE
====================== */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { imageId } = await req.json();

  const img = await prisma.newsImage.findUnique({
    where: { id: imageId },
  });

  if (img) {
    const filePath = path.join(process.cwd(), "public", img.image);
    await fs.unlink(filePath).catch(() => {});
    await prisma.newsImage.delete({ where: { id: imageId } });
  }

  return NextResponse.json({ success: true });
}

/* ======================
   REORDER
====================== */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { orders } = await req.json();

  await Promise.all(
    orders.map((o: { id: number; order: number }) =>
      prisma.newsImage.update({
        where: { id: o.id },
        data: { order: o.order },
      })
    )
  );

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";

/* ======================
   GET - LIST NEWS
====================== */
export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      button: true,
    },
  });

  return NextResponse.json(news);
}

/* ======================
   POST - CREATE NEWS
====================== */
export async function POST(req: Request) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;

  const buttonLabel = formData.get("buttonLabel") as string | null;
  const buttonUrl = formData.get("buttonUrl") as string | null;

  if (!title || !content) {
    return NextResponse.json(
      { message: "Title & content required" },
      { status: 400 }
    );
  }

  const slug = slugify(title, { lower: true, strict: true });

  const news = await prisma.news.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      button:
        buttonLabel && buttonUrl
          ? {
              create: {
                label: buttonLabel,
                url: buttonUrl,
              },
            }
          : undefined,
    },
  });

  /* ===== UPLOAD IMAGES ===== */
  const files = formData.getAll("images") as File[];
  const uploadDir = path.join(process.cwd(), "public/uploads/news");
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;

    await fs.writeFile(path.join(uploadDir, filename), buffer);

    await prisma.newsImage.create({
      data: {
        image: `/uploads/news/${filename}`,
        newsId: news.id,
      },
    });
  }

  return NextResponse.json({ success: true });
}

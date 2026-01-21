import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ======================
   GET
====================== */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const news = await prisma.news.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      button: true,
    },
  });

  if (!news) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(news);
}

/* ======================
   UPDATE (TEXT + BUTTON)
====================== */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();

  const {
    title,
    excerpt,
    content,
    button, // ⬅️ INI KUNCI
  } = body;

  await prisma.news.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
    },
  });

  // BUTTON
  if (button === null) {
    await prisma.newsButton.deleteMany({ where: { newsId: id } });
  }

  if (button?.label && button?.url) {
    await prisma.newsButton.upsert({
      where: { newsId: id },
      update: {
        label: button.label,
        url: button.url,
      },
      create: {
        label: button.label,
        url: button.url,
        newsId: id,
      },
    });
  }

  return NextResponse.json({ success: true });
}

/* ======================
   DELETE
====================== */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await prisma.news.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

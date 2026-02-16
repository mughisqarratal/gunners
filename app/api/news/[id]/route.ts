import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

/* ======================
    GET SINGLE NEWS
   ====================== */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 wajib pakai Promise
) {
  try {
    const { id } = await params;
    const newsId = Number(id);

    if (isNaN(newsId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
      include: {
        images: { orderBy: { order: "asc" } },
        button: true,
      },
    });

    if (!news) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("GET news by ID error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* ======================
    UPDATE NEWS (TEXT)
   ====================== */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = Number(id);
    const body = await req.json();

    const { title, excerpt, content, button } = body;

    await prisma.news.update({
      where: { id: newsId },
      data: { title, excerpt, content },
    });

    // Handle Button Update
    if (button === null) {
      await prisma.newsButton.deleteMany({ where: { newsId: newsId } });
    } else if (button?.label && button?.url) {
      await prisma.newsButton.upsert({
        where: { newsId: newsId },
        update: { label: button.label, url: button.url },
        create: { label: button.label, url: button.url, newsId: newsId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

/* ======================
    DELETE NEWS
   ====================== */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = Number(id);

    // 1. Cari semua imageId di Cloudinary untuk dihapus
    const images = await prisma.newsImage.findMany({
      where: { newsId: newsId },
    });

    // 2. Hapus fisik di Cloudinary
    for (const img of images) {
      if (img.imageId) {
        await deleteFromCloudinary(img.imageId);
      }
    }

    // 3. Hapus dari DB
    await prisma.news.delete({ where: { id: newsId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
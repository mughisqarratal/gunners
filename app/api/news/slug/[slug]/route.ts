import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> } // 1. Tambahkan Promise di sini
) {
  try {
    // 2. Await params agar nilainya bisa dibaca
    const { slug } = await params;

    const news = await prisma.news.findUnique({
      where: { slug: slug },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
        button: true,
      },
    });

    if (!news) {
      return NextResponse.json(
        { message: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("GET news by slug error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
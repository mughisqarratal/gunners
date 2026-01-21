import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const news = await prisma.news.findUnique({
    where: { slug: params.slug },
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
      { message: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(news);
}

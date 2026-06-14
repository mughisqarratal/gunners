import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");

  if (!q || q.trim() === "") {
    return NextResponse.json([]);
  }

  const songs = await prisma.song.findMany({
    where: {
      title: {
        contains: q,
      },
    },

    include: {
      album: {
        select: {
          title: true,
          slug: true,
          cover: true,
        },
      },
    },

    orderBy: {
      title: "asc",
    },

    take: 20,
  });

  return NextResponse.json(songs);
}
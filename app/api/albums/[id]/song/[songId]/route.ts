import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

/* ================= UPDATE SONG ================= */
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      songId: string;
    }>;
  }
) {
  const { songId } = await params;

  const body = await req.json();

  const song = await prisma.song.update({
    where: {
      id: songId,
    },

    data: {
      title: body.title,

      slug: slugify(body.title, {
        lower: true,
        strict: true,
      }),

      trackNumber: body.trackNumber,

      spotifyUrl: body.spotifyUrl,
      youtubeUrl: body.youtubeUrl,
      appleMusicUrl: body.appleMusicUrl,
      soundcloudUrl: body.soundcloudUrl,
    },
  });

  return NextResponse.json(song);
}

/* ================= DELETE SONG ================= */
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      songId: string;
    }>;
  }
) {
  const { songId } = await params;

  await prisma.song.delete({
    where: {
      id: songId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          message: "Judul lagu wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const song = await prisma.song.create({
      data: {
        title: body.title,

        slug: slugify(body.title, {
          lower: true,
          strict: true,
        }),

        trackNumber: body.trackNumber || null,

        spotifyUrl: body.spotifyUrl || null,
        youtubeUrl: body.youtubeUrl || null,
        appleMusicUrl: body.appleMusicUrl || null,
        soundcloudUrl: body.soundcloudUrl || null,

        albumId: id,
      },
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error("CREATE SONG ERROR:", error);

    return NextResponse.json(
      {
        message: "Create song failed",
      },
      {
        status: 500,
      }
    );
  }
}
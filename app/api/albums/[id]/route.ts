import { prisma } from "@/lib/prisma";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary";

import { NextResponse } from "next/server";
import slugify from "slugify";

/* ================= GET DETAIL ================= */

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: { id },

    include: {
      songs: {
        orderBy: {
          trackNumber: "asc",
        },
      },
    },
  });

  if (!album) {
    return NextResponse.json(
      { message: "Album tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(album);
}

/* ================= UPDATE ================= */

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      return NextResponse.json(
        { message: "Album tidak ditemukan" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const title =
      formData.get("title")?.toString() ||
      album.title;

    const releaseYearRaw =
      formData.get("releaseYear");

    const releaseYear =
      releaseYearRaw &&
      releaseYearRaw.toString() !== ""
        ? Number(releaseYearRaw)
        : album.releaseYear;

    const cover = formData.get(
      "cover"
    ) as File | null;

    let coverUrl = album.cover;
    let coverId = album.coverId;

    if (
      cover &&
      cover instanceof File &&
      cover.size > 0
    ) {
      if (album.coverId) {
        try {
          await deleteFromCloudinary(
            album.coverId
          );
        } catch (error) {
          console.error(
            "Delete old cover failed:",
            error
          );
        }
      }

      const upload =
        await uploadToCloudinary(
          cover,
          "albums"
        );

      coverUrl = upload.secure_url;
      coverId = upload.public_id;
    }

    const updatedAlbum =
      await prisma.album.update({
        where: {
          id,
        },

        data: {
          title,

          slug: slugify(title, {
            lower: true,
            strict: true,
          }),

          releaseYear,

          cover: coverUrl,
          coverId,
        },
      });

    return NextResponse.json(
      updatedAlbum
    );
  } catch (error) {
    console.error(
      "Album update error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Gagal update album",
      },
      {
        status: 500,
      }
    );
  }
}

/* ================= DELETE ================= */

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const album =
      await prisma.album.findUnique({
        where: { id },
      });

    if (!album) {
      return NextResponse.json(
        { message: "Album tidak ditemukan" },
        { status: 404 }
      );
    }

    if (album.coverId) {
      try {
        await deleteFromCloudinary(
          album.coverId
        );
      } catch (error) {
        console.error(
          "Delete cloudinary failed:",
          error
        );
      }
    }

    await prisma.album.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete album error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Gagal menghapus album",
      },
      {
        status: 500,
      }
    );
  }
}
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import slugify from "slugify";

/* ================= GET ================= */

export async function GET() {
  const albums = await prisma.album.findMany({
    include: {
      songs: {
        orderBy: {
          trackNumber: "asc",
        },
      },
    },

    orderBy: {
      releaseYear: "desc",
    },
  });

  return NextResponse.json(albums);
}

/* ================= CREATE ================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title =
      formData.get("title")?.toString();

    const releaseYearRaw =
      formData.get("releaseYear");

    const releaseYear =
      releaseYearRaw &&
      releaseYearRaw.toString() !== ""
        ? Number(releaseYearRaw)
        : null;

    const cover = formData.get(
      "cover"
    ) as File;

    if (!title || !cover) {
      return NextResponse.json(
        {
          message: "Data tidak lengkap",
        },
        {
          status: 400,
        }
      );
    }

    const upload =
      await uploadToCloudinary(
        cover,
        "albums"
      );

    const album =
      await prisma.album.create({
        data: {
          title,

          slug: slugify(title, {
            lower: true,
            strict: true,
          }),

          releaseYear,

          cover: upload.secure_url,
          coverId: upload.public_id,
        },
      });

    return NextResponse.json(album);
  } catch (error) {
    console.error(
      "Create Album Error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Create album failed",
      },
      {
        status: 500,
      }
    );
  }
}
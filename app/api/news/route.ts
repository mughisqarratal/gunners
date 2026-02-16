import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { uploadToCloudinary } from "@/lib/cloudinary";

/* ======================
    GET - AMBIL SEMUA BERITA
   ====================== */
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        button: true,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("GET news error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/* ======================
    POST - BUAT BERITA BARU
   ====================== */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const buttonLabel = formData.get("buttonLabel") as string | null;
    const buttonUrl = formData.get("buttonUrl") as string | null;

    if (!title || !content) {
      return NextResponse.json({ message: "Title & content required" }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });

    // 1. Create News data
    const news = await prisma.news.create({
      data: {
        title, 
        slug, 
        excerpt, 
        content,
        button: buttonLabel && buttonUrl ? {
          create: { label: buttonLabel, url: buttonUrl },
        } : undefined,
      },
    });

    // 2. Multi Upload to Cloudinary
    const files = formData.getAll("images") as File[];
    for (const file of files) {
      if (!file || !file.type.startsWith("image/")) continue;

      const upload = await uploadToCloudinary(file, "news");

      await prisma.newsImage.create({
        data: {
          image: upload.secure_url,
          imageId: upload.public_id, 
          newsId: news.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST news error:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
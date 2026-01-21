import { prisma } from "@/lib/prisma";
import GalleryLightbox from "./GalleryLightbox";

type GalleryWithImages = {
  id: number;
  title: string;
  venue: string;
  images: string[];
};

async function getGallery(): Promise<GalleryWithImages[]> {
  const data = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { order: "asc" },
        select: {
          url: true,
        },
      },
    },
  });

  return data.map((g) => ({
    id: g.id,
    title: g.title,
    venue: g.venue,
    images: g.images.map((img) => img.url),
  }));
}

export default async function GalleryPage() {
  const galleries = await getGallery();

  return (
    <main className="max-w-6xl mx-auto px-3 py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        GALLERY
      </h1>

      <div className="space-y-14">
        {galleries.map((g) => (
          <section key={g.id} className="sm:mb-8">
            <h2 className="text-lg font-semibold mt-5">
              {g.title}
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              {g.venue}
            </p>

            {/* STYLE TETAP */}
            <GalleryLightbox images={g.images} />
          </section>
        ))}
      </div>
    </main>
  );
}

import { prisma } from "@/lib/prisma";
import GalleryLightbox from "./GalleryLightbox";
import {oswald, openSans} from "@/app/fonts";

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
    <main className="max-w-6xl mx-auto px-3 pb-5 ">
      {/* <h1 className="text-3xl font-bold mb-8 text-center">
        GALLERY
      </h1> */}
      <div className="space-y-14 bg-[#000000]">
        {galleries.map((g) => (
          <section key={g.id} className="sm:mb-8">
            <h2 className={`${oswald.className} text-xl font-semibold mt-5 text-gray-300`}>
              {g.title}
            </h2>
            <p className={`${openSans.className} text-sm text-gray-500 font-bold mb-2`}>
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

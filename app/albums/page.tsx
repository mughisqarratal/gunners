import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {oswald, openSans} from "@/app/fonts";

export default async function AlbumsPage() {
  const albums = await prisma.album.findMany({
    orderBy: {
      releaseYear: "desc",
    },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-8">
        Albums
      </h1> */}

      {albums.length === 0 ? (
        <p>Belum ada album.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${album.slug}`}
              className="
                group
                bg-white
                overflow-hidden
                shadow
                hover:shadow-xl
                transition
                border-2 border-[#F3B800]
              "
            >
              <div className="relative aspect-square">
                <Image
                  src={album.cover}
                  alt={album.title}
                  fill
                  className="
                    object-cover
                    group-hover:scale-105
                    transition
                  "
                />
              </div>

              <div className="p-3">
                <h2 className= {`${oswald.className} font-semibold text-[#000000] text-lg`}>
                  {album.title}
                </h2>

                <p className= {`${openSans.className}text-sm text-gray-500`}>
                  {album.releaseYear}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {oswald, openSans} from "@/app/fonts";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const album = await prisma.album.findUnique({
    where: {
      slug,
    },
    include: {
      songs: {
        orderBy: {
          trackNumber: "asc",
        },
      },
    },
  });

  if (!album) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow p-6  border-2 border-[#F3B800]  ">

        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="relative aspect-square">
            <Image
              src={album.cover}
              alt={album.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h1 className={`${oswald.className} text-4xl font-semibold mb-2`}>
              {album.title}
            </h1>

            <p className= {`${openSans.className} text-gray-500 mb-6`}>
              {album.releaseYear}
            </p>

            <h2 className= {`${oswald.className} font-semibold text-xl mb-4`}>
              Track List
            </h2>

            <div className="space-y-2">
              {album.songs.map((song) => (
                <Link
                  key={song.id}
                  href={`/albums/${album.slug}/${song.slug}`}
                  className= {`${openSans.className}
                    font-semibold
                    block
                    border
                    rounded
                    p-3
                    hover:bg-gray-100
                    transition
                  
                `}>
                  {song.trackNumber
                    ? `${song.trackNumber}. `
                    : ""}
                  {song.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {bebas, openSans, lora, protest, oswald} from "@/app/fonts";
import {SiSpotify,
  SiApplemusic,
  SiSoundcloud,
  SiYoutubemusic,} from "react-icons/si";

export default async function SongDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
    songSlug: string;
  }>;
}) {
  const { slug, songSlug } =
    await params;

  const album = await prisma.album.findUnique({
    where: {
      slug,
    },
    include: {
      songs: true,
    },
  });

  if (!album) {
    notFound();
  }

  const song = album.songs.find(
    (s) => s.slug === songSlug
  );

  if (!song) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-6 border-2 border-[#F3B800] shadow">

        <Link
          href={`/albums/${album.slug}`}
          className={`${oswald.className}
            text-sm
            text-gray-500
            hover:underline
          `}
        >
          ← Back to Album
        </Link>

        <h1 className={`${oswald.className} text-4xl font-semibold mt-4 mb-2`}>
          {song.title}
        </h1>

        <p className={`${openSans.className} text-gray-500 mb-6`}>
          {album.title}
        </p>

        <div className={`${openSans.className} grid gap-4 font-semibold`}>

          {song.spotifyUrl && (
            <a
              href={song.spotifyUrl}
              target="_blank"
              className="
                flex items-center gap-3
                p-3 rounded
                bg-green-600
                text-white
              "
            >
              <SiSpotify size={32} />
              Spotify
            </a>
          )}

          {song.youtubeUrl && (
            <a
              href={song.youtubeUrl}
              target="_blank"
              className="
                flex items-center gap-3
                p-3 rounded
                bg-red-600
                text-white
              "
            >
              <SiYoutubemusic size={32} />
              YouTube Music
            </a>
          )}

          {song.appleMusicUrl && (
            <a
              href={song.appleMusicUrl}
              target="_blank"
              className="
                flex items-center gap-3
                p-3 rounded
                bg-[#FA243C]
                text-white
              "
            >
              <SiApplemusic size={32} />
              Apple Music
            </a>

          )}
          {song.soundcloudUrl && (
            <a
              href={song.soundcloudUrl}
              target="_blank"
              className="
                flex items-center gap-3
                p-3 rounded
                bg-orange-500
                text-white
              "
            >
              <SiSoundcloud size={32} />
              SoundCloud
            </a>
          )}

        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { oswald, openSans } from "@/app/fonts";

interface Album {
  id: string;
  title: string;
  slug: string;
  cover: string;
  releaseYear: number | null;
}

interface SearchSong {
  id: string;
  title: string;
  slug: string;

  album: {
    title: string;
    slug: string;
    cover: string;
  };
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchSong[]>([]);

  /* ================= LOAD ALBUMS ================= */

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch("/api/albums");

        const data = await res.json();

        setAlbums(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  /* ================= SEARCH SONG ================= */

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!keyword.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);

        const data = await res.json();

        setResults(data);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* ================= SEARCH ================= */}

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Fuckin' song..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={`${openSans.className}
            font-semibold
            w-full
            border-2 border-[#F3B800]
            px-4 py-2
            outline-none
            bg-amber-50
            focus:border-[#DC0000]
  `}
        />
      </div>

      {/* ================= SEARCH RESULT ================= */}

      {keyword.trim() !== "" && (
        <div className="space-y-3 mb-8">
          {results.length > 0 ? (
            results.map((song) => (
              <Link
                key={song.id}
                href={`/albums/${song.album.slug}/${song.slug}`}
                className="
    flex
    items-center
    gap-4
    bg-white
    p-3
    border-2 border-[#F3B800]
    hover:bg-gray-100
    transition
  "
              >
                {/* <div className="text-sm text-gray-400">
  Track {song.trackNumber}
</div> */}
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={song.album.cover}
                    alt={song.album.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <div
                    className={`
        ${oswald.className}
        text-lg
        font-semibold
      `}
                  >
                    {song.title}
                  </div>

                  <div
                    className={`
        ${openSans.className}
        text-sm
        text-gray-500
      `}
                  >
                    {song.album.title}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div
              className="
                bg-white
                p-4
                border-2 border-[#DC0000]
              "
            >
              Song not fuckin' found..
            </div>
          )}
        </div>
      )}

      {/* ================= ALBUM GRID ================= */}

      {keyword.trim() === "" && (
        <>
          {loading ? (
            <div>Loading...</div>
          ) : albums.length === 0 ? (
            <div>Belum ada album.</div>
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
                    <h2
                      className={`
                        ${oswald.className}
                        font-semibold
                        text-[#000000]
                        text-lg
                      `}
                    >
                      {album.title}
                    </h2>

                    <p
                      className={`
                        ${openSans.className}
                        text-sm
                        text-gray-500
                      `}
                    >
                      {album.releaseYear}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

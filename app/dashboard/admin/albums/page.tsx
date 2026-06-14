"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Album {
  id: string;
  title: string;
  slug: string;
  cover: string;
  coverId?: string | null;
  releaseYear: number | null;

  songs: {
    id: string;
  }[];
}

export default function AdminAlbumsPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  /* ================= CREATE ================= */

  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  const [cover, setCover] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  /* ================= LIST ================= */

  const [albums, setAlbums] = useState<
    Album[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= EDIT ================= */

  const [editAlbum, setEditAlbum] =
    useState<Album | null>(null);

  const [newCover, setNewCover] =
    useState<File | null>(null);

  /* ================= FETCH ================= */

  const fetchAlbums = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/albums"
      );

      const data = await res.json();

      setAlbums(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  /* ================= CREATE ================= */

  const handleCreateAlbum = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Judul album wajib diisi");
      return;
    }

    if (!cover) {
      alert("Cover album wajib diisi");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", title);

      formData.append(
        "releaseYear",
        releaseYear
      );

      formData.append("cover", cover);

      const res = await fetch(
        "/api/albums",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(
          "Gagal membuat album"
        );
      }

      setTitle("");
      setReleaseYear("");
      setCover(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      fetchAlbums();
    } catch (error) {
      console.error(error);
      alert("Gagal membuat album");
    } finally {
      setUploading(false);
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdateAlbum =
    async () => {
      if (!editAlbum) return;

      try {
        const formData =
          new FormData();

        formData.append(
          "title",
          editAlbum.title
        );

        formData.append(
          "releaseYear",
          String(
            editAlbum.releaseYear || ""
          )
        );

        if (newCover) {
          formData.append(
            "cover",
            newCover
          );
        }

        const res = await fetch(
          `/api/albums/${editAlbum.id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(
            "Update gagal"
          );
        }

        setEditAlbum(null);
        setNewCover(null);

        fetchAlbums();
      } catch (error) {
        console.error(error);
        alert("Gagal update album");
      }
    };

  /* ================= DELETE ================= */

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete =
      confirm(
        "Yakin ingin menghapus album ini?"
      );

    if (!confirmDelete) return;

    try {
      await fetch(
        `/api/albums/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchAlbums();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-10">
      {/* ================= CREATE FORM ================= */}

      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-4">
          Album Management
        </h1>

        <form
          onSubmit={handleCreateAlbum}
          className="
            bg-white
            p-6
            rounded
            shadow
            space-y-4
          "
        >
          <input
            type="text"
            placeholder="Album Title"
            className="
              w-full
              border
              rounded
              px-3 py-2
            "
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Release Year"
            className="
              w-full
              border
              rounded
              px-3 py-2
            "
            value={releaseYear}
            onChange={(e) =>
              setReleaseYear(
                e.target.value
              )
            }
          />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setCover(
                e.target.files?.[0] ||
                  null
              )
            }
          />

          <button
            type="button"
            onClick={() =>
              fileRef.current?.click()
            }
            className="
              w-full
              border-2
              border-dashed
              rounded
              py-3
              cursor-pointer
            "
          >
            {cover
              ? cover.name
              : "+ Select Cover"}
          </button>

          <button
            type="submit"
            disabled={uploading}
            className="
              bg-black
              text-white
              px-4 py-2
              rounded
              cursor-pointer
            "
          >
            {uploading
              ? "Uploading..."
              : "Add Album"}
          </button>
        </form>
      </div>

      {/* ================= LIST ================= */}

      <div>
        <h2 className="text-xl font-bold mb-4">
          Album List
        </h2>

        {loading && (
          <p>Loading albums...</p>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {albums.map((album) => (
            <div
              key={album.id}
              className="
                bg-white
                rounded
                shadow
                p-4
                flex gap-4
              "
            >
              <Image
                src={album.cover}
                alt={album.title}
                width={120}
                height={120}
                className="
                  rounded
                  object-cover
                "
              />

              <div className="flex-1">
                <h3 className="font-bold">
                  {album.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {album.releaseYear}
                </p>

                <p className="text-sm">
                  {album.songs.length} Songs
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <Link
                    href={`/dashboard/admin/albums/${album.id}`}
                    className="
                      bg-blue-600
                      text-white
                      px-3 py-2
                      rounded
                    "
                  >
                    Songs
                  </Link>

                  <button
                    onClick={() =>
                      setEditAlbum(album)
                    }
                    className="
                      bg-yellow-500
                      text-white
                      px-3 py-2
                      rounded
                      cursor-pointer
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        album.id
                      )
                    }
                    className="
                      bg-red-600
                      text-white
                      px-3 py-2
                      rounded
                      cursor-pointer
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading &&
          albums.length === 0 && (
            <p className="text-gray-500">
              Belum ada album.
            </p>
          )}
      </div>

      {/* ================= EDIT MODAL ================= */}

      {editAlbum && (
        <div
          className="
            fixed inset-0
            z-50
            bg-black/70
            flex items-center justify-center
            p-4
          "
        >
          <div
            className="
              bg-white
              rounded-lg
              shadow-lg
              w-full
              max-w-lg
              p-6
            "
          >
            <h2 className="text-xl font-bold mb-4">
              Edit Album
            </h2>

            <input
              type="text"
              value={editAlbum.title}
              onChange={(e) =>
                setEditAlbum({
                  ...editAlbum,
                  title:
                    e.target.value,
                })
              }
              className="
                w-full
                border
                rounded
                px-3 py-2
                mb-4
              "
            />

            <input
              type="number"
              value={
                editAlbum.releaseYear ||
                ""
              }
              onChange={(e) =>
                setEditAlbum({
                  ...editAlbum,
                  releaseYear:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="
                w-full
                border
                rounded
                px-3 py-2
                mb-4
              "
            />

            <div className="mb-4">
              <p className="text-sm mb-2">
                Current Cover
              </p>

              <Image
                src={editAlbum.cover}
                alt={editAlbum.title}
                width={160}
                height={160}
                className="
                  rounded
                  border
                  object-cover
                "
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewCover(
                  e.target.files?.[0] ||
                    null
                )
              } 
              className="mb-6 border rounded py-1 px-1 cursor-pointer" 
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditAlbum(
                    null
                  );

                  setNewCover(
                    null
                  );
                }}
                className="
                  border
                  px-4 py-2
                  rounded
                  cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                onClick={
                  handleUpdateAlbum
                }
                className="
                  bg-yellow-500
                  text-white
                  px-4 py-2
                  rounded
                  cursor-pointer
                "
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
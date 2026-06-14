"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

interface Song {
  id: string;
  title: string;
  slug: string;

  trackNumber: number | null;

  spotifyUrl: string | null;
  youtubeUrl: string | null;
  appleMusicUrl: string | null;
  soundcloudUrl: string | null;
}

interface Album {
  id: string;
  title: string;

  songs: Song[];
}

export default function AdminAlbumSongsPage() {
  const params = useParams();

  const albumId = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");

  const [trackNumber, setTrackNumber] = useState("");

  const [spotifyUrl, setSpotifyUrl] = useState("");

  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [appleMusicUrl, setAppleMusicUrl] = useState("");

  const [soundcloudUrl, setSoundcloudUrl] = useState("");

  const [editSong, setEditSong] = useState<Song | null>(null);

  /* ================= FETCH ================= */

  const fetchAlbum = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/albums/${albumId}`);

      const data = await res.json();

      setAlbum(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  /* ================= ADD SONG ================= */

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Judul lagu wajib diisi",
      });

      return;
    }

    try {
      const res = await fetch(`/api/albums/${albumId}/song`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,

          trackNumber: trackNumber ? Number(trackNumber) : null,

          spotifyUrl,
          youtubeUrl,
          appleMusicUrl,
          soundcloudUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        throw new Error(data.message);
      }

      setTitle("");
      setTrackNumber("");

      setSpotifyUrl("");
      setYoutubeUrl("");
      setAppleMusicUrl("");
      setSoundcloudUrl("");

      fetchAlbum();
    } catch (error) {
      console.error(error);
      alert("Gagal tambah lagu");
    }
  };

  /* ================= UPDATE SONG ================= */

  const handleUpdateSong = async () => {
    if (!editSong) return;

    try {
      const res = await fetch(`/api/albums/${albumId}/song/${editSong.id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(editSong),
      });

      if (!res.ok) {
        throw new Error();
      }

      setEditSong(null);

      fetchAlbum();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= DELETE SONG ================= */

  const handleDeleteSong = async (songId: string) => {
    const ok = confirm("Hapus lagu ini?");

    if (!ok) return;

    await fetch(`/api/albums/${albumId}/song/${songId}`, {
      method: "DELETE",
    });

    fetchAlbum();
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">{album?.title}</h1>

        <p className="text-gray-500">Song Management</p>
      </div>

      {/* ================= FORM ================= */}

      <form
        onSubmit={handleAddSong}
        className="
          bg-white
          p-6
          rounded
          shadow
          space-y-4
          max-w-xl
        "
      >
        <h2 className="font-bold">Add Song</h2>

        <input
          type="text"
          placeholder="Song Title"
          className="
            w-full
            border
            rounded
            px-3
            py-2
          "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Track Number"
          className="
            w-full
            border
            rounded
            px-3
            py-2
          "
          value={trackNumber}
          onChange={(e) => setTrackNumber(e.target.value)}
        />

        <input
          type="text"
          placeholder="Spotify URL"
          className="
            w-full
            border
            rounded
            px-3
            py-2
          "
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Youtube URL"
          className="
            w-full
            border
            rounded
            px-3
            py-2
          "
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Apple Music URL"
          className="
            w-full
            border
            rounded
            px-3
            py-2
          "
          value={appleMusicUrl}
          onChange={(e) => setAppleMusicUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Soundcloud URL"
          className="
            w-full
            border
            rounded
            px-3
            py-2
          "
          value={soundcloudUrl}
          onChange={(e) => setSoundcloudUrl(e.target.value)}
        />

        <button
          className="
            bg-black
            text-white
            px-4
            py-2
            rounded
            cursor-pointer
          "
        >
          + Add Song
        </button>
      </form>

      {/* ================= SONG LIST ================= */}

      <div>
        <h2 className="text-xl font-bold mb-4">Songs</h2>

        {loading && <p>Loading...</p>}

        <div className="space-y-3">
          {album?.songs.map((song) => (
            <div
              key={song.id}
              className="
                bg-white
                rounded
                shadow
                p-4
                flex
                justify-between
                items-center
              "
            >
              <div>
                <p className="font-bold">
                  {song.trackNumber}. {song.title}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditSong(song)}
                  className="
                    bg-yellow-500
                    text-white
                    px-3 py-1
                    rounded
                    cursor-pointer
                  "
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteSong(song.id)}
                  className="
                    bg-red-600
                    text-white
                    px-3 py-1
                    rounded
                    cursor-pointer
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}

      {editSong && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded p-6 w-full max-w-lg space-y-3">
            <h2 className="font-bold text-xl">Edit Song</h2>

            <input
              value={editSong.title}
              onChange={(e) =>
                setEditSong({
                  ...editSong,
                  title: e.target.value,
                })
              }
              className="
                w-full
                border
                px-3 py-2
                rounded
              "
            />

            <input
              type="number"
              value={editSong.trackNumber || ""}
              onChange={(e) =>
                setEditSong({
                  ...editSong,
                  trackNumber: Number(e.target.value),
                })
              }
              className="
                w-full
                border
                px-3 py-2
                rounded
              "
            />

            <input
              value={editSong.spotifyUrl || ""}
              onChange={(e) =>
                setEditSong({
                  ...editSong,
                  spotifyUrl: e.target.value,
                })
              }
              placeholder="Spotify URL"
              className="
                w-full
                border
                px-3 py-2
                rounded
              "
            />

            <input
              value={editSong.youtubeUrl || ""}
              onChange={(e) =>
                setEditSong({
                  ...editSong,
                  youtubeUrl: e.target.value,
                })
              }
              placeholder="YouTube URL"
              className="
                w-full
                border
                px-3 py-2
                rounded
              "
            />

            <input
              value={editSong.appleMusicUrl || ""}
              onChange={(e) =>
                setEditSong({
                  ...editSong,
                  appleMusicUrl: e.target.value,
                })
              }
              placeholder="Apple Music URL"
              className="
                w-full
                border
                px-3 py-2
                rounded
              "
            />

            <input
              value={editSong.soundcloudUrl || ""}
              onChange={(e) =>
                setEditSong({
                  ...editSong,
                  soundcloudUrl: e.target.value,
                })
              }
              placeholder="SoundCloud URL"
              className="
                w-full
                border
                px-3 py-2
                rounded
              "
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditSong(null)}
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
                onClick={handleUpdateSong}
                className="
                  bg-black
                  text-white
                  px-4 py-2
                  rounded
                  cursor-pointer
                "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import AdminGalleryPreview from "./AdminGalleryPreview";
import AdminGalleryEdit from "./AdminGalleryEdit";
import { Loader2 } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  order?: number;
}

interface Gallery {
  id: string;
  title: string;
  venue: string;
  images: GalleryImage[];
}

export default function AdminGalleryPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  /* ================= UPLOAD STATE ================= */
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LIST STATE ================= */
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  /* ================= MODAL STATE ================= */
  const [preview, setPreview] = useState<Gallery | null>(null);
  const [edit, setEdit] = useState<Gallery | null>(null);

  /* ================= FETCH ================= */
  const fetchGallery = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();

      const normalized: Gallery[] = data.map((g: any) => ({
        ...g,
        images: Array.isArray(g.images) ? g.images : [],
      }));

      setGalleries(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* ================= UPLOAD ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || images.length === 0) {
      setError("Judul, venue, dan gambar wajib diisi");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("venue", venue);
      images.forEach((img) => formData.append("images", img));

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      setTitle("");
      setVenue("");
      setImages([]);
      fetchGallery();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE GALLERY ================= */
  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Yakin hapus seluruh gallery ini?")) return;

    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) fetchGallery();
  };

  return (
    <div className="space-y-12">
      {/* ================= UPLOAD ================= */}
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Upload Gallery Konser</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />

          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => setImages(Array.from(e.target.files || []))}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed text-sm py-3 rounded hover:border-black cursor-pointer"
          >
            {images.length > 0
              ? `${images.length} gambar dipilih`
              : "+ Pilih gambar (boleh lebih dari satu gambar)"}
          </button>

          <button
            disabled={uploading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* ================= LIST ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">Manajemen Gallery</h2>

        {loadingList && (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Loading Data
          </span>
        )}

        <div className="space-y-4">
          {galleries.map((g) => (
            <div
              key={g.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">{g.title}</p>
                <p className="text-sm text-gray-500">{g.venue}</p>
                <p className="text-sm">{g.images.length} gambar</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreview(g)}
                  className="h-9 px-3 mt-4 flex items-center justify-center text-sm bg-[#001BB7] text-white hover:bg-[#0046FF] text-shadow-lg/40
                                rounded
                                cursor-pointer"
                >
                  Preview
                </button>

                <button
                  onClick={() => setEdit(g)}
                  className="h-9 px-5 mt-4 flex items-center justify-center text-sm bg-[#F3B800] hover:bg-[#FFE52A] text-white text-shadow-lg/40
                              rounded
                              cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteGallery(g.id)}
                  className="h-9 px-3 mt-4 flex items-center justify-center text-sm bg-red-600 hover:bg-[#FF4646] text-white text-shadow-lg/40
                              rounded
                              cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {preview && (
        <AdminGalleryPreview
          gallery={preview}
          onClose={() => setPreview(null)}
        />
      )}
      {edit && (
        <AdminGalleryEdit
          gallery={edit}
          onClose={() => setEdit(null)}
          onUpdated={fetchGallery}
        />
      )}
    </div>
  );
}

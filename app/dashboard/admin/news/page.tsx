"use client";

import { useEffect, useRef, useState } from "react";
import AdminNewsPreview from "./AdminNewsPreview";
import AdminNewsEdit from "./AdminNewsEdit";
import { Loader2 } from "lucide-react";

interface NewsList {
  id: number;
  title: string;
  excerpt?: string;
}

export default function AdminNewsPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  /* ================= CREATE STATE ================= */
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  /* ================= LIST STATE ================= */
  const [list, setList] = useState<NewsList[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= MODAL STATE ================= */
  const [preview, setPreview] = useState<any>(null);
  const [edit, setEdit] = useState<any>(null);

  /* ================= FETCH ================= */
  const fetchNews = async () => {
    setLoading(true);
    const res = await fetch("/api/news", { cache: "no-store" });
    const data = await res.json();
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* ================= CREATE ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("excerpt", excerpt);
    fd.append("content", content);

    if (buttonLabel && buttonUrl) {
      fd.append("buttonLabel", buttonLabel);
      fd.append("buttonUrl", buttonUrl);
    }

    images.forEach((img) => fd.append("images", img));

    await fetch("/api/news", {
      method: "POST",
      body: fd,
    });

    setTitle("");
    setExcerpt("");
    setContent("");
    setButtonLabel("");
    setButtonUrl("");
    setImages([]);

    fetchNews();
    setUploading(false);
  };

  /* ================= ACTIONS ================= */
  const openPreview = async (id: number) => {
    const res = await fetch(`/api/news/${id}`);
    setPreview(await res.json());
  };

  const openEdit = async (id: number) => {
    const res = await fetch(`/api/news/${id}`);
    setEdit(await res.json());
  };

  const remove = async (id: number) => {
    if (!confirm("Yakin hapus news ini?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    fetchNews();
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-12">
      {/* ================= CREATE FORM ================= */}
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Tambah News</h1>

        <form
          onSubmit={submit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full border rounded px-3 py-2"
            rows={2}
            placeholder="Excerpt (opsional)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <textarea
            className="w-full border rounded px-3 py-2"
            rows={5}
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Button Label (opsional)"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Button URL (opsional)"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
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
            className="w-full border-2 border-dashed py-3 text-sm cursor-pointer"
          >
            {images.length
              ? `${images.length} gambar dipilih`
              : "+ Pilih gambar"}
          </button>

          <button
            disabled={uploading}
            className="bg-black text-white px-4 py-2 rounded cursor-pointer"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* ================= LIST ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">Manajemen News</h2>

        {loading && (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Loading Data
          </span>
        )}

        <div className="space-y-4">
          {list.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">{n.title}</p>
                {n.excerpt && (
                  <p className="text-sm text-gray-500">{n.excerpt}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openPreview(n.id)}
                  className="h-9 px-3 mt-1 flex items-center justify-center
                             text-sm
                             bg-[#001BB7] text-white text-shadow-lg/40
                             rounded
                             cursor-pointer
                             hover:bg-[#0046FF]"
                >
                  Preview
                </button>

                <button
                  onClick={() => openEdit(n.id)}
                  className="h-9 px-5 mt-1 flex items-center justify-center
                             text-sm
                             bg-[#F3B800] hover:bg-[#FFE52A] text-white text-shadow-lg/40
                             rounded
                             cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => remove(n.id)}
                  className="h-9 px-3 mt-1 flex items-center justify-center
                             text-sm
                             bg-red-600 hover:bg-[#FF4646] text-white text-shadow-lg/40
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
        <AdminNewsPreview
          news={preview}
          onClose={() => setPreview(null)}
        />
      )}

      {edit && (
        <AdminNewsEdit
          news={edit}
          onClose={() => setEdit(null)}
          onUpdated={fetchNews}
        />
      )}
    </div>
  );
}

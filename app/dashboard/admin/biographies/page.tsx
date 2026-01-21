"use client";

import { useEffect, useRef, useState } from "react";
import AdminBiographyPreview from "./AdminBiographyPreview";
import AdminBiographyEdit from "./AdminBiographyEdit";
import { Loader2 } from "lucide-react";

interface Biography {
  id: number;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export default function AdminBiographiesPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  /* ================= CREATE STATE ================= */
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LIST STATE ================= */
  const [list, setList] = useState<Biography[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= MODAL STATE ================= */
  const [preview, setPreview] = useState<Biography | null>(null);
  const [edit, setEdit] = useState<Biography | null>(null);

  /* ================= FETCH ================= */
  const fetchBiographies = async () => {
    setLoading(true);
    const res = await fetch("/api/biographies");
    const data = await res.json();
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBiographies();
  }, []);

  /* ================= CREATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !role || !bio) {
      setError("Nama, role, dan bio wajib diisi");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("bio", bio);
    if (image) formData.append("image", image);

    await fetch("/api/biographies", {
      method: "POST",
      body: formData,
    });

    setName("");
    setRole("");
    setBio("");
    setImage(null);
    fetchBiographies();
    setUploading(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus biography ini?")) return;
    await fetch(`/api/biographies/${id}`, { method: "DELETE" });
    fetchBiographies();
  };

  return (
    <div className="space-y-12">
      {/* ================= CREATE FORM ================= */}
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Tambah Biography</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Bio singkat"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed py-3 text-sm cursor-pointer"
          >
            {image ? image.name : "+ Pilih Foto"}
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
        <h2 className="text-xl font-bold mb-4">Manajemen Biographies</h2>

        {loading && (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Loading Data
          </span>
        )}

        <div className="space-y-4">
          {list.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm text-gray-500">{b.role}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreview(b)}
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
                  onClick={() => setEdit(b)}
                  className="h-9 px-5 mt-1 flex items-center justify-center
                              text-sm
                              bg-[#F3B800] hover:bg-[#FFE52A] text-white text-shadow-lg/40
                              rounded
                              cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(b.id)}
                  className="h-9 px-3 mt-1 
                              flex items-center justify-center
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
        <AdminBiographyPreview
          biography={preview}
          onClose={() => setPreview(null)}
        />
      )}

      {edit && (
        <AdminBiographyEdit
          biography={edit}
          onClose={() => setEdit(null)}
          onUpdated={fetchBiographies}
        />
      )}
    </div>
  );
}

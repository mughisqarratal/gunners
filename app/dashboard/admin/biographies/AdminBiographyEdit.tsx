"use client";

import { useRef, useState } from "react";

export default function AdminBiographyEdit({
  biography,
  onClose,
  onUpdated,
}: any) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(biography.name);
  const [role, setRole] = useState(biography.role);
  const [bio, setBio] = useState(biography.bio);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("bio", bio);
    if (image) formData.append("image", image);

    await fetch(`/api/biographies/${biography.id}`, {
      method: "PUT",
      body: formData,
    });

    setSaving(false);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold">Edit Biography</h2>

        <input
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          className="w-full border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* INPUT FILE ASLI (HIDDEN) */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        {/* BUTTON CUSTOM (STYLE TIDAK DIUBAH) */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed py-3 text-sm cursor-pointer text-center"
        >
          {image ? image.name : "+ Ganti dengan gambar lain"}
        </button>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border rounded px-2"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

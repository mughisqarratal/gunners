"use client";

import { useState } from "react";

export default function AdminGalleryPreview({
  gallery,
  onClose,
}: {
  gallery: any;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);

  if (!Array.isArray(gallery.images) || gallery.images.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded max-w-xl w-full text-center">
        <img
          src={gallery.images[active].url}
          className="w-full h-80 object-contain"
        />

        <div className="flex gap-2 justify-center mt-3">
          {gallery.images.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                i === active ? "bg-black" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-20 py-1 bg-[#57564F] text-white rounded cursor-pointer hover:bg-black"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

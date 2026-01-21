"use client";

import { useState } from "react";

export default function PersonelCard({ personel }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      <img
        src={personel.image}
        alt={personel.name}
        className="mx-auto w-full max-w-xs aspect-square object-cover mb-4"
      />

      <h3 className="font-bold">{personel.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{personel.role}</p>

      <p className={`text-gray-700 ${!open && "line-clamp-3"}`}>
        {personel.bio}
      </p>

      {personel.bio.length > 150 && (
        <button
          onClick={() => setOpen(!open)}
          className="mt-2 text-sm font-semibold underline cursor-pointer"
        >
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {oswald, openSans} from "@/app/fonts";

export default function PersonelCard({ personel }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      <img
        src={personel.image}
        alt={personel.name}
        className="mx-auto w-full max-w-xs aspect-square object-cover mb-4 border-2 border-[#F3B800]"
      />

      <h3 className={`${oswald.className} text-xl font-semibold text-gray-300`}>{personel.name}</h3>
      <p className={`${openSans.className} text-sm font-bold text-gray-500 mb-3 mt-2`}>{personel.role}</p>

      <p className={`${openSans.className} text-gray-300 text-justify ${!open && "line-clamp-3"}`}>
        {personel.bio}
      </p>

      {personel.bio.length > 150 && (
        <button
          onClick={() => setOpen(!open)}
          className={`${openSans.className} mt-2 text-[#F3B800] text-sm font-bold hover:underline cursor-pointer`}
        >
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {bebas, oswald, openSans} from "@/app/fonts";

export default function PersonelCard({ personel }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      <img
        src={personel.image}
        alt={personel.name}
        className="mx-auto w-full max-w-xs aspect-square object-cover mb-4 "
      />

      <h3 className={`${oswald.className} text-xl font-semibold`}>{personel.name}</h3>
      <p className={`${openSans.className} text-sm font-bold text-gray-700 mb-3`}>{personel.role}</p>

      <p className={`${openSans.className} text-gray-700 text-justify ${!open && "line-clamp-3"}`}>
        {personel.bio}
      </p>

      {personel.bio.length > 150 && (
        <button
          onClick={() => setOpen(!open)}
          className={`${openSans.className} mt-2 text-blue-800 text-sm font-bold underline cursor-pointer`}
        >
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

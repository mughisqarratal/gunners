"use client";

import { oswald } from "@/app/fonts";

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-[#ffffff] py-6 mt-auto border-t border-[#f3b800]">
      <div className="container mx-auto text-center px-auto py-1.5">
        <p
          className={`
    ${oswald.className}
    text-sm sm:text-base
    bg-linear-to-b
    from-[#DC0000]
    via-[#F56A00]
    to-[#F3B800]
    bg-clip-text
    text-transparent
  `}
        >
          &copy; {new Date().getFullYear()} Guns N' Roses ID
        </p>
      </div>
    </footer>
  );
}

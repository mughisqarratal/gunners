"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function GalleryLightbox({
  images,
}: {
  images: string[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const startX = useRef<number | null>(null);

  if (!images || images.length === 0) return null;

  /* ================= SWIPE (MOBILE) ================= */
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || activeIndex === null) return;

    const diff = startX.current - e.changedTouches[0].clientX;
    const threshold = 50;

    if (diff > threshold && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (diff < -threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }

    startX.current = null;
  };

  /* ================= KEYBOARD (DESKTOP) ================= */
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && activeIndex < images.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, images.length]);

  return (
    <>
      {/* ================= GRID GALLERY (STYLE LAMA) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="relative w-full aspect-video md:aspect-square overflow-hidden focus:outline-none"
          >
            <Image
              src={img}
              alt="Gallery"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </button>
        ))}
      </div>

      {/* ================= LIGHTBOX ================= */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-[92vw] h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* CLOSE BUTTON (KIRI ATAS) */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-30 lg:top-0 lg:left-15 z-50 text-white bg-black w-10 h-10 rounded flex items-center justify-center text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* ARROW LEFT – DESKTOP ONLY */}
            {activeIndex > 0 && (
              <button
                onClick={() => setActiveIndex(activeIndex - 1)}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-40 text-white bg-black w-10 h-10 rounded-full items-center justify-center text-2xl cursor-pointer"
              >
                ‹
              </button>
            )}

            {/* ARROW RIGHT – DESKTOP ONLY */}
            {activeIndex < images.length - 1 && (
              <button
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-40 text-white bg-black/60 w-10 h-10 rounded-full items-center justify-center text-2xl"
              >
                ›
              </button>
            )}

            {/* IMAGE */}
            <Image
              src={images[activeIndex]}
              alt="Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

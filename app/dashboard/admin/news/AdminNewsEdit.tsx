"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ================= SORTABLE IMAGE ================= */
function SortableImage({ img, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: img.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="relative"
    >
      {/* DRAG HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-move"
      >
        <img src={img.image} className="rounded" />
      </div>

      {/* DELETE BUTTON */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // 🔑 INI KUNCI
          onDelete(img.id);
        }}
        className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full z-10"
      >
        ✕
      </button>
    </div>
  );
}


/* ================= MAIN COMPONENT ================= */
export default function AdminNewsEdit({ news, onClose, onUpdated }: any) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(news.title);
  const [excerpt, setExcerpt] = useState(news.excerpt || "");
  const [content, setContent] = useState(news.content || "");

  const [images, setImages] = useState(news.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [buttonLabel, setButtonLabel] = useState(news.button?.label || "");
  const [buttonUrl, setButtonUrl] = useState(news.button?.url || "");
  const [removeButton, setRemoveButton] = useState(false);

  /* ================= DELETE IMAGE ================= */
  const deleteImage = async (imageId: number) => {
    if (!confirm("Hapus gambar ini?")) return;

    await fetch(`/api/news/${news.id}/image`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });

    setImages((prev: any[]) => prev.filter((img) => img.id !== imageId));

    router.refresh();
  };

  /* ================= DRAG END ================= */
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i: any) => i.id === active.id);
    const newIndex = images.findIndex((i: any) => i.id === over.id);

    const newOrder = arrayMove(images, oldIndex, newIndex);
    setImages(newOrder);

    await fetch(`/api/news/${news.id}/image`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orders: newOrder.map((img: any, idx: number) => ({
          id: img.id,
          order: idx,
        })),
      }),
    });
  };

  /* ================= SUBMIT ================= */
  const submit = async (e: any) => {
    e.preventDefault();

    // UPDATE TEXT + BUTTON
    await fetch(`/api/news/${news.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt,
        content,
        button: removeButton
          ? null
          : buttonLabel && buttonUrl
          ? { label: buttonLabel, url: buttonUrl }
          : null,
      }),
    });

    // UPLOAD NEW IMAGES
    if (newImages.length) {
      const fd = new FormData();
      newImages.forEach((img) => fd.append("images", img));

      await fetch(`/api/news/${news.id}/image`, {
        method: "POST",
        body: fd,
      });
    }

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4"
      >
        <h2 className="text-2xl font-bold">Edit News</h2>

        <input
          className="border px-3 py-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border px-3 py-2 w-full"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        <textarea
          className="border px-3 py-2 w-full"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* IMAGES */}
        {images.length > 0 && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i: any) => i.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-3">
                {images.map((img: any) => (
                  <SortableImage
                    key={img.id}
                    img={img}
                    onDelete={deleteImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* ADD NEW IMAGES */}
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => setNewImages(Array.from(e.target.files || []))}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed py-3 text-sm cursor-pointer"
        >
          {newImages.length
            ? `${newImages.length} gambar dipilih`
            : "+ Tambah gambar"}
        </button>

        {/* BUTTON */}
        <div className="border-t pt-4 space-y-2">
          <h3 className="font-semibold">Button</h3>

          <input
            className="border px-3 py-2 w-full"
            placeholder="Label"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            disabled={removeButton}
          />

          <input
            className="border px-3 py-2 w-full"
            placeholder="URL"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            disabled={removeButton}
          />

          {news.button && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={removeButton}
                onChange={(e) => setRemoveButton(e.target.checked)}
              />
              Hapus button
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button className="bg-black text-white px-5 py-2 rounded cursor-pointer">
            Save
          </button>
          <button type="button" onClick={onClose} className="cursor-pointer border px-5 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryImage {
  id: string;
  url: string;
  order?: number;
}

function SortableImage({
  img,
  onDelete,
}: {
  img: GalleryImage;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="relative group border rounded overflow-hidden"
      {...attributes}
      {...listeners}
    >
      <img src={img.url} className="object-cover aspect-square cursor-move" />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(img.id);
        }}
        className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

export default function AdminGalleryEdit({
  gallery,
  onClose,
  onUpdated,
}: {
  gallery: any;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(gallery.title);
  const [venue, setVenue] = useState(gallery.venue);
  const [images, setImages] = useState<GalleryImage[]>(
    Array.isArray(gallery.images) ? gallery.images : []
  );
  const [newImages, setNewImages] = useState<File[]>([]);

  const deleteImage = async (id: string) => {
    if (!confirm("Hapus gambar ini?")) return;

    const res = await fetch(`/api/gallery/${gallery.id}/image`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: id }),
    });

    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const newOrder = arrayMove(images, oldIndex, newIndex);
    setImages(newOrder);

    await fetch(`/api/gallery/${gallery.id}/image`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orders: newOrder.map((img, idx) => ({ id: img.id, order: idx })),
      }),
    });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("venue", venue);
    newImages.forEach((img) => formData.append("images", img));

    await fetch(`/api/gallery/${gallery.id}`, {
      method: "PUT",
      body: formData,
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-lg w-full space-y-4">
        <h3 className="font-bold text-lg">Edit Gallery</h3>

        <input
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        {images.length > 0 && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
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

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-black text-white rounded cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

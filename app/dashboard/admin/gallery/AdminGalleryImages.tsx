"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface GalleryImage {
  id: number;
  url: string;
  order: number;
}

interface Props {
  galleryId: number;
  images: GalleryImage[];
  onUpdated?: () => void;
}

function SortableImage({ img, onDelete }: { img: GalleryImage; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="relative group border rounded overflow-hidden"
      {...attributes}
      {...listeners}
    >
      <img src={img.url} className="object-cover aspect-square cursor-move" />
      <button
        onClick={() => onDelete(img.id)}
        className="
          absolute top-1 right-1
          bg-black/70 text-white
          w-7 h-7 rounded-full
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition
          cursor-pointer
        "
      >
        ✕
      </button>
    </div>
  );
}

export default function AdminGalleryImages({ galleryId, images, onUpdated }: Props) {
  const [items, setItems] = useState<GalleryImage[]>(images);

  const handleDeleteImage = async (id: number) => {
    if (!confirm("Hapus gambar ini?")) return;

    const res = await fetch(`/api/gallery/${galleryId}/image`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: id }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((img) => img.id !== id));
      if (onUpdated) onUpdated();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);

    setItems(newOrder);

    // Update order ke API
    await fetch(`/api/gallery/${galleryId}/image`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orders: newOrder.map((img, idx) => ({ id: img.id, order: idx })),
      }),
    });

    if (onUpdated) onUpdated();
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((img) => (
            <SortableImage key={img.id} img={img} onDelete={handleDeleteImage} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const gallery = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [selected, setSelected] = useState(gallery[0] || "");

  if (!gallery.length) {
    return <div className="aspect-square rounded-lg bg-pink-50 shadow-soft" />;
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-pink-50 shadow-soft">
        <Image src={selected || gallery[0]} alt={name} fill priority className="object-cover" />
      </div>
      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show product image ${index + 1}`}
              onClick={() => setSelected(image)}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-pink-50 ${
                selected === image ? "border-berry ring-2 ring-berry/20" : "border-pink-100"
              }`}
            >
              <Image src={image} alt={`${name} thumbnail ${index + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

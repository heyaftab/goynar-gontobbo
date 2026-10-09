"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.length ? images : ["/jewellery-placeholder.svg"];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-cream">
        <Image src={activeImage} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
      </div>
      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2" aria-label={`${name} images`}>
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative aspect-square overflow-hidden border bg-cream ${activeImage === image ? "border-gold ring-1 ring-gold" : "border-border hover:border-gold/60"}`}
              aria-label={`Show image ${index + 1} of ${name}`}
              aria-pressed={activeImage === image}
            >
              <Image src={image} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

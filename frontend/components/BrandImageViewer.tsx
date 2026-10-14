"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const brandImage = "/assets/GoynarGontobboBrandImage.png";

export function BrandImage({
  alt = "Goynar Gontobbo",
  className,
  width,
  height,
  priority,
}: {
  alt?: string;
  className: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnScroll = () => setIsOpen(false);
    const closeOnKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("scroll", closeOnScroll, { passive: true });
    window.addEventListener("keydown", closeOnKeyDown);
    return () => {
      window.removeEventListener("scroll", closeOnScroll);
      window.removeEventListener("keydown", closeOnKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cursor-zoom-in rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label="View the Goynar Gontobbo brand image"
      >
        <Image src={brandImage} alt={alt} width={width} height={height} priority={priority} className={className} />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/80 p-4 sm:p-8"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src={brandImage}
            alt="Goynar Gontobbo brand image"
            width={1254}
            height={1254}
            priority
            className="max-h-[90vh] max-w-[min(90vw,90vh)] cursor-default object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <span className="sr-only">Click outside the image, scroll, or press Escape to close.</span>
        </div>
      )}
    </>
  );
}

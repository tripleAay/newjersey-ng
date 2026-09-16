"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export default function ProductGallery({
  name,
  images,
}: ProductGalleryProps) {
  const safeImages = images.filter(Boolean);

  const [activeImage, setActiveImage] = useState(
    safeImages[0] ?? ""
  );

  if (!activeImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-[#f3f3f1] text-sm text-[#999]">
        Product image coming soon
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f5f5f3]">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6 sm:p-10"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((image, index) => {
            const active = image === activeImage;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-[#f5f5f3] transition ${
                  active
                    ? "border-[#FF6B00]"
                    : "border-black/10 hover:border-black/30"
                }`}
              >
                <Image
                  src={image}
                  alt={`${name} view ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MAX_IMAGES = 4;
const MAX_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProductImageUpload() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const form = containerRef.current?.closest("form");

    function preventEarlySave(event: Event) {
      if (!busyRef.current) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      setError("Wait for all images to finish uploading before saving.");
    }

    form?.addEventListener("submit", preventEarlySave, true);

    return () => {
      form?.removeEventListener("submit", preventEarlySave, true);
    };
  }, []);

  async function uploadFiles(files: File[]) {
    if (busyRef.current || files.length === 0) return;

    setError("");

    const available = MAX_IMAGES - images.length;

    if (files.length > available) {
      setError(
        `You can add ${available} more ${
          available === 1 ? "image" : "images"
        }. Maximum four per product.`
      );
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`${file.name}: choose a JPG, PNG or WebP image.`);
        return;
      }

      if (file.size === 0 || file.size > MAX_SIZE) {
        setError(`${file.name}: use an image up to 4 MB.`);
        return;
      }
    }

    busyRef.current = true;
    setUploading(true);

    let completed = 0;

    try {
      for (const file of files) {
        setProgress(`Uploading ${completed + 1} of ${files.length}…`);

        const formData = new FormData();
        formData.set("file", file);

        const response = await fetch("/api/admin/product-images", {
          method: "POST",
          body: formData,
          credentials: "same-origin",
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error(
            `Upload endpoint returned HTTP ${response.status} instead of JSON. Check app/api/admin/product-images/route.ts and the development terminal.`
          );
        }

        const result = await response.json();

        if (!response.ok || typeof result.url !== "string") {
          throw new Error(
            typeof result.error === "string"
              ? result.error
              : "The image could not be uploaded."
          );
        }

        setImages((current) => [...current, result.url]);
        completed += 1;
      }

      setProgress(
        `${completed} ${completed === 1 ? "image" : "images"} uploaded.`
      );
    } catch (caught) {
      setProgress(
        completed > 0
          ? `${completed} ${
              completed === 1 ? "image was" : "images were"
            } uploaded before the error.`
          : ""
      );

      setError(
        caught instanceof Error
          ? caught.message
          : "Upload failed. Please try again."
      );
    } finally {
      busyRef.current = false;
      setUploading(false);
    }
  }

  function makeMain(index: number) {
    setImages((current) => [
      current[index],
      ...current.filter((_, position) => position !== index),
    ]);
  }

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium">Product images</p>

        <span className="text-xs text-[#625D55]">
          {images.length} / {MAX_IMAGES}
        </span>
      </div>

      <label className="mt-3 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/20 bg-white px-5 py-6 text-center focus-within:ring-2 focus-within:ring-[#181818] focus-within:ring-offset-2">
        <span className="text-sm font-semibold">
          {uploading ? "Uploading your images…" : "Choose product images"}
        </span>

        <span className="mt-2 text-xs leading-5 text-[#625D55]">
          Select up to four images. JPG, PNG or WebP, up to 4 MB each.
        </span>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading || images.length >= MAX_IMAGES}
          aria-label="Choose up to four product images"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";

            void uploadFiles(files);
          }}
          className="sr-only"
        />
      </label>

      <input
        type="hidden"
        name="image_urls"
        value={images.join("\n")}
      />

      {progress && (
        <p role="status" className="mt-3 text-sm text-[#625D55]">
          {progress}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((url, index) => (
              <div key={url} className="min-w-0">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F4F1E9]">
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 160px"
                    className="object-contain"
                  />
                </div>

                <div className="mt-2">
                  {index === 0 ? (
                    <span className="inline-flex min-h-11 items-center text-xs font-semibold">
                      Main image
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => makeMain(index)}
                      className="min-h-11 text-xs font-medium hover:underline disabled:opacity-50"
                    >
                      Make main
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => {
                      setImages((current) =>
                        current.filter((image) => image !== url)
                      );
                      setProgress("");
                    }}
                    className="block min-h-11 text-xs text-[#625D55] hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs leading-5 text-[#625D55]">
            Your main image appears on the product tile. The remaining
            images form the product gallery.
          </p>
        </>
      )}
    </div>
  );
}
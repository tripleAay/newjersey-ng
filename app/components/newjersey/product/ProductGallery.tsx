"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageOff,
  X,
} from "lucide-react";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

const controlClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#181818] shadow-sm transition hover:bg-[#F58220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 motion-reduce:transition-none";

function GalleryImage({
  src,
  alt,
  fullscreen = false,
  priority = false,
}: {
  src: string;
  alt: string;
  fullscreen?: boolean;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-[#625D55]">
        <ImageOff size={28} strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm">This image is unavailable.</p>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-[#EAE5DA] motion-reduce:animate-none"
        />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={
          fullscreen
            ? "100vw"
            : "(max-width: 1023px) 92vw, (max-width: 1535px) 50vw, 700px"
        }
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={[
          "object-contain transition-opacity duration-300 motion-reduce:transition-none",
          fullscreen ? "p-4 sm:p-8" : "p-5 sm:p-8",
          loaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </>
  );
}

export default function ProductGallery(
  props: ProductGalleryProps
) {
  const images = Array.from(
    new Set(
      props.images
        .filter(
          (image) =>
            typeof image === "string" &&
            image.trim().length > 0
        )
        .map((image) => image.trim())
    )
  );

  // Reset gallery state when the product or its images change.
  return (
    <GalleryContent
      key={JSON.stringify([props.name, images])}
      name={props.name}
      images={images}
    />
  );
}

function GalleryContent({
  name,
  images,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const count = images.length;
  const activeImage = images[activeIndex];
  const hasMultiple = count > 1;

  function move(direction: number) {
    if (count < 2) return;

    setActiveIndex(
      (current) => (current + direction + count) % count
    );
  }

  function handleKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (!hasMultiple) return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        move(1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(count - 1);
        break;
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }

    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStart.current;
    touchStart.current = null;

    if (!start || event.changedTouches.length === 0) return;

    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;

    if (
      Math.abs(deltaX) > 50 &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.5
    ) {
      move(deltaX < 0 ? 1 : -1);
    }
  }

  useEffect(() => {
    const thumbnail = thumbnailRefs.current[activeIndex];
    const strip = thumbnail?.parentElement;

    if (!thumbnail || !strip) return;

    const left = thumbnail.offsetLeft;
    const right = left + thumbnail.offsetWidth;

    if (left < strip.scrollLeft) {
      strip.scrollLeft = left;
    } else if (right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollLeft = right - strip.clientWidth;
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!viewerOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [viewerOpen]);

  if (!activeImage) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[28px] border border-black/10 bg-[#EDE8DE] px-6 text-center text-[#625D55]">
        <ImageOff size={30} strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm">Product images coming soon.</p>
      </div>
    );
  }

  const imageAlt = `${name} — view ${activeIndex + 1} of ${count}`;

  return (
    <section
      aria-label={`${name} image gallery`}
      onKeyDown={handleKeyboard}
      className="min-w-0"
    >
      <div
        className="relative isolate aspect-square overflow-hidden rounded-[28px] border border-black/10 bg-[#EDE8DE]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
      >
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          aria-label={`Open larger image of ${name}`}
          aria-haspopup="dialog"
          className="absolute inset-0 cursor-zoom-in rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220]"
        >
          <GalleryImage
            key={activeImage}
            src={activeImage}
            alt={imageAlt}
            priority
          />
        </button>

        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[11px] font-semibold text-[#625D55]">
            Product gallery
          </span>

          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            aria-label="Open fullscreen gallery"
            aria-haspopup="dialog"
            className={`${controlClass} pointer-events-auto`}
          >
            <Expand size={17} aria-hidden="true" />
          </button>
        </div>

        {hasMultiple && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous image"
              className={`${controlClass} pointer-events-auto`}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>

            <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold tabular-nums text-[#181818]">
              {activeIndex + 1} / {count}
            </span>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next image"
              className={`${controlClass} pointer-events-auto`}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {hasMultiple && (
        <div
          aria-label="Choose a product image"
          className="relative mt-4 flex gap-3 overflow-x-auto px-1 pb-3 pt-1"
        >
          {images.map((image, index) => (
            <button
              key={image}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${name}, view ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={[
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-[#EDE8DE] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1E9] motion-reduce:transition-none sm:h-24 sm:w-24",
                index === activeIndex
                  ? "border-[#F58220] ring-1 ring-[#F58220]"
                  : "border-black/10 hover:border-[#F58220]/60",
              ].join(" ")}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Showing {name}, image {activeIndex + 1} of {count}.
      </p>

      <p className="mt-3 text-center text-xs text-[#625D55]">
        Tap the image for a closer look.
        {hasMultiple && " Swipe or use the arrows to explore."}
      </p>

      <dialog
        ref={dialogRef}
        aria-label={`${name} fullscreen gallery`}
        onCancel={() => setViewerOpen(false)}
        onClose={() => setViewerOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setViewerOpen(false);
          }
        }}
        className="fixed inset-0 m-auto h-[92dvh] max-h-none w-[96vw] max-w-[1440px] overflow-hidden rounded-2xl border border-black/10 bg-[#F4F1E9] p-0 text-[#181818] shadow-2xl backdrop:bg-black/70"
      >
        {viewerOpen && (
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-black/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {name}
                </p>
                <p className="mt-1 text-xs text-[#625D55]">
                  View {activeIndex + 1} of {count}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setViewerOpen(false)}
                aria-label="Close fullscreen gallery"
                className={controlClass}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => {
                touchStart.current = null;
              }}
            >
              <GalleryImage
                key={`fullscreen-${activeImage}`}
                src={activeImage}
                alt={imageAlt}
                fullscreen
              />
            </div>

            {hasMultiple && (
              <div className="flex shrink-0 items-center justify-center gap-6 border-t border-black/10 px-4 py-3">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous image"
                  className={controlClass}
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>

                <span className="text-xs font-semibold tabular-nums">
                  {activeIndex + 1} / {count}
                </span>

                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next image"
                  className={controlClass}
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
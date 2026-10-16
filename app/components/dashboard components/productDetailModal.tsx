"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { X, Star } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type { AppProduct } from "@/app/types/product";

type Props = {
  product: AppProduct | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (product: AppProduct) => void;
};

type Specification = {
  label: string;
  value: string;
};

function getSpecifications(product: AppProduct): Specification[] {
  if (!("specs" in product) || !Array.isArray(product.specs)) {
    return [];
  }

  const specifications: Specification[] = [];

  for (const entry of product.specs) {
    if (
      typeof entry !== "object" ||
      entry === null ||
      !("label" in entry) ||
      !("value" in entry) ||
      typeof entry.label !== "string" ||
      (typeof entry.value !== "string" &&
        typeof entry.value !== "number")
    ) {
      continue;
    }

    specifications.push({
      label: entry.label,
      value: String(entry.value),
    });
  }

  return specifications;
}

function formatPrice(price: AppProduct["price"]): string {
  if (typeof price === "string") {
    return price;
  }

  if (typeof price === "number" && Number.isFinite(price)) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(price);
  }

  return "Contact us for pricing";
}

export default function ProductDetailModal({
  product,
  open,
  onClose,
  onAddToCart,
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id, open]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!mounted || !open || !product || !dialog) {
      return;
    }

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    if (!dialog.open) {
      dialog.showModal();
    }

    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      }

      document.body.style.overflow = previousOverflow;

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, [mounted, open, product?.id]);

  if (!mounted || !open || !product) {
    return null;
  }

  const images = Array.from(
    new Set(
      [product.image, ...(product.images ?? [])].filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
    )
  );

  const mainImage = images[activeIndex] ?? images[0];
  const specifications = getSpecifications(product);

  const rating =
    typeof product.rating === "number" &&
    Number.isFinite(product.rating)
      ? Math.min(5, Math.max(0, product.rating))
      : 0;

  const reviewCount =
    typeof product.reviewsCount === "number" &&
    Number.isFinite(product.reviewsCount)
      ? Math.max(0, Math.floor(product.reviewsCount))
      : 0;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const bounds = event.currentTarget.getBoundingClientRect();

        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-black/10 bg-white p-0 text-[#181818] shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-5 sm:p-8">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#625D55] transition-colors hover:bg-[#FCFBF8] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="grid gap-7 pt-10 md:grid-cols-2 md:items-start">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F6F6F3]">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 350px"
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-5 text-center text-sm text-[#625D55]">
                  Product image unavailable.
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div
                aria-label="Product images"
                className="mt-3 flex flex-wrap gap-2"
              >
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show image ${index + 1} of ${product.name}`}
                    aria-pressed={activeIndex === index}
                    className={[
                      "relative h-16 w-16 overflow-hidden rounded-lg border bg-[#F6F6F3]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]",
                      activeIndex === index
                        ? "border-[#181818]"
                        : "border-black/10 hover:border-black/40",
                    ].join(" ")}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2
              id={titleId}
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {product.name}
            </h2>

            {reviewCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  aria-label={`${rating} out of 5 stars`}
                  className="inline-flex gap-1"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={14}
                      aria-hidden="true"
                      className={
                        index < Math.round(rating)
                          ? "fill-[#F58220] text-[#F58220]"
                          : "text-neutral-300"
                      }
                    />
                  ))}
                </span>

                <span className="text-xs text-[#625D55]">
                  {reviewCount.toLocaleString("en-NG")}{" "}
                  {reviewCount === 1 ? "rating" : "ratings"}
                </span>
              </div>
            )}

            {product.description && (
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#625D55]">
                {product.description}
              </p>
            )}

            {specifications.length > 0 && (
              <dl className="mt-5 space-y-3 border-t border-black/10 pt-5">
                {specifications.map((specification, index) => (
                  <div
                    key={`${specification.label}-${index}`}
                    className="grid grid-cols-2 gap-3 text-sm"
                  >
                    <dt className="text-[#625D55]">
                      {specification.label}
                    </dt>

                    <dd className="break-words font-medium">
                      {specification.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="mt-6 text-2xl font-semibold tracking-tight">
              {formatPrice(product.price)}
            </p>

            {onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181818] focus-visible:ring-offset-2"
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
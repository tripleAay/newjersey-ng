import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { products } from "@/app/data/newjersey/products";
import type { NewJerseyProduct } from "@/app/types/commerce";

const statusLabels: Record<NewJerseyProduct["status"], string> = {
  available: "Available",
  "made-to-order": "Made to order",
  custom: "Custom",
  "pre-order": "Pre-order",
};

function productHref(product: NewJerseyProduct): string {
  const slug = encodeURIComponent(product.slug);

  switch (product.category) {
    case "print":
      return `/shop/print/${slug}`;

    case "apparel":
      return slug === "custom-jerseys"
        ? "/shop/jerseys"
        : `/shop/custom/${slug}`;

    default:
      return "/shop/quote";
  }
}

function priceLabel(product: NewJerseyProduct): string {
  const { type, basePrice } = product.pricing;

  if (
    type === "quote" ||
    typeof basePrice !== "number" ||
    !Number.isFinite(basePrice) ||
    basePrice < 0
  ) {
    return "Request a quote";
  }

  const amount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(basePrice);

  return type === "starting-from" ? `From ${amount}` : amount;
}

export default function ProductTileGrid() {
  const visibleProducts = products.filter(
    (product) => product.published !== false,
  );

  if (visibleProducts.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-white p-6 text-sm text-[#625D55]">
        Products will appear here when available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {visibleProducts.map((product) => {
        const href = productHref(product);

        return (
          <article
            key={product.id}
            className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-black/10 bg-white text-[#181818]"
          >
            <Link
              href={href}
              aria-label={`View ${product.name}`}
              className="relative block aspect-square overflow-hidden bg-[#F6F6F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220]"
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-[#625D55]">
                  {product.name}
                </span>
              )}
            </Link>

            <div className="flex flex-1 flex-col p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#625D55]">
                {statusLabels[product.status]}
              </p>

              <h3 className="mt-2 text-sm font-semibold leading-6">
                <Link
                  href={href}
                  className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                >
                  {product.name}
                </Link>
              </h3>

              <p className="mt-2 text-sm font-semibold">
                {priceLabel(product)}
              </p>

              {product.pricing.unit && (
                <p className="mt-1 text-xs leading-5 text-[#625D55]">
                  {product.pricing.unit}
                </p>
              )}

              <div className="flex-1" />

              <Link
                href={href}
                className="mt-5 inline-flex min-h-11 items-center justify-between gap-2 rounded-lg border border-black/15 px-3 text-xs font-semibold transition-colors hover:bg-[#F6F6F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
              >
                {product.category === "merch"
                  ? "Request a quote"
                  : "View options"}

                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

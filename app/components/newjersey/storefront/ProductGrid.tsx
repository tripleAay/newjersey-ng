"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Plus } from "lucide-react";
import type { NewJerseyProduct } from "@/app/types/commerce";
import ApparelPurchase from "@/app/components/newjersey/product/ApparelPurchase";
import { productHref } from "@/app/lib/newjersey/storefront/catalogue";
import ProductImage from "./ProductImage";
import QuickDialog from "./QuickDialog";
const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export default function ProductGrid({
  products,
  department,
  preview = false,
}: {
  products: NewJerseyProduct[];
  department: "apparel" | "print" | "branding";
  preview?: boolean;
}) {
  const [selected, setSelected] = useState<NewJerseyProduct | null>(null);
  const [count, setCount] = useState(12);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const list = products.slice(0, preview ? 12 : count);
  if (!products.length)
    return (
      <p className="rounded-xl border border-black/10 bg-white p-6 text-sm text-[#625D55]">
        This collection is being prepared. Please check back soon.
      </p>
    );
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 xl:grid-cols-6">
        {list.map((p, i) => {
          const apparel = department === "apparel";
          const quote = p.pricing.type === "quote";
          return (
            <article
              key={p.id}
              className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border border-black/[.07] bg-white transition-shadow duration-700 ease-out hover:shadow-[0_8px_24px_rgba(24,24,24,.07)] motion-reduce:transition-none ${!mobileExpanded && i >= 6 ? "hidden sm:flex" : ""}`}
            >
              <Link
                href={productHref(p)}
                aria-label={`View ${p.name}`}
                className="block rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6B00]"
              >
                <div
                  className={`h-36 overflow-hidden sm:h-40 ${department === "branding" ? "bg-[#EEE9E2]" : "bg-[#F5F4F0]"}`}
                >
                  <ProductImage
                    src={p.image}
                    name={p.name}
                    department={department}
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-3">
                <Link
                  href={productHref(p)}
                  className="line-clamp-2 min-h-9 text-xs font-medium leading-[18px] hover:text-[#FF6B00]"
                >
                  {p.shortName || p.name}
                </Link>
                <p className="mt-2 text-[13px] font-bold tracking-tight">
                  {quote
                    ? "Price on request"
                    : `${p.pricing.type === "starting-from" ? "From " : ""}${currency.format(p.pricing.basePrice ?? 0)}`}
                </p>
                <p className="mt-1 min-h-4 text-[10px] text-[#7A7368]">
                  {apparel
                    ? "Ready-designed"
                    : quote
                      ? "Scope confirmed with you"
                      : `For ${p.pricing.baseQuantity || 1} ${p.pricing.unit || "pieces"}`}
                </p>
                {apparel ? (
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-2 text-[11px] font-semibold text-[#181818] transition-colors hover:bg-[#E85F00] focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                  >
                    <ShoppingBag size={14} aria-hidden="true" />
                    Add to cart
                  </button>
                ) : (
                  <Link
                    href={productHref(p)}
                    className="mt-3 inline-flex min-h-11 items-center justify-between gap-2 rounded-lg border border-black/10 px-3 text-[11px] font-semibold text-[#FF6B00] transition-colors hover:bg-[#FF6B00] hover:text-[#181818]"
                  >
                    {quote ? "View service" : "Choose options"}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!mobileExpanded && list.length > 6 && (
        <button
          type="button"
          onClick={() => setMobileExpanded(true)}
          className="mx-auto mt-5 flex min-h-11 items-center gap-2 text-xs font-semibold text-[#FF6B00] sm:hidden"
        >
          <Plus size={14} />
          Show more
        </button>
      )}
      {!preview && count < products.length && (
        <button
          type="button"
          onClick={() => {
            setCount((c) => c + 12);
            setMobileExpanded(true);
          }}
          className="mx-auto mt-7 flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-6 text-xs font-semibold"
        >
          Load more products
          <Plus size={14} />
        </button>
      )}
      <QuickDialog
        open={!!selected}
        title={selected?.name || "Choose your options"}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="grid gap-5 p-5 md:grid-cols-2">
            <div>
              <div className="h-64 rounded-xl bg-[#F0EFEB]">
                <ProductImage src={selected.image} name={selected.name} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#625D55]">
                {selected.description}
              </p>
              <Link
                href={productHref(selected)}
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold underline"
              >
                Full product details
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <ApparelPurchase key={selected.id} product={selected} />
          </div>
        )}
      </QuickDialog>
    </>
  );
}

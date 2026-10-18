"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { JerseyProduct } from "@/app/lib/newjersey/jerseys/catalogue";
import ProductImage from "@/app/components/newjersey/storefront/ProductImage";
import QuickDialog from "@/app/components/newjersey/storefront/QuickDialog";
import JerseyOrderForm from "./JerseyOrderForm";
const money = (v: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(v / 100);
export default function JerseyShowcase({
  products,
  preview = false,
}: {
  products: JerseyProduct[];
  preview?: boolean;
}) {
  const [selected, setSelected] = useState<JerseyProduct | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const items = preview ? products.slice(0, 8) : products;
  function scroll(direction: number) {
    strip.current?.scrollBy({
      left: direction * 220,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  if (!products.length)
    return (
      <p className="p-6 text-sm text-[#625D55]">
        Jerseys will appear here when available.
      </p>
    );
  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-[#32101D]">
        <div className="flex flex-wrap items-end justify-between gap-4 bg-[#32101D] px-5 py-6 text-white sm:px-6">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[.25em] text-[#FFB581]">
              The jersey room / NewJersey.ng
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Your team. Your name.
            </h2>
            <p className="mt-2 text-xs leading-6 text-white/65">
              Home, away and third kits. Make yours personal.
            </p>
          </div>
          <div className="flex gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scroll(d)}
                aria-label={d < 0 ? "Previous jerseys" : "Next jerseys"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
              >
                {d < 0 ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={strip}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 pt-4 [scrollbar-width:thin] sm:px-5"
        >
          {items.map((p) => (
            <article
              key={p.id}
              className="group flex w-[176px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-[#FCFBF8] sm:w-[194px]"
            >
              <button
                type="button"
                onClick={() => setSelected(p)}
                aria-label={"Personalise " + p.name}
                className="relative h-40 bg-[#F0EFEB] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6B00]"
              >
                <ProductImage src={p.images[0]} name={p.name} jersey />
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold capitalize text-[#FF6B00]">
                  {p.kit} kit
                </span>
              </button>
              <div className="flex flex-1 flex-col p-3">
                <p className="text-[9px] text-[#8A8379]">{p.season} season</p>
                <button
                  onClick={() => setSelected(p)}
                  type="button"
                  className="mt-1 line-clamp-2 min-h-9 text-left text-xs font-semibold leading-[18px]"
                >
                  {p.team}
                </button>
                <p className="mt-2 text-sm font-bold">{money(p.priceMinor)}</p>
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className="mt-3 inline-flex min-h-11 items-center justify-between gap-2 rounded-lg bg-[#FF6B00] px-3 text-[11px] font-semibold text-[#181818]"
                >
                  Personalise
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
        {preview && (
          <div className="flex justify-between gap-4 border-t border-white/10 px-5 py-3 text-[10px] leading-6 text-white/65">
            <p>Name and number charges are shown before ordering.</p>
            <Link
              href="/shop/jerseys"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-white"
            >
              All jerseys
              <ArrowUpRight size={13} />
            </Link>
          </div>
        )}
      </div>
      <QuickDialog
        open={!!selected}
        title={selected?.name || "Personalise your jersey"}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="p-4 sm:p-6">
            <JerseyOrderForm key={selected.id} products={[selected]} />
          </div>
        )}
      </QuickDialog>
    </>
  );
}

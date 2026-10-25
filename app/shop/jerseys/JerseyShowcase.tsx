"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import Link from "next/link";

import type { JerseyProduct } from "@/app/lib/newjersey/jerseys/catalogue";
import ProductImage from "@/app/components/newjersey/storefront/ProductImage";
import QuickDialog from "@/app/components/newjersey/storefront/QuickDialog";
import JerseyOrderForm from "./JerseyOrderForm";

const money = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value / 100);

export default function JerseyShowcase({
  products,
  preview = false,
}: {
  products: JerseyProduct[];
  preview?: boolean;
}) {
  const [selected, setSelected] = useState<JerseyProduct | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  const strip = useRef<HTMLDivElement>(null);
  const firstGroup = useRef<HTMLDivElement>(null);
  const position = useRef(0);

  const items = preview ? products.slice(0, 8) : products;
  const canSlide = items.length > 1;

  const stopped =
    paused ||
    hovered ||
    focused ||
    touching ||
    !!selected ||
    reducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const container = strip.current;

    if (!container || !canSlide || stopped) return;

    let frame = 0;
    let previousTime: number | null = null;

    position.current = container.scrollLeft;

    const animate = (time: number) => {
      if (previousTime !== null && !document.hidden) {
        const elapsed = Math.min(time - previousTime, 50);
        const distance = firstGroup.current?.getBoundingClientRect().width ?? 0;

        if (distance > 0) {
          // Continuous movement at 28 pixels per second.
          position.current += (elapsed / 1000) * 28;
          position.current %= distance;

          container.scrollLeft = position.current;
        }
      }

      previousTime = time;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [canSlide, stopped, items.length]);

  function openProduct(product: JerseyProduct) {
    setSelected(product);
  }

  function renderCard(product: JerseyProduct, duplicate = false) {
    return (
      <article
        key={`${duplicate ? "copy" : "original"}-${product.id}`}
        className="group flex w-[184px] shrink-0 flex-col overflow-hidden rounded-xl bg-[#FCFBF8] sm:w-[210px] lg:w-[228px]"
      >
        <button
          type="button"
          tabIndex={duplicate ? -1 : undefined}
          onClick={() => openProduct(product)}
          aria-label={`Personalise ${product.name}`}
          className="relative block h-44 w-full overflow-hidden bg-[#F0EFEB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6B00] sm:h-48 lg:h-52"
        >
          <ProductImage
            src={product.images[0]}
            name={product.name}
            jersey
          />

          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold capitalize text-[#9A4000]">
            {product.kit} kit
          </span>
        </button>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[10px] text-[#8A8379]">
            {product.season} season
          </p>

          <button
            type="button"
            tabIndex={duplicate ? -1 : undefined}
            onClick={() => openProduct(product)}
            className="mt-1.5 min-h-10 text-left text-sm font-semibold leading-5 text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
          >
            <span className="line-clamp-2">{product.team}</span>
          </button>

          <p className="mt-2 text-base font-bold text-[#181818]">
            {money(product.priceMinor)}
          </p>

          <button
            type="button"
            tabIndex={duplicate ? -1 : undefined}
            onClick={() => openProduct(product)}
            className="mt-4 inline-flex min-h-11 items-center justify-between gap-2 rounded-lg bg-[#FF6B00] px-3 text-xs font-semibold text-[#181818] transition-colors hover:bg-[#FF8126] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181818] focus-visible:ring-offset-2"
          >
            Personalise
            <ArrowUpRight size={15} />
          </button>
        </div>
      </article>
    );
  }

  if (!products.length) {
    return (
      <p className="p-6 text-sm text-[#625D55]">
        Jerseys will appear here when available.
      </p>
    );
  }

  return (
    <>
      <section
        aria-label="Jersey showcase"
        className="overflow-hidden rounded-2xl bg-[#1D201F]"
      >
        <div className="flex items-end justify-between gap-4 px-5 py-6 text-white sm:px-6">
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

          {canSlide && !reducedMotion && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={
                paused ? "Play jersey showcase" : "Pause jersey showcase"
              }
              aria-pressed={paused}
              aria-controls="jersey-showcase-strip"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
            </button>
          )}
        </div>

        <div
          id="jersey-showcase-strip"
          ref={strip}
          role="region"
          aria-label="Available jerseys. Swipe to browse."
          tabIndex={0}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovered(true);
          }}
          onPointerLeave={() => setHovered(false)}
          onPointerDown={() => setTouching(true)}
          onPointerUp={() => setTouching(false)}
          onPointerCancel={() => setTouching(false)}
          onTouchEnd={() => setTouching(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setFocused(false);
            }
          }}
          onScroll={() => {
            if (strip.current) {
              position.current = strip.current.scrollLeft;
            }
          }}
          className="overflow-x-auto overscroll-x-contain pb-5 pt-1 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max">
            <div
              ref={firstGroup}
              className="flex shrink-0 gap-3 pl-4 pr-3 sm:pl-5"
            >
              {items.map((product) => renderCard(product))}
            </div>

            {canSlide && !reducedMotion && (
              <div
                aria-hidden="true"
                className="flex shrink-0 gap-3 pl-4 pr-3 sm:pl-5"
              >
                {items.map((product) => renderCard(product, true))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/10 px-5 py-3 text-[10px] leading-6 text-white/65">
          <p>Name and number charges are shown before ordering.</p>

          {preview && (
            <Link
              href="/shop/jerseys"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-white"
            >
              All jerseys
              <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </section>

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
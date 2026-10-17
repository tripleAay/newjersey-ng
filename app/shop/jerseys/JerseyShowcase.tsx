"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Shirt,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import type { JerseyProduct } from "@/app/lib/newjersey/jerseys/catalogue";
import JerseyOrderForm from "./JerseyOrderForm";

type Props = {
  products: JerseyProduct[];
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

function formatPrice(minor: number) {
  return money.format(minor / 100);
}

const kitLabels: Record<string, string> = {
  home: "Home",
  away: "Away",
  third: "Third",
};

function JerseyImage({
  product,
}: {
  product: JerseyProduct;
}) {
  const [failed, setFailed] = useState(false);
  const src = product.images[0];

  if (!src || failed) {
    return (
      <div className="flex h-full items-center justify-center">
        <Shirt
          size={64}
          strokeWidth={1}
          aria-hidden="true"
          className="text-black/15"
        />
        <span className="sr-only">
          Image unavailable for {product.name}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={product.name}
      fill
      sizes="(max-width: 640px) 85vw, 350px"
      onError={() => setFailed(true)}
      className="object-contain p-7 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none sm:p-8"
    />
  );
}

export default function JerseyShowcase({
  products,
}: Props) {
  const stripRef = useRef<HTMLDivElement>(null);
  const orderSectionRef = useRef<HTMLElement>(null);
  const orderHeadingRef = useRef<HTMLHeadingElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );

  const selected = products.find(
    (product) => product.id === selectedId
  );

  function scrollProducts(direction: -1 | 1) {
    const strip = stripRef.current;
    if (!strip) return;

    const card = strip.querySelector<HTMLElement>(
      "[data-jersey-card]"
    );

    const distance = card
      ? card.getBoundingClientRect().width + 20
      : strip.clientWidth;

    strip.scrollBy({
      left: distance * direction,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
    });
  }

  function openProduct(product: JerseyProduct) {
    if (
      selected &&
      selected.id !== product.id &&
      !window.confirm(
        "Switch jerseys? Your current form entries will be cleared."
      )
    ) {
      return;
    }

    setSelectedId(product.id);

    requestAnimationFrame(() => {
      orderSectionRef.current?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });

      orderHeadingRef.current?.focus({
        preventScroll: true,
      });
    });
  }

  function closeProduct() {
    if (
      !window.confirm(
        "Close personalisation? Your current form entries will be cleared."
      )
    ) {
      return;
    }

    const previousId = selectedId;
    setSelectedId(null);

    requestAnimationFrame(() => {
      document
        .getElementById(`personalise-jersey-${previousId}`)
        ?.focus();
    });
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white px-6 py-12 text-center">
        <Shirt
          size={36}
          strokeWidth={1.3}
          aria-hidden="true"
          className="mx-auto text-[#8A8379]"
        />

        <h2 className="mt-5 text-lg font-semibold">
          The next lineup is on its way.
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#625D55]">
          Available jerseys will appear here once they are
          published.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8379]">
            The lineup
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Find your colours.
          </h2>
        </div>

        {products.length > 1 && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollProducts(-1)}
              aria-label="Scroll to previous jerseys"
              aria-controls="jersey-product-strip"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#625D55] transition-colors hover:border-black/30 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => scrollProducts(1)}
              aria-label="Scroll to next jerseys"
              aria-controls="jersey-product-strip"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#625D55] transition-colors hover:border-black/30 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={stripRef}
        id="jersey-product-strip"
        role="region"
        aria-label="Available jerseys"
        tabIndex={0}
        className="flex min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain rounded-2xl pb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
      >
        {products.map((product) => {
          const kit =
            kitLabels[product.kit] || product.kit;

          const nameAvailable =
            product.nameFeeMinor !== null;

          const numberAvailable =
            product.numberFeeMinor !== null;

          return (
            <article
              key={product.id}
              data-jersey-card
              className="group flex w-[85%] max-w-[350px] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white sm:w-[350px]"
            >
              <button
                type="button"
                onClick={() => openProduct(product)}
                aria-label={`View and personalise ${product.name}`}
                className="relative block aspect-[5/4] w-full overflow-hidden bg-[#F1F0EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220]"
              >
                <JerseyImage product={product} />

                <span className="absolute left-4 top-4 rounded-full border border-black/[0.06] bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#625D55] backdrop-blur-sm">
                  {kit} kit
                </span>
              </button>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A7360]">
                  {product.team} · {product.season}
                </p>

                <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.035em]">
                  {product.name}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#746E65]">
                  {product.description ||
                    `${product.team}, ${product.season}. Choose your size and make it yours.`}
                </p>

                <p className="mt-4 text-xs leading-6 text-[#625D55]">
                  <span className="font-medium text-[#181818]">
                    Sizes
                  </span>
                  {" · "}
                  {product.sizes.join(" / ")}
                </p>

                <div className="mt-auto pt-5">
                  <div className="border-t border-black/[0.07] pt-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#8A8379]">
                      Jersey price
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                      {formatPrice(product.priceMinor)}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] leading-5 text-[#746E65]">
                      {nameAvailable && (
                        <span>
                          Name{" "}
                          {product.nameFeeMinor === 0
                            ? "included"
                            : `+${formatPrice(
                                product.nameFeeMinor!
                              )}`}
                        </span>
                      )}

                      {numberAvailable && (
                        <span>
                          Number{" "}
                          {product.numberFeeMinor === 0
                            ? "included"
                            : `+${formatPrice(
                                product.numberFeeMinor!
                              )}`}
                        </span>
                      )}

                      {!nameAvailable && !numberAvailable && (
                        <span>
                          Name and number printing unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    id={`personalise-jersey-${product.id}`}
                    type="button"
                    onClick={() => openProduct(product)}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-[#181818] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
                  >
                    Personalise jersey
                    <ArrowUpRight
                      size={17}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {products.length > 1 && (
        <p className="mt-1 text-xs text-[#8A8379]">
          Swipe or use the arrows to explore the lineup.
        </p>
      )}

      {selected && (
        <section
          ref={orderSectionRef}
          aria-labelledby="jersey-personalisation-title"
          className="mt-12 scroll-mt-64 border-t border-black/10 pt-8"
        >
          <div className="mb-7 flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8379]">
                Your selection
              </p>

              <h2
                ref={orderHeadingRef}
                id="jersey-personalisation-title"
                tabIndex={-1}
                className="mt-2 text-2xl font-semibold tracking-tight focus:outline-none"
              >
                {selected.name}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
                Choose your size, then add a name and number
                if you want them. Capitalisation matters:
                names and numbers are printed exactly as entered.
              </p>
            </div>

            <button
              type="button"
              onClick={closeProduct}
              aria-label="Close jersey personalisation"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#625D55] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <JerseyOrderForm
            key={selected.id}
            products={[selected]}
          />
        </section>
      )}
    </div>
  );
}
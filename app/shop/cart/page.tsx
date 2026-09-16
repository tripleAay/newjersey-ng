"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  FileCheck2,
  Palette,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "@/app/contexts/cartContext";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    hydrated,
    removeItem,
    clearCart,
  } = useCart();

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto w-[92%] max-w-[1400px] py-16">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-black/10" />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="h-72 animate-pulse rounded-[28px] bg-white" />
            <div className="h-72 animate-pulse rounded-[28px] bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] text-[#222]">
        <div className="mx-auto flex min-h-[80vh] w-[92%] max-w-[1400px] items-center justify-center py-16">
          <div className="max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ShoppingBag
                size={25}
                className="text-[#FF6B00]"
              />
            </div>

            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              Your order
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Nothing here yet.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#777]">
              Choose a product, configure the production details
              and add it to your order.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#222] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
            >
              Browse products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#222]">
      <div className="mx-auto w-[92%] max-w-[1400px] py-8 sm:py-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#FF6B00]"
        >
          <ArrowLeft size={15} />
          Continue shopping
        </Link>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              NewJersey Order
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Your print jobs
            </h1>

            <p className="mt-2 text-sm text-[#777]">
              {itemCount} configured{" "}
              {itemCount === 1 ? "job" : "jobs"}
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-[#999] transition hover:text-red-600"
          >
            Clear order
          </button>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* ITEMS */}

          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.cartItemId}
                className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white"
              >
                <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:p-6">
                  <Link
                    href={`/print/${item.slug}`}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f5f3]"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="150px"
                      className="object-contain p-3"
                    />
                  </Link>

                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
                          Print job
                        </p>

                        <Link
                          href={`/print/${item.slug}`}
                          className="mt-1 block text-lg font-bold tracking-tight text-[#222] transition hover:text-[#FF6B00]"
                        >
                          {item.name}
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.cartItemId)
                        }
                        aria-label={`Remove ${item.name}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#999] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* CONFIGURATION */}

                    {item.selections.length > 0 && (
                      <div className="mt-5 grid gap-x-6 gap-y-3 border-t border-black/[0.06] pt-5 sm:grid-cols-2">
                        {item.selections.map((selection) => (
                          <div
                            key={`${selection.optionId}-${selection.choiceId}`}
                          >
                            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#aaa]">
                              {selection.optionLabel}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-[#555]">
                              {selection.choiceLabel}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ARTWORK */}

                    {item.artwork && (
                      <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f7f7f5] px-4 py-3">
                        {item.artwork.type ===
                          "customer-supplied" ? (
                          <FileCheck2
                            size={17}
                            className="shrink-0 text-[#FF6B00]"
                          />
                        ) : (
                          <Palette
                            size={17}
                            className="shrink-0 text-[#FF6B00]"
                          />
                        )}

                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#aaa]">
                            Artwork
                          </p>

                          <p className="mt-0.5 text-xs font-semibold text-[#555]">
                            {item.artwork.type ===
                              "customer-supplied"
                              ? "Customer will supply artwork"
                              : "NewJersey design support required"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-black/[0.06] pt-5">
                      <Link
                        href={`/print/${item.slug}`}
                        className="text-xs font-semibold text-[#777] underline decoration-black/20 underline-offset-4 transition hover:text-[#FF6B00]"
                      >
                        Change configuration
                      </Link>

                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-[#aaa]">
                          Estimate
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#222]">
                          {formatNaira(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* SUMMARY */}

          <aside className="lg:sticky lg:top-32">
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
                Order summary
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-tight">
                Production estimate
              </h2>

              <div className="mt-6 space-y-4 border-y border-black/[0.07] py-5">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[#777]">
                    Configured jobs
                  </span>

                  <span className="font-semibold">
                    {itemCount}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[#777]">
                    Production
                  </span>

                  <span className="font-semibold">
                    {formatNaira(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[#777]">
                    Delivery
                  </span>

                  <span className="font-semibold">
                    Calculated later
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[#777]">
                    Design support
                  </span>

                  <span className="font-semibold">
                    Reviewed separately
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-5 py-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#999]">
                    Estimated subtotal
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-[-0.04em]">
                    {formatNaira(subtotal)}
                  </p>
                </div>
              </div>

              <Link
                href="/shop/order/new"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#222] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                Continue order
                <ArrowRight size={16} />
              </Link>

              <p className="mt-4 text-center text-[10px] leading-4 text-[#999]">
                This is an estimate. Production pricing is
                confirmed after artwork and specifications are
                reviewed.
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-black/[0.06] bg-white p-4">
              <p className="text-xs font-semibold text-[#444]">
                Need something unusual?
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#888]">
                Complex quantities, custom dimensions and special
                production can be handled as a custom project.
              </p>

              <Link
                href="/shop/requests/new"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]"
              >
                Request a custom quote
                <ArrowRight size={13} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
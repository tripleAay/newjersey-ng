"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileCheck2,
  Minus,
  Palette,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
import OrderSummary from "@/app/components/OrderSummary";

import { useCart } from "@/app/contexts/cartContext";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2";

export default function CartPage() {
  const {
    items,
    itemCount,
    hydrated,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#F4F1E9] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#F4F1E9]/95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        {!hydrated ? (
          <p role="status" className="py-12 text-sm text-[#625D55]">
            Loading your order…
          </p>
        ) : items.length === 0 ? (
          <section className="flex min-h-[55vh] items-center justify-center">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F58220]/10">
                <ShoppingBag
                  size={25}
                  aria-hidden="true"
                  className="text-[#F58220]"
                />
              </div>

              <h1 className="mt-6 text-3xl font-bold tracking-tight">
                Your order is empty.
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#625D55]">
                Choose a product, select your specifications,
                and add it to your order.
              </p>

              <Link
                href="/shop"
                className={`mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F58220] px-6 text-sm font-semibold transition-colors hover:bg-[#D96B0D] ${focus}`}
              >
                Browse products
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : (
          <>
            <Link
              href="/shop"
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] hover:text-[#181818] ${focus}`}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Continue shopping
            </Link>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
                  NewJersey.ng
                  <span className="px-2 text-[#F58220]">/</span>
                  Cart
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  Your order
                </h1>

                <p className="mt-2 text-sm text-[#625D55]">
                  {itemCount} configured {itemCount === 1 ? "job" : "jobs"}
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className={`min-h-11 rounded-lg px-3 text-xs font-semibold text-[#625D55] hover:bg-red-50 hover:text-red-700 ${focus}`}
              >
                Clear order
              </button>
            </div>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <section
                aria-label="Configured products"
                className="min-w-0 space-y-4"
              >
                {items.map((item) => {
                  const needsDesign =
                    item.artwork?.type === "design-needed";

                  const fee = needsDesign
                    ? item.artwork?.designFee ?? 0
                    : 0;

                  const lineTotal =
                    Math.round((item.totalPrice + fee) * 100) / 100;

                  return (
                    <article
                      key={item.cartItemId}
                      className="overflow-hidden rounded-[24px] border border-black/10 bg-white p-5 sm:p-6"
                    >
                      <div className="grid gap-5 sm:grid-cols-[140px_minmax(0,1fr)]">
                        <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-[#EFEDE7] sm:max-w-none sm:self-start">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 639px) 220px, 140px"
                              className="object-contain p-3"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-[#625D55]">
                              {item.name}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <h2 className="text-lg font-semibold tracking-tight">
                              {item.name}
                            </h2>

                            <button
                              type="button"
                              onClick={() => removeItem(item.cartItemId)}
                              aria-label={`Remove ${item.name}`}
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#625D55] hover:bg-red-50 hover:text-red-700 ${focus}`}
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>

                          {item.selections.length > 0 && (
                            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                              {item.selections.map((selection) => (
                                <div key={selection.optionId}>
                                  <dt className="text-xs text-[#625D55]">
                                    {selection.optionLabel}
                                  </dt>
                                  <dd className="mt-1 text-sm font-medium">
                                    {selection.choiceLabel}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          )}

                          <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F4F1E9]/70 p-4">
                            {needsDesign ? (
                              <Palette
                                size={18}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-[#F58220]"
                              />
                            ) : (
                              <FileCheck2
                                size={18}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-[#F58220]"
                              />
                            )}

                            <div>
                              <p className="text-sm font-medium">
                                {needsDesign
                                  ? "Design assistance"
                                  : "Customer-supplied artwork"}
                              </p>

                              <p className="mt-1 text-xs leading-6 text-[#625D55]">
                                {needsDesign
                                  ? `${currency.format(fee)} · once for this configured design`
                                  : "No design fee"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-end justify-between gap-5 border-t border-black/10 pt-5">
                            <div>
                              <p className="mb-2 text-xs text-[#625D55]">
                                Identical jobs
                              </p>

                              <div className="inline-flex items-center rounded-xl border border-black/15">
                                <button
                                  type="button"
                                  disabled={item.quantity <= 1}
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity - 1
                                    )
                                  }
                                  aria-label={`Decrease jobs for ${item.name}`}
                                  className={`flex h-11 w-11 items-center justify-center rounded-l-xl hover:bg-black/5 disabled:opacity-30 ${focus}`}
                                >
                                  <Minus size={15} aria-hidden="true" />
                                </button>

                                <span className="min-w-10 text-center text-sm font-semibold">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  disabled={item.quantity >= 1000}
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity + 1
                                    )
                                  }
                                  aria-label={`Increase jobs for ${item.name}`}
                                  className={`flex h-11 w-11 items-center justify-center rounded-r-xl hover:bg-black/5 disabled:opacity-30 ${focus}`}
                                >
                                  <Plus size={15} aria-hidden="true" />
                                </button>
                              </div>
                            </div>

                            <dl className="min-w-[180px] space-y-2 text-sm">
                              <div className="flex justify-between gap-5">
                                <dt className="text-[#625D55]">Production</dt>
                                <dd>{currency.format(item.totalPrice)}</dd>
                              </div>

                              {needsDesign && (
                                <div className="flex justify-between gap-5">
                                  <dt className="text-[#625D55]">Design</dt>
                                  <dd>{currency.format(fee)}</dd>
                                </div>
                              )}

                              <div className="flex justify-between gap-5 border-t border-black/10 pt-2 font-semibold">
                                <dt>Item total</dt>
                                <dd>{currency.format(lineTotal)}</dd>
                              </div>
                            </dl>
                          </div>

                          <p className="mt-3 text-xs leading-6 text-[#625D55]">
                            {currency.format(item.unitPrice)} production per job.
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <p className="px-1 text-xs leading-6 text-[#625D55]">
                  Increasing identical jobs repeats your selected
                  specifications. Design assistance is charged once
                  per configuration.
                </p>
              </section>

              <aside className="min-w-0 lg:sticky lg:top-44">
                <OrderSummary />
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
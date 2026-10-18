"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import EmptyCartPanel from "@/app/components/EmptyCartPanel";
import OrderSummary from "@/app/components/OrderSummary";
import Footer from "@/app/components/Footer";

import { useCart } from "@/app/contexts/cartContext";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CartPage() {
  const {
    items,
    hydrated,
    removeItem,
    updateQuantity,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto w-[92%] max-w-[1440px] py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
              NewJersey.ng / Cart
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Your order
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#777]">
              Review your products and specifications before
              continuing.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-sm font-semibold text-[#FF6B00] underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </div>

        {!hydrated ? (
          <div
            role="status"
            className="rounded-2xl border border-black/10 bg-white p-8 text-sm text-[#777]"
          >
            Loading your order…
          </div>
        ) : items.length === 0 ? (
          <EmptyCartPanel />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section
              aria-label="Order items"
              className="min-w-0 space-y-4"
            >
              {items.map((item) => (
                <article
                  key={item.cartItemId}
                  className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EEECE6] sm:h-28 sm:w-28">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-semibold sm:text-lg">
                        {item.name}
                      </h2>

                      <ul className="mt-3 space-y-1 text-xs leading-5 text-[#777]">
                        {item.selections.map((selection) => (
                          <li key={selection.optionId}>
                            <span className="font-medium text-[#555]">
                              {selection.optionLabel}:
                            </span>{" "}
                            {selection.choiceLabel}
                          </li>
                        ))}

                        {item.artwork && (
                          <li>
                            <span className="font-medium text-[#555]">
                              Artwork:
                            </span>{" "}
                            {item.artwork.type === "design-needed"
                              ? "Design help requested"
                              : "Customer-supplied"}
                          </li>
                        )}
                      </ul>

                      <p className="mt-3 text-xs text-[#777]">
                        {formatPrice(item.unitPrice)} per
                        configured job
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.cartItemId)
                      }
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 rounded-lg p-2 text-[#777] transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-4">
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#777]">
                        Identical jobs
                      </p>

                      <div className="inline-flex items-center rounded-xl border border-black/10">
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
                          className="rounded-l-xl p-3 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus size={15} aria-hidden="true" />
                        </button>

                        <span className="min-w-10 px-2 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.cartItemId,
                              item.quantity + 1
                            )
                          }
                          aria-label={`Increase jobs for ${item.name}`}
                          className="rounded-r-xl p-3 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                        >
                          <Plus size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <p className="text-lg font-bold tracking-tight">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </article>
              ))}

              <p className="px-1 text-xs leading-6 text-[#777]">
                Increasing jobs repeats the entire selected
                configuration. To change the print size or
                copy quantity, add a new configuration from
                the product page.
              </p>
            </section>

            <aside className="lg:sticky lg:top-44">
              <OrderSummary />
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
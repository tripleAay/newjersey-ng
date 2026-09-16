// app/shop/wishlist/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Header from "@/app/components/dashboard components/mainheader";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/contexts/cartContext";
import { useWishlist } from "@/app/contexts/wishlistContext";

const parsePrice = (price: string): number => {
  const numeric = price.replace(/[^\d.]/g, "");
  return Number.parseFloat(numeric || "0");
};

const formatNGN = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function WishlistPage() {
  const {
    items: wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const { potentialTotal, itemCount } = useMemo(() => {
    const totalValue = wishlistItems.reduce(
      (sum, item) => sum + parsePrice(item.price),
      0
    );

    return {
      potentialTotal: totalValue,
      itemCount: wishlistItems.length,
    };
  }, [wishlistItems]);

  const isEmpty = wishlistItems.length === 0;

  const handleMoveToCart = (
    item: (typeof wishlistItems)[number]
  ) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    removeFromWishlist(item.id);
  };

  return (
    <main className="min-h-screen bg-[#FF6B00] text-white">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="mx-auto mt-10 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* =====================================================
            TOP BAR + BREADCRUMB
        ===================================================== */}
        <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
          <div className="flex flex-col gap-1">

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-100 transition-colors hover:text-white sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shop
            </Link>

            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-[11px] text-neutral-100 sm:text-xs"
            >
              <Link
                href="/shop"
                className="transition-colors hover:text-neutral-100"
              >
                Shop
              </Link>

              <span>/</span>

              <Link
                href="/shop/cart"
                className="transition-colors hover:text-neutral-200"
              >
                Cart
              </Link>

              <span>/</span>

              <span className="text-neutral-200">
                Wishlist
              </span>
            </nav>
          </div>

          {!isEmpty && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-[11px] text-neutral-400 transition-colors hover:text-red-300 sm:text-xs"
            >
              Clear wishlist
            </button>
          )}
        </div>

        {/* =====================================================
            HEADING
        ===================================================== */}
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              Your NewJersey Wishlist
            </h1>

            <p className="mt-1 max-w-lg text-xs text-neutral-100 sm:text-sm">
              Save products and creative pieces you&apos;re considering.
              Keep your favourites here and move them to your cart whenever
              you&apos;re ready.
            </p>
          </div>

          {!isEmpty && (
            <div className="text-right">
              <p className="text-xs text-neutral-400 sm:text-sm">
                Saved items
              </p>

              <p className="text-sm font-semibold sm:text-base">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>

              {potentialTotal > 0 && (
                <p className="mt-1 text-[11px] text-neutral-500 sm:text-xs">
                  If you got everything now:{" "}
                  <span className="font-medium text-neutral-200">
                    {formatNGN(potentialTotal)}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] px-4 py-16 text-center sm:py-20"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900">
                <Heart className="h-7 w-7 text-neutral-400" />
              </div>

              <h2 className="mb-2 text-lg font-semibold sm:text-xl">
                Your wishlist is quiet
              </h2>

              <p className="mb-6 max-w-md text-sm text-neutral-400">
                Tap the little heart on any NewJersey product to save it here.
                Perfect for comparing products, planning print orders or
                keeping ideas for your next project.
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-100"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse products
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            WISHLIST CONTENT
        ===================================================== */}
        {!isEmpty && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] lg:gap-8">

            {/* =================================================
                LEFT: SAVED ITEMS
            ================================================= */}
            <section className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] p-4 sm:p-5 md:p-6">

              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <h2 className="text-sm font-medium sm:text-base">
                  Saved for later
                </h2>

                <span className="text-[11px] text-neutral-400 sm:text-xs">
                  {wishlistItems.length} product
                  {wishlistItems.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="divide-y divide-neutral-800">

                {wishlistItems.map((item) => (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="flex gap-3 py-4 sm:gap-4 sm:py-5"
                  >

                    {/* IMAGE */}
                    <div className="relative flex-shrink-0">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 sm:h-24 sm:w-24">

                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />

                      </div>
                    </div>

                    {/* INFO */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="line-clamp-2 text-sm font-medium sm:text-base">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-[11px] text-neutral-400 sm:text-xs">
                            Saved for later. Your item will remain here until
                            you&apos;re ready to move it into your cart.
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-sm font-semibold sm:text-base">
                            {item.price}
                          </p>

                          <p className="mt-1 text-[10px] text-neutral-500 sm:text-[11px]">
                            Not reserved yet
                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                          <button
                            type="button"
                            onClick={() => handleMoveToCart(item)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-black transition-colors hover:bg-neutral-100 sm:px-4 sm:py-2 sm:text-xs"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Move to cart
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromWishlist(item.id)
                            }
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-400 transition-colors hover:text-red-300 sm:text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>

                        </div>

                        <Link
                          href={`/shop?highlight=${item.id}`}
                          className="text-[10px] text-neutral-400 transition-colors hover:text-neutral-200 sm:text-[11px]"
                        >
                          View more details ↗
                        </Link>

                      </div>

                    </div>
                  </motion.article>
                ))}

              </div>
            </section>

            {/* =================================================
                RIGHT: WISHLIST GUIDANCE
            ================================================= */}
            <section className="lg:sticky lg:top-24 lg:h-fit">

              <div className="space-y-3 rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#151515] to-[#050505] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.6)] sm:p-5 md:p-6">

                {/* LABEL */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#f58220]" />

                  <span className="text-[10px] text-neutral-200">
                    Wishlist tips
                  </span>

                </div>

                {/* TITLE */}
                <h2 className="text-sm font-medium sm:text-base">
                  Your ideas, kept in one place.
                </h2>

                {/* DESCRIPTION */}
                <p className="text-[11px] text-neutral-400 sm:text-xs">
                  Compare products, styles and price ranges here. When
                  you&apos;re ready to order, move your selections into the
                  cart and continue with checkout.
                </p>

                {/* TIPS */}
                <ul className="mt-2 space-y-1.5 text-[10px] text-neutral-300 sm:text-[11px]">

                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1 w-1 rounded-full bg-[#f58220]" />

                    <span>
                      Wishlist items are not reserved — availability
                      can still change.
                    </span>
                  </li>

                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1 w-1 rounded-full bg-[#f58220]" />

                    <span>
                      Move your favourites to cart when you&apos;re
                      ready to order.
                    </span>
                  </li>

                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1 w-1 rounded-full bg-[#f58220]" />

                    <span>
                      Save products you may want for future print
                      or branding projects.
                    </span>
                  </li>

                </ul>

                {/* BOTTOM NOTE */}
                <div className="mt-3 border-t border-neutral-800 pt-3 text-[10px] text-neutral-500 sm:text-[11px]">

                  <p>
                    Planning a print or branding project? Keep your
                    preferred products here and turn your selections
                    into one clear order when you&apos;re ready.
                  </p>

                </div>

              </div>
            </section>

          </div>
        )}

      </div>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />
    </main>
  );
}
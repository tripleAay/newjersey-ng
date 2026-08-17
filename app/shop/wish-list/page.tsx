// app/shop/wishlist/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from "lucide-react";

import Header from "@/components/dashboard components/mainheader";
import { useCart } from "@/contexts/cartContext";
import { useWishlist } from "@/contexts/wishlistContext"; // 👈 you'll create this

// If you ever need price maths (optional)
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
  const { items: wishlistItems, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  const { potentialTotal, itemCount } = useMemo(() => {
    const totalValue = wishlistItems.reduce(
      (sum, item) => sum + parsePrice(item.price),
      0
    );
    return { potentialTotal: totalValue, itemCount: wishlistItems.length };
  }, [wishlistItems]);

  const isEmpty = wishlistItems.length === 0;

  const handleMoveToCart = (item: (typeof wishlistItems)[number]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    removeFromWishlist(item.id);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20 pb-16">
      <Header />

      <div className="max-w-6xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar + breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex flex-col gap-1">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to shop
            </Link>

            {/* 🔗 Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-[11px] text-neutral-500 sm:text-xs"
            >
              <Link href="/shop" className="hover:text-neutral-200">
                Shop
              </Link>
              <span>/</span>
              <Link href="/shop/cart" className="hover:text-neutral-200">
                Cart
              </Link>
              <span>/</span>
              <span className="text-neutral-200">Wishlist</span>
            </nav>
          </div>

          {!isEmpty && (
            <button
              onClick={clearWishlist}
              className="text-[11px] sm:text-xs text-neutral-400 hover:text-red-300 transition-colors"
            >
              Clear wishlist
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Your Fynaro Wishlist
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-lg">
              Save pieces you’re not ready to buy yet. We’ll keep them here so
              you can move them into your cart when it’s time.
            </p>
          </div>

          {!isEmpty && (
            <div className="text-right">
              <p className="text-xs sm:text-sm text-neutral-400">
                Saved items
              </p>
              <p className="text-sm sm:text-base font-semibold">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>
              {potentialTotal > 0 && (
                <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">
                  If you got everything now:{" "}
                  <span className="font-medium text-neutral-200">
                    {formatNGN(potentialTotal)}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Empty state */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-4 rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505]"
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-neutral-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Your wishlist is quiet
              </h2>
              <p className="text-sm text-neutral-400 max-w-md mb-6">
                Tap the little heart on any Fynaro product to save it here.
                Perfect for comparing options or planning your next drop.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium px-6 py-2.5 hover:bg-neutral-100 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse products
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist content */}
        {!isEmpty && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] gap-6 lg:gap-8">
            {/* Left: list of saved items */}
            <section className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-sm sm:text-base font-medium">
                  Saved for later
                </h2>
                <span className="text-[11px] sm:text-xs text-neutral-400">
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
                    className="py-4 sm:py-5 flex gap-3 sm:gap-4"
                  >
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-medium line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-[11px] sm:text-xs text-neutral-400">
                            Saved for later — we won’t charge you until you move
                            it into your cart.
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm sm:text-base font-semibold">
                            {item.price}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1">
                            Not reserved yet
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => handleMoveToCart(item)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold hover:bg-neutral-100 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Move to cart
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-neutral-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>

                        <Link
                          href={`/shop?highlight=${item.id}`}
                          className="text-[10px] sm:text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          View more details ↗
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            {/* Right: subtle guidance / nudge card */}
            <section className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#151515] to-[#050505] p-4 sm:p-5 md:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.6)] space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c8a96a]" />
                  <span className="text-[10px] text-neutral-200">
                    Wishlist tips
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-medium">
                  Treat this like your pre-cart.
                </h2>
                <p className="text-[11px] sm:text-xs text-neutral-400">
                  Compare colors, styles and price ranges here. When you’re
                  ready to commit, move items into your cart and we’ll help you
                  finish the checkout calmly.
                </p>

                <ul className="mt-2 space-y-1.5 text-[10px] sm:text-[11px] text-neutral-300">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1 w-1 rounded-full bg-[#c8a96a]" />
                    Wishlist items are not reserved — stock can still change.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1 w-1 rounded-full bg-[#c8a96a]" />
                    Move favourites to cart before major drops or campaigns.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1 w-1 rounded-full bg-[#c8a96a]" />
                    Use this space to plan team merch or future print runs.
                  </li>
                </ul>

                <div className="mt-3 pt-3 border-t border-neutral-800 text-[10px] sm:text-[11px] text-neutral-500">
                  <p>
                    You’ll soon be able to sync wishlist items into a Fynaro
                    project request — perfect for turning your saved picks into
                    one proper brief.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

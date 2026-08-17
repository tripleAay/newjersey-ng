// app/shop/cart/page.tsx (or pages/shop/cart.tsx)
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/cartContext";
import Header from "@/components/dashboard components/mainheader";
import PayNowButton from "@/components/dashboard components/PayNowButton";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

const parsePrice = (price: string): number => {
  const numeric = price.replace(/[^\d.]/g, "");
  return Number.parseFloat(numeric || "0");
};

const formatNGN = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CartPage() {
  const { items, removeFromCart, clearCart, addToCart, decrementItem } =
    useCart();

  const [loading, setLoading] = useState(true);

  // simple first-load skeleton (nice with context hydration)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const { subtotal, itemCount } = useMemo(() => {
    const subtotalValue = items.reduce(
      (sum, item) => sum + parsePrice(item.price) * (item.quantity ?? 1),
      0
    );
    const countValue = items.reduce(
      (sum, item) => sum + (item.quantity ?? 1),
      0
    );
    return { subtotal: subtotalValue, itemCount: countValue };
  }, [items]);

  const estimatedVat = subtotal * 0.075; // 7.5% VAT
  const estimatedShipping = items.length > 0 ? 3500 : 0;
  const grandTotal = subtotal + estimatedVat + estimatedShipping;

  const handleIncrease = (item: (typeof items)[number]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  const handleDecrease = (item: (typeof items)[number]) => {
    decrementItem(item.id);
  };

  const isEmpty = items.length === 0;
  const showSkeleton = !isEmpty && loading;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20 pb-16">
      <Header />

      <div className="max-w-6xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🧭 Breadcrumb */}
        <nav className="mb-3 sm:mb-4 text-[11px] sm:text-xs text-neutral-500">
          <ol className="flex items-center gap-1.5 sm:gap-2">
            <li>
              <Link
                href="/"
                className="hover:text-neutral-200 transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-neutral-600">/</li>
            <li>
              <Link
                href="/shop"
                className="hover:text-neutral-200 transition-colors"
              >
                Shop
              </Link>
            </li>
            <li className="text-neutral-600">/</li>
            <li className="text-neutral-300">Cart</li>
          </ol>
        </nav>

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to shop
            </Link>
          </div>

          {!isEmpty && !showSkeleton && (
            <button
              onClick={clearCart}
              className="text-[11px] sm:text-xs text-neutral-400 hover:text-red-300 transition-colors"
            >
              Clear cart
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Your Fynaro Cart
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              Review your items before you proceed to checkout.
            </p>
          </div>
          {!isEmpty && !showSkeleton && (
            <div className="text-right">
              <p className="text-xs sm:text-sm text-neutral-400">
                Items in cart
              </p>
              <p className="text-sm sm:text-base font-semibold">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>
            </div>
          )}
        </div>

        {/* Empty state */}
        <AnimatePresence>
          {isEmpty && !showSkeleton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-4 rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505]"
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-neutral-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Your cart is feeling shy
              </h2>
              <p className="text-sm text-neutral-400 max-w-md mb-6">
                You haven’t added anything yet. Explore Fynaro tees, caps,
                hoodies and more, then come back to seal the deal.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium px-6 py-2.5 hover:bg-neutral-100 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Start shopping
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton + Cart content */}
        {!isEmpty && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:gap-8">
            {/* Left: items */}
            <section className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-sm sm:text-base font-medium">
                  Cart items
                </h2>
                <span className="text-[11px] sm:text-xs text-neutral-400">
                  {items.length} product{items.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* Skeleton state */}
              {showSkeleton && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="py-4 sm:py-5 flex gap-3 sm:gap-4 animate-pulse"
                    >
                      {/* Image placeholder */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-900/80 border border-neutral-800" />

                      {/* Text placeholder */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="h-3.5 w-2/3 rounded-full bg-neutral-800 mb-2" />
                          <div className="h-2.5 w-3/4 rounded-full bg-neutral-900" />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="h-7 w-28 rounded-full bg-neutral-900" />
                          <div className="h-4 w-16 rounded-full bg-neutral-800" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Real cart items */}
              {!showSkeleton && (
                <div className="divide-y divide-neutral-800">
                  {items.map((item) => {
                    const qty = item.quantity ?? 1;
                    const lineTotal = parsePrice(item.price) * qty;

                    return (
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
                                Fynaro custom-ready piece • Perfect for branding
                                or personal use.
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm sm:text-base font-semibold">
                                {item.price}
                              </p>
                              <p className="text-[11px] sm:text-xs text-neutral-500 mt-1">
                                {qty}×
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            {/* Quantity + remove */}
                            <div className="flex items-center gap-3">
                              <div className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-900 px-1.5 sm:px-2.5 py-1 text-[11px] sm:text-xs text-neutral-200">
                                <button
                                  type="button"
                                  onClick={() => handleDecrease(item)}
                                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>

                                <span className="mx-2 text-neutral-200 font-medium min-w-[1.5rem] text-center">
                                  {qty}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleIncrease(item)}
                                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-black hover:bg-neutral-200 transition"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-neutral-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove
                              </button>
                            </div>

                            {/* Line total */}
                            <p className="text-sm sm:text-base font-semibold text-neutral-100">
                              {formatNGN(lineTotal)}
                            </p>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Right: summary */}
           <section className="h-fit rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] p-4 sm:p-5 md:p-6">
  <h2 className="mb-4 text-sm font-medium sm:text-base">
    Order summary
  </h2>

  <div className="space-y-2.5 text-[12px] text-neutral-300 sm:text-sm">
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>{formatNGN(subtotal)}</span>
    </div>

    <div className="flex justify-between">
      <span>Estimated VAT (7.5%)</span>
      <span>{formatNGN(estimatedVat)}</span>
    </div>

    <div className="flex justify-between">
      <span>Estimated shipping</span>
      <span>
        {estimatedShipping === 0
          ? "—"
          : formatNGN(estimatedShipping)}
      </span>
    </div>

    <div className="mt-2 flex items-center justify-between border-t border-neutral-800 pt-3">
      <span className="text-[13px] font-semibold sm:text-sm">
        Total
      </span>
      <span className="text-base font-semibold sm:text-lg">
        {formatNGN(grandTotal)}
      </span>
    </div>
  </div>

  <p className="mt-3 text-[11px] text-neutral-500 sm:text-xs">
    Taxes and final shipping will be confirmed at checkout.
  </p>

  <PayNowButton
    serviceId={`cart_${items.length}_${Math.round(grandTotal)}`}
    serviceTitle={`Fynaro Cart Order (${items.length} item${items.length === 1 ? "" : "s"})`}
    amount={grandTotal}
    currency="NGN"
    redirectUrl="/shop/success"
    buttonText="Proceed to checkout"
    className="mt-5 inline-flex h-[46px] sm:h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm sm:text-base font-medium text-black transition duration-200 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
  />

  <p className="mt-3 text-[11px] sm:text-xs text-neutral-400 text-center">
    Have a brand project in mind? You can mention it at checkout.
  </p>

  <div className="mt-4 text-[11px] text-neutral-500 sm:text-xs">
    <p>
      All Fynaro pieces are made with print and branding in mind.
      For bulk or agency orders, we’ll confirm timelines after your checkout.
    </p>
  </div>
</section>
          </div>
        )}
      </div>
    </main>
  );
}

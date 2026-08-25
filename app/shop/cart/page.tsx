// app/shop/cart/page.tsx (or pages/shop/cart.tsx)
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/contexts/cartContext";
import Header from "@/app/components/dashboard components/mainheader";
import PayNowButton from "@/app/components/dashboard components/PayNowButton";
import Footer from "@/app/components/Footer";
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
    <main className="min-h-screen bg-[#FF6B00] text-neutral-900">
      <div className="sticky top-0 z-50 bg-[#fafafa]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <Header />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-[11px] sm:text-xs text-neutral-100">
          <ol className="flex items-center gap-1.5 sm:gap-2">
            <li>
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-neutral-300">/</li>
            <li>
              <Link href="/shop" className="hover:text-neutral-900 transition-colors">
                Shop
              </Link>
            </li>
            <li className="text-neutral-100">/</li>
            <li className="text-neutral-700">Cart</li>
          </ol>
        </nav>

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to shop
          </Link>

          {!isEmpty && !showSkeleton && (
            <button
              onClick={clearCart}
              className="text-[11px] sm:text-xs text-neutral-100 hover:text-red-500 transition-colors"
            >
              Clear cart
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <h1 className="text-2xl text-neutral-100 sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Your Fynaro Cart
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-100">
              Review your items before you proceed to checkout.
            </p>
          </div>
          {!isEmpty && !showSkeleton && (
            <div className="text-right">
              <p className="text-xs sm:text-sm text-neutral-100">Items in cart</p>
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
              className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-4 rounded-3xl border border-neutral-200 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-neutral-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Your cart is feeling shy
              </h2>
              <p className="text-sm text-neutral-500 max-w-md mb-6">
                You haven’t added anything yet. Explore Fynaro tees, caps,
                hoodies and more, then come back to seal the deal.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white text-sm font-medium px-6 py-2.5 hover:bg-neutral-800 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Start shopping
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two-column layout */}
        {!isEmpty && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left: scrollable items */}
            <section className="space-y-8">
              <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5 md:p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-sm sm:text-base font-medium">Cart items</h2>
                  <span className="text-[11px] sm:text-xs text-neutral-500">
                    {items.length} product{items.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Skeleton */}
                {showSkeleton && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="py-4 sm:py-5 flex gap-3 sm:gap-4 animate-pulse"
                      >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-100 border border-neutral-200" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="h-3.5 w-2/3 rounded-full bg-neutral-200 mb-2" />
                            <div className="h-2.5 w-3/4 rounded-full bg-neutral-100" />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="h-7 w-28 rounded-full bg-neutral-100" />
                            <div className="h-4 w-16 rounded-full bg-neutral-200" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Real cart items */}
                {!showSkeleton && (
                  <div className="divide-y divide-neutral-100">
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
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200">
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
                                <h3 className="text-sm sm:text-base font-medium line-clamp-2 text-neutral-900">
                                  {item.name}
                                </h3>
                                <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">
                                  Fynaro custom-ready piece • Perfect for branding
                                  or personal use.
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-sm sm:text-base font-semibold text-neutral-900">
                                  {item.price}
                                </p>
                                <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
                                  {qty}×
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              {/* Quantity + remove */}
                              <div className="flex items-center gap-3">
                                <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-1.5 sm:px-2.5 py-1 text-[11px] sm:text-xs text-neutral-700">
                                  <button
                                    type="button"
                                    onClick={() => handleDecrease(item)}
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-transparent hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>

                                  <span className="mx-2 font-medium min-w-[1.5rem] text-center text-neutral-900">
                                    {qty}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleIncrease(item)}
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-neutral-500 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove
                                </button>
                              </div>

                              {/* Line total */}
                              <p className="text-sm sm:text-base font-semibold text-neutral-900">
                                {formatNGN(lineTotal)}
                              </p>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Right: sticky order summary */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <section className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5 md:p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
                <h2 className="mb-4 text-sm font-medium sm:text-base">
                  Order summary
                </h2>

                <div className="space-y-2.5 text-[12px] text-neutral-600 sm:text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-neutral-900">{formatNGN(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated VAT (7.5%)</span>
                    <span className="text-neutral-900">{formatNGN(estimatedVat)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated shipping</span>
                    <span className="text-neutral-900">
                      {estimatedShipping === 0 ? "—" : formatNGN(estimatedShipping)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="text-[13px] font-semibold sm:text-sm text-neutral-900">
                      Total
                    </span>
                    <span className="text-base font-semibold sm:text-lg text-neutral-900">
                      {formatNGN(grandTotal)}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-neutral-400 sm:text-xs">
                  Taxes and final shipping will be confirmed at checkout.
                </p>

                <PayNowButton
                  serviceId={`cart_${items.length}_${Math.round(grandTotal)}`}
                  serviceTitle={`Fynaro Cart Order (${items.length} item${items.length === 1 ? "" : "s"})`}
                  amount={grandTotal}
                  currency="NGN"
                  redirectUrl="/shop/success"
                  buttonText="Proceed to checkout"
                  className="mt-5 inline-flex h-[46px] sm:h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm sm:text-base font-medium text-white transition duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-3 text-[11px] sm:text-xs text-neutral-500 text-center">
                  Have a brand project in mind? You can mention it at checkout.
                </p>

                <div className="mt-4 text-[11px] text-neutral-400 sm:text-xs">
                  <p>
                    All Fynaro pieces are made with print and branding in mind.
                    For bulk or agency orders, we’ll confirm timelines after your checkout.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
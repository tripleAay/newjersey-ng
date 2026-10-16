"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Heart, Trash2 } from "lucide-react";

import Header from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { useWishlist } from "@/app/contexts/wishlistContext";
import { products } from "@/app/data/newjersey/products";

function findProduct(id: string | number) {
  return products.find(
    (product) =>
      product.published !== false &&
      String(product.id) === String(id)
  );
}

function productHref(id: string | number): string | null {
  const product = findProduct(id);

  if (!product) return null;

  const slug = encodeURIComponent(product.slug);

  switch (product.category) {
    case "print":
      return `/shop/print/${slug}`;

    case "apparel":
      return `/shop/apparel/${slug}`;

    default:
      return "/quote";
  }
}

export default function WishlistPage() {
  const {
    items,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <Header />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-[#625D55] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to shop
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your wishlist.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
              Keep products here for later. Choose your print options
              and artwork requirements before adding them to your cart.
            </p>
          </div>

          {mounted && items.length > 0 && (
            <p className="text-sm text-[#625D55]">
              {items.length} saved{" "}
              {items.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        {!mounted ? (
          <p
            role="status"
            className="mt-8 py-8 text-sm text-[#625D55]"
          >
            Loading your wishlist…
          </p>
        ) : items.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-black/10 bg-white px-6 py-14 text-center">
            <Heart
              size={28}
              aria-hidden="true"
              className="mx-auto text-[#7A7368]"
            />

            <h2 className="mt-5 text-xl font-semibold">
              No saved products yet.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#625D55]">
              Products you save will appear here so you can return
              to them when you are ready.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181818] focus-visible:ring-offset-2"
            >
              Browse products
            </Link>
          </section>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
              {items.map((item) => {
                const product = findProduct(item.id);
                const href = productHref(item.id);
                const image = product?.image || item.image;
                const name = product?.name || item.name;

                return (
                  <li key={item.id} className="py-6">
                    <article className="flex items-start gap-4 sm:gap-6">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white sm:h-32 sm:w-32">
                        {image ? (
                          <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 96px, 128px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Heart
                              size={24}
                              aria-hidden="true"
                              className="text-[#7A7368]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold leading-6 sm:text-lg">
                          {href ? (
                            <Link
                              href={href}
                              className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                            >
                              {name}
                            </Link>
                          ) : (
                            name
                          )}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#625D55]">
                          {href
                            ? "Check current pricing and available options before ordering."
                            : "This saved item could not be matched to the current catalog."}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                          <Link
                            href={href ?? "/shop"}
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-xs font-semibold hover:bg-[#F6F6F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                          >
                            {!href
                              ? "Browse products"
                              : product?.category === "merch"
                                ? "Request a quote"
                                : "View options"}

                            <ArrowUpRight
                              size={15}
                              aria-hidden="true"
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            aria-label={`Remove ${name} from wishlist`}
                            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs text-[#625D55] hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xl text-xs leading-6 text-[#625D55]">
                Saved items are not reserved. Pricing depends on
                the options selected on the product page.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Remove all products from your wishlist?"
                    )
                  ) {
                    clearWishlist();
                  }
                }}
                className="min-h-11 rounded-sm text-xs text-[#625D55] hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
              >
                Clear wishlist
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
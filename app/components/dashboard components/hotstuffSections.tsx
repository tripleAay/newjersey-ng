"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useCart, type Product } from "@/app/contexts/cartContext";
import { Star, Heart } from "lucide-react";
import ProductDetailModal from "@/app/components/dashboard components/productDetailModal";
import { DetailedProduct } from "@/app/components/dashboard components/productTile";
import { useFynaroToast } from "@/app/components/dashboard components/common/fynaroToast";
import { useWishlist } from "@/app/contexts/wishlistContext";
import { products } from "@/app/data/product"; 
import { AppProduct } from "@/app/types/product";

const StarRating = ({ rating = 5 }: { rating?: number }) => (
  <div className="mt-1 flex items-center justify-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
        }
      />
    ))}
  </div>
);

export default function HotStuffTile() {
  const { addToCart } = useCart();
  const { notifyAddToCart, notifyWishlistToggle } = useFynaroToast();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const hotProducts = products.filter((product) => product.isHotStuff);

  const [sparkId, setSparkId] = useState<number | string | null>(null);
  const [selected, setSelected] = useState<AppProduct | null>(null);

  const fullSubtitle =
    "Limited picks. Clean silhouettes. Designed to carry your brand like it’s on the front row.";
  const [typedSubtitle, setTypedSubtitle] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  useEffect(() => {
    let i = 0;
    setTypedSubtitle("");

    const timer = setInterval(() => {
      i++;
      setTypedSubtitle(fullSubtitle.slice(0, i));
      if (i >= fullSubtitle.length) clearInterval(timer);
    }, 35);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: AppProduct | DetailedProduct) => {
    const priceStr =
      typeof product.price === "string"
        ? product.price
        : `₦${Number(product.price ?? 0).toLocaleString("en-NG")}.00`;

    const normalized: Product = {
      id: product.id,
      name: product.name,
      price: priceStr,
      image:
        "image" in product && product.image
          ? product.image
          : "images" in product && product.images?.[0]
          ? product.images[0]
          : "",
    };

    addToCart(normalized);
    setSparkId(product.id);
    setTimeout(() => setSparkId(null), 800);
    notifyAddToCart(normalized.name);
  };

  const handleToggleWishlist = (product: AppProduct) => {
    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? product.images?.[0] ?? "",
    };

    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
      notifyWishlistToggle(product.name, false);
    } else {
      addToWishlist(payload);
      notifyWishlistToggle(product.name, true);
    }
  };

  const handleStripScroll = () => {
    const container = stripRef.current;
    if (!container) return;

    const center =
      container.getBoundingClientRect().left + container.offsetWidth / 2;

    let closest = 0;
    let min = Infinity;

    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < min) {
        min = dist;
        closest = idx;
      }
    });

    setActiveIndex(closest);
  };

  useEffect(() => {
    handleStripScroll();
  }, []);

  const scrollToIndex = (idx: number) => {
    cardRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <>
      <section className="relative mb-24 mt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/80">
                Curated heat
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#c8a96a] sm:text-3xl md:text-4xl">
                Hot Stuff <span className="align-middle">🔥</span>
              </h2>
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-xs text-[11px] text-white sm:text-right sm:text-xs md:text-sm"
            >
              {typedSubtitle}
              <motion.span
                className="ml-1 inline-block h-[1em] w-[2px] bg-white/70 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.span>
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a] to-transparent opacity-80" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a] to-transparent opacity-80" />

            <div
              ref={stripRef}
              onScroll={handleStripScroll}
              className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-hide sm:gap-6"
            >
              {hotProducts.map((product, index) => {
                const wished = isWishlisted(product.id);

                return (
                  <motion.div
                    key={product.id}
                    ref={setCardRef(index)}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.6 }}
                    className="relative shrink-0 snap-center overflow-hidden rounded-[22px] border border-[#2a2722] bg-[radial-gradient(circle_at_top,#1b1917_0,#111014_42%,#0b0a09_100%)] text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)] w-[82vw] sm:w-[60vw] md:w-[40vw] lg:w-[30%]"
                  >
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-6 -top-6 h-16 w-16 rounded-bl-full rounded-tr-full border-l border-t border-[#c8a96a]/70 opacity-70" />
                      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-br-full rounded-tl-full border-b border-r border-[#c8a96a]/70 opacity-70" />
                    </div>

                    <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-60">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {product.tag && (
                        <div className="absolute left-3 top-3 rounded-full border border-[#c8a96a]/70 bg-black/70 px-3 py-1 text-[10px] font-medium tracking-wide sm:text-[11px]">
                          {product.tag}
                        </div>
                      )}

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleWishlist(product)}
                        aria-label={
                          wished ? "Remove from wishlist" : "Save to wishlist"
                        }
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/70 transition-colors hover:bg-black/90"
                      >
                        <Heart
                          size={16}
                          className={`transition-colors ${
                            wished
                              ? "fill-[#ff7ab8] text-[#ff7ab8]"
                              : "text-white/70"
                          }`}
                        />
                      </motion.button>

                      {sparkId === product.id && (
                        <motion.span
                          className="pointer-events-none absolute inset-3 rounded-[20px] border-2 border-[#f5e4b5]"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.9, 1.05, 1],
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )}
                    </div>

                    <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-base md:text-lg">
                          {product.name}
                        </h3>
                        <span className="whitespace-nowrap text-[11px] text-[#e3c985] sm:text-xs">
                          Limited
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-3">
                        <StarRating rating={product.rating} />
                        <p className="text-sm font-semibold text-[#f5e4b5] sm:text-base">
                          {product.price}
                        </p>
                      </div>

                      <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-neutral-300 sm:text-xs">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 rounded-full bg-white py-2 text-[11px] font-semibold tracking-wide text-[#111014] transition-colors hover:bg-[#f5e9ce] sm:py-2.5 sm:text-xs"
                        >
                          Add to Cart
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelected(product)}
                          className="flex-1 rounded-full border border-[#c8a96a]/70 py-2 text-[11px] font-medium text-[#f5e4b5] transition-all hover:border-[#f0d48b] hover:bg-[#1b1813] sm:py-2.5 sm:text-xs"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {hotProducts.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
                {hotProducts.map((_, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToIndex(idx)}
                      className="relative flex h-3 w-3 items-center justify-center"
                      aria-label={`Go to product ${idx + 1}`}
                    >
                      <span
                        className={`block h-3 w-3 rotate-45 rounded-[4px] transition-all ${
                          active
                            ? "scale-110 bg-[#F5B400] shadow-[0_0_14px_rgba(245,180,0,0.9)]"
                            : "scale-95 border border-white/20 bg-white/15"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <ProductDetailModal
        product={selected as DetailedProduct | null}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onAddToCart={(product: DetailedProduct) => {
          handleAddToCart(product);
          setSelected(null);
        }}
      />
    </>
  );
}
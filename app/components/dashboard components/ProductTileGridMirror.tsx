"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { useCart } from "../../contexts/cartContext";
import ProductDetailModal from "@/app/components/dashboard components/productDetailModal";
import { useFynaroToast } from "@/app/components/dashboard components/common/fynaroToast";
import { useWishlist } from "@/app/contexts/wishlistContext";
import { products } from "@/app/data/product";
import { AppProduct } from "@/app/types/product";

const renderStars = (rating: number) => (
  <span className="inline-flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < Math.floor(rating)
            ? "fill-[#F5B400] text-[#F5B400]"
            : "text-gray-300"
        }`}
      />
    ))}
  </span>
);

const ProductTileGridMirror: React.FC = () => {
  const { addToCart } = useCart();
  const { notifyAddToCart } = useFynaroToast();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const [selected, setSelected] = useState<AppProduct | null>(null);
  const [activeAdd, setActiveAdd] = useState<number | string | null>(null);

  const displayProducts = useMemo(() => {
    // ensures exactly 18 items for 6 columns x 3 rows
    return products.slice(0, 18);
  }, []);

  const handleAddToCart = (product: AppProduct) => {
    addToCart(product);
    notifyAddToCart(product.name);

    setActiveAdd(product.id);
    setTimeout(() => setActiveAdd(null), 1200);
  };

  const handleToggleWishlist = (product: AppProduct) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <section className="w-full">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-4">
          {displayProducts.map((product) => {
            const wished = isWishlisted(product.id);
            const isAdding = activeAdd === product.id;

            return (
              <motion.article
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:border-[#d6cc6d]/40 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
              >
                <div className="relative h-40 w-full bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-3 transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <Image
                    src={product.hoverImage ?? product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
                  >
                    <Heart
                      size={14}
                      className={
                        wished ? "fill-[#ff7ab8] text-[#ff7ab8]" : "text-white"
                      }
                    />
                  </button>

                  {product.isHotStuff && (
                    <div className="absolute left-3 top-3 rounded-full bg-[#111014]/85 px-2.5 py-1 text-[10px] font-medium text-[#f5e4b5]">
                      Hot Stuff
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
                  <h3 className="line-clamp-2 min-h-[38px] text-[12px] font-medium leading-5 text-neutral-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-[13px] font-semibold text-[#111014] transition-all duration-300 group-hover:text-[#d6cc6d] group-hover:drop-shadow-[0_0_6px_rgba(214,204,109,0.4)]">
                    {product.price}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-[10px]">
                    {renderStars(product.rating)}
                  </div>

                  <div className="mt-auto flex gap-2 pt-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 rounded-full py-2 text-[11px] font-medium transition-all ${
                        isAdding
                          ? "bg-[#d6cc6d] text-black"
                          : "bg-[#111014] text-white hover:bg-black"
                      }`}
                    >
                      {isAdding ? "Added" : "Add"}
                    </motion.button>

                    <button
                      onClick={() => setSelected(product)}
                      className="flex-1 rounded-full border border-[#d6cc6d]/60 py-2 text-[11px] text-[#bfb45f] transition hover:bg-[#111014] hover:text-[#d6cc6d]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <ProductDetailModal
        product={
          selected
            ? {
                ...selected,
                images: selected.images?.slice(0, 3) ?? [selected.image],
                reviewsCount: selected.reviewsCount ?? 0,
                isFulfilled: selected.isFulfilled ?? true,
              }
            : null
        }
        open={!!selected}
        onClose={() => setSelected(null)}
        onAddToCart={(product) => handleAddToCart(product as AppProduct)}
      />
    </>
  );
};

export default ProductTileGridMirror;
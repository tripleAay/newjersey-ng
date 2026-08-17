"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { useCart, Product } from "../../contexts/cartContext";
import ProductDetailModal from "@/app/components/dashboard components/productDetailModal";
import { useFynaroToast } from "@/app/components/dashboard components/common/fynaroToast";
import { useWishlist } from "@/app/contexts/wishlistContext";
import { products } from "@/app/data/product";
import { AppProduct } from "@/app/types/product";

export type DetailedProduct = Product & {
  hoverImage?: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  rating: number;
  reviewsCount: number;
  isFulfilled: boolean;
};

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

const ProductTileGrid: React.FC = () => {
  const { addToCart } = useCart();
  const { notifyAddToCart } = useFynaroToast();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const [selected, setSelected] = useState<AppProduct | null>(null);
  const [activeAdd, setActiveAdd] = useState<number | string | null>(null);

  const handleAddToCart = (product: AppProduct) => {
    addToCart(product);
    notifyAddToCart(product.name);

    setActiveAdd(product.id);
    setTimeout(() => setActiveAdd(null), 1200);
  };

  const handleToggleWishlist = (product: AppProduct) => {
    if (isWishlisted(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:gap-5">
        {products.map((product) => {
          const wished = isWishlisted(product.id);
          const isAdding = activeAdd === product.id;

          return (
            <motion.article
              key={product.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:border-[#d6cc6d]/40 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
            >
              <div className="relative h-36 w-full bg-white sm:h-40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain transition-opacity duration-500 group-hover:opacity-0"
                />
                <Image
                  src={product.hoverImage ?? product.image}
                  alt=""
                  fill
                  className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <button
                  onClick={() => handleToggleWishlist(product)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60"
                >
                  <Heart
                    size={14}
                    className={
                      wished ? "fill-[#ff7ab8] text-[#ff7ab8]" : "text-white"
                    }
                  />
                </button>

                {product.isHotStuff && (
                  <div className="absolute left-2 top-2 rounded-full bg-[#111014]/80 px-2 py-1 text-[10px] font-medium text-[#f5e4b5]">
                    Hot Stuff
                  </div>
                )}
              </div>

              <div className="flex flex-col px-3 py-2">
                <h3 className="line-clamp-2 text-[12px] font-medium text-neutral-900">
                  {product.name}
                </h3>

                <p className="mt-1 text-[13px] font-semibold text-[#111014] transition-all duration-300 group-hover:text-[#d6cc6d] group-hover:drop-shadow-[0_0_6px_rgba(214,204,109,0.4)]">
                  {product.price}
                </p>

                <div className="mt-1 flex items-center gap-1 text-[10px]">
                  {renderStars(product.rating)}
                </div>

                <div className="mt-2 flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    className={`flex-1 rounded-full py-1.5 text-[11px] font-medium transition-all ${
                      isAdding
                        ? "bg-[#d6cc6d] text-black"
                        : "bg-[#111014] text-white hover:bg-black"
                    }`}
                  >
                    {isAdding ? "Added" : "Add"}
                  </motion.button>

                  <button
                    onClick={() => setSelected(product)}
                    className="flex-1 rounded-full border border-[#d6cc6d]/60 py-1.5 text-[11px] text-[#bfb45f] hover:bg-[#111014] hover:text-[#d6cc6d]"
                  >
                    Details
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <ProductDetailModal
        product={
          selected
            ? {
                ...selected,
                images: selected.images.slice(0, 3),
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

export default ProductTileGrid;
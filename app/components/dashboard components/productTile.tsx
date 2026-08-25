"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Check,
} from "lucide-react";

import { useCart } from "../../contexts/cartContext";
import ProductDetailModal from "@/app/components/dashboard components/productDetailModal";
import { useFynaroToast } from "@/app/components/dashboard components/common/fynaroToast";
import { useWishlist } from "@/app/contexts/wishlistContext";
import { products } from "@/app/data/product";
import { AppProduct } from "@/app/types/product";

type ProductStatus =
  | "Available Now"
  | "Made to Order"
  | "Custom"
  | "Pre-Order";

const renderStars = (rating: number) => (
  <span className="inline-flex items-center gap-[1px]">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-[#f58220] text-[#f58220]"
            : "text-neutral-300"
        }`}
      />
    ))}
  </span>
);

function ProductStatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  const styles: Record<ProductStatus, string> = {
    "Available Now":
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    "Made to Order":
      "border-orange-200 bg-orange-50 text-[#d96708]",

    Custom:
      "border-violet-200 bg-violet-50 text-violet-700",

    "Pre-Order":
      "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-[3px] text-[8px] font-bold uppercase tracking-[0.08em] backdrop-blur-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
}

const ProductTileGrid: React.FC = () => {
  const { addToCart } = useCart();
  const { notifyAddToCart } = useFynaroToast();

  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useWishlist();

  const [selected, setSelected] =
    useState<AppProduct | null>(null);

  const [activeAdd, setActiveAdd] =
    useState<number | string | null>(null);

  const handleAddToCart = (product: AppProduct) => {
    addToCart(product);

    notifyAddToCart(product.name);

    setActiveAdd(product.id);

    setTimeout(() => {
      setActiveAdd(null);
    }, 1200);
  };

  const handleToggleWishlist = (
    product: AppProduct
  ) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  /*
    PUBLIC SHOP FILTER

    Products can exist in your dashboard
    without automatically appearing publicly.
  */

  const publicProducts = products.filter(
    (product) =>
      product.isPublished !== false &&
      product.isFulfilled !== false
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">

        {publicProducts.map((product) => {
          const wished = isWishlisted(product.id);

          const isAdding =
            activeAdd === product.id;

          /*
            Fallback values so your current
            product data does not immediately break.
          */

          const status =
            (product.status as ProductStatus) ??
            (product.isFulfilled
              ? "Available Now"
              : "Made to Order");

          return (
            <motion.article
              key={product.id}
              whileHover={{ y: -3 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                group
                flex
                min-w-0
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-neutral-200
                bg-white
                transition-all
                duration-300
                hover:border-[#f58220]/30
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]
              "
            >
              {/* =====================================
                  PRODUCT IMAGE
              ===================================== */}

              <div className="relative aspect-square w-full overflow-hidden bg-[#f7f7f7]">

                {/* Main image */}

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 1024px) 33vw,
                    (max-width: 1280px) 25vw,
                    20vw
                  "
                  className="
                    object-contain
                    p-3
                    transition-all
                    duration-500
                    group-hover:scale-[1.03]
                    group-hover:opacity-0
                  "
                />

                {/* Hover image */}

                <Image
                  src={
                    product.hoverImage ??
                    product.image
                  }
                  alt=""
                  fill
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 1024px) 33vw,
                    (max-width: 1280px) 25vw,
                    20vw
                  "
                  className="
                    object-contain
                    p-3
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:scale-[1.03]
                    group-hover:opacity-100
                  "
                />

                {/* STATUS BADGE */}

                <div className="absolute left-2 top-2">
                  <ProductStatusBadge
                    status={status}
                  />
                </div>

                {/* WISHLIST */}

                <button
                  type="button"
                  onClick={() =>
                    handleToggleWishlist(product)
                  }
                  aria-label={
                    wished
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className="
                    absolute
                    right-2
                    top-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-white/90
                    text-neutral-700
                    shadow-sm
                    backdrop-blur
                    transition
                    hover:bg-white
                    hover:scale-105
                  "
                >
                  <Heart
                    size={15}
                    className={
                      wished
                        ? "fill-[#f58220] text-[#f58220]"
                        : "text-neutral-700"
                    }
                  />
                </button>
              </div>

              {/* =====================================
                  PRODUCT CONTENT
              ===================================== */}

              <div className="flex flex-1 flex-col p-3">

                {/* CATEGORY */}

                {product.category && (
                  <p className="
                    truncate
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-[#f58220]
                  ">
                    {product.category}
                  </p>
                )}

                {/* NAME */}

                <h3 className="
                  mt-1
                  line-clamp-2
                  min-h-[34px]
                  text-[12px]
                  font-semibold
                  leading-[1.4]
                  text-neutral-900
                  transition
                  group-hover:text-[#f58220]
                ">
                  {product.name}
                </h3>

                {/* PRICE */}

                <div className="mt-2">
                  <p className="
                    text-[14px]
                    font-bold
                    tracking-[-0.2px]
                    text-neutral-900
                  ">
                    {product.price}
                  </p>
                </div>

                {/* RATING */}

                <div className="mt-1.5 flex items-center gap-1.5">

                  {renderStars(product.rating)}

                  {product.reviewsCount !== undefined && (
                    <span className="
                      text-[9px]
                      text-neutral-400
                    ">
                      ({product.reviewsCount})
                    </span>
                  )}

                </div>

                {/* PUSH BUTTONS DOWN */}

                <div className="flex-1" />

                {/* =====================================
                    ACTIONS
                ===================================== */}

                <div className="mt-3 flex gap-2">

                  {/* ADD TO CART */}

                  <motion.button
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                    className={`
                      flex
                      h-8
                      flex-1
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      text-[10px]
                      font-semibold
                      transition-all
                      ${
                        isAdding
                          ? "bg-[#f58220] text-white"
                          : "bg-[#242424] text-white hover:bg-[#f58220]"
                      }
                    `}
                  >
                    {isAdding ? (
                      <>
                        <Check size={13} />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={13} />
                        Add to cart
                      </>
                    )}
                  </motion.button>

                  {/* DETAILS */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelected(product)
                    }
                    aria-label={`View ${product.name}`}
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-neutral-200
                      text-neutral-600
                      transition
                      hover:border-[#f58220]
                      hover:bg-[#fff5ed]
                      hover:text-[#f58220]
                    "
                  >
                    <Eye size={14} />
                  </button>

                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* =====================================
          PRODUCT DETAIL MODAL
      ===================================== */}

      <ProductDetailModal
        product={
          selected
            ? {
                ...selected,

                images:
                  selected.images?.slice(0, 4) ?? [
                    selected.image,
                  ],

                reviewsCount:
                  selected.reviewsCount ?? 0,

                isFulfilled:
                  selected.isFulfilled ?? true,
              }
            : null
        }
        open={!!selected}
        onClose={() => setSelected(null)}
        onAddToCart={(product) =>
          handleAddToCart(
            product as AppProduct
          )
        }
      />
    </>
  );
};

export default ProductTileGrid;
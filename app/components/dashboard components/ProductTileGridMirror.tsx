"use client";

import React, { useMemo, useState } from "react";
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

/* =========================================================
   STAR RATING
========================================================= */

const renderStars = (rating: number) => (
  <span className="inline-flex items-center gap-[1px]">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating)
            ? "fill-[#f58220] text-[#f58220]"
            : "text-neutral-300"
          }`}
      />
    ))}
  </span>
);

/* =========================================================
   PRODUCT STATUS
========================================================= */

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
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2
        py-[3px]
        text-[7px]
        font-bold
        uppercase
        tracking-[0.08em]
        backdrop-blur-sm
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}

/* =========================================================
   PRODUCT GRID MIRROR
========================================================= */

const ProductTileGridMirror: React.FC = () => {
  const { addToCart } = useCart();

  const { notifyAddToCart } =
    useFynaroToast();

  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useWishlist();

  const [selected, setSelected] =
    useState<AppProduct | null>(null);

  const [activeAdd, setActiveAdd] =
    useState<number | string | null>(null);

  /*
    PUBLIC PRODUCTS

    Products can exist inside your dashboard
    without automatically appearing in the
    NewJersey.ng public shop.
  */

  const displayProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.isPublished !== false &&
          product.isFulfilled !== false
      )
      .slice(0, 18);
  }, []);

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = (
    product: AppProduct
  ) => {
    addToCart(product);

    notifyAddToCart(product.name);

    setActiveAdd(product.id);

    setTimeout(() => {
      setActiveAdd(null);
    }, 1200);
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

  const handleToggleWishlist = (
    product: AppProduct
  ) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <section className="w-full">

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            sm:gap-4
            lg:grid-cols-4
            lg:gap-4
            xl:grid-cols-6
            xl:gap-4
          "
        >
          {displayProducts.map((product) => {
            const wished =
              isWishlisted(product.id);

            const isAdding =
              activeAdd === product.id;

            /*
              PRODUCT STATUS FALLBACK
            */

            const status =
              (product.status as ProductStatus) ??
              "Available Now";

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
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-[#f58220]/30
                  hover:shadow-[0_10px_25px_rgba(0,0,0,0.10)]
                "
              >

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                <div
                  className="
                    relative
                    aspect-square
                    w-full
                    overflow-hidden
                    bg-[#f7f7f7]
                  "
                >
                  {/* MAIN IMAGE */}

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="
                      (max-width: 640px) 50vw,
                      (max-width: 768px) 33vw,
                      (max-width: 1280px) 25vw,
                      16vw
                    "
                    className="
                      object-contain
                      p-3
                      transition-all
                      duration-500
                      group-hover:scale-[1.02]
                      group-hover:opacity-0
                    "
                  />

                  {/* HOVER IMAGE */}

                  <Image
                    src={
                      product.hoverImage ??
                      product.image
                    }
                    alt=""
                    fill
                    sizes="
                      (max-width: 640px) 50vw,
                      (max-width: 768px) 33vw,
                      (max-width: 1280px) 25vw,
                      16vw
                    "
                    className="
                      object-contain
                      p-3
                      opacity-0
                      transition-all
                      duration-500
                      group-hover:scale-[1.02]
                      group-hover:opacity-100
                    "
                  />

                  {/* STATUS */}

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
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-white/90
                      text-neutral-700
                      shadow-sm
                      backdrop-blur-sm
                      transition-all
                      hover:scale-105
                      hover:bg-white
                    "
                  >
                    <Heart
                      size={14}
                      className={
                        wished
                          ? "fill-[#f58220] text-[#f58220]"
                          : "text-neutral-700"
                      }
                    />
                  </button>
                </div>

                {/* =================================================
                    PRODUCT CONTENT
                ================================================= */}

                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    px-3
                    pb-3
                    pt-2.5
                  "
                >

                  {/* CATEGORY */}

                  {product.category && (
                    <p
                      className="
                        truncate
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-[#f58220]
                      "
                    >
                      {product.category}
                    </p>
                  )}

                  {/* PRODUCT NAME */}

                  <h3
                    className="
                      mt-1
                      line-clamp-2
                      min-h-[34px]
                      text-[11px]
                      font-semibold
                      leading-[1.45]
                      text-neutral-900
                      transition-colors
                      group-hover:text-[#f58220]
                    "
                  >
                    {product.name}
                  </h3>

                  {/* PRICE */}

                  <p
                    className="
                      mt-1.5
                      text-[13px]
                      font-bold
                      tracking-[-0.2px]
                      text-neutral-900
                    "
                  >
                    {product.price}
                  </p>

                  {/* RATING */}

                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-1
                    "
                  >
                    {renderStars(product.rating)}

                    {product.reviewsCount !== undefined && (
                      <span
                        className="
                          text-[8px]
                          text-neutral-400
                        "
                      >
                        ({product.reviewsCount})
                      </span>
                    )}
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div
                    className="
                      mt-auto
                      flex
                      gap-1.5
                      pt-3
                    "
                  >

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
                        gap-1
                        rounded-lg
                        text-[9px]
                        font-semibold
                        transition-all
                        ${isAdding
                          ? "bg-[#f58220] text-white"
                          : "bg-[#242424] text-white hover:bg-[#f58220]"
                        }
                      `}
                    >
                      {isAdding ? (
                        <>
                          <Check size={12} />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={12} />
                          Add
                        </>
                      )}
                    </motion.button>

                    {/* VIEW DETAILS */}

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
                        transition-all
                        hover:border-[#f58220]
                        hover:bg-[#fff5ed]
                        hover:text-[#f58220]
                      "
                    >
                      <Eye size={13} />
                    </button>

                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          PRODUCT DETAIL MODAL
      ========================================================= */}

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

export default ProductTileGridMirror;
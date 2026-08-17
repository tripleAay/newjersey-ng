"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DetailedProduct } from "@/app/components/dashboard components/productTile";
import ProductReviewPanel from "@/app/components/dashboard components/productReviewPanel";

interface ProductDetailModalProps {
  product: DetailedProduct | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (product: DetailedProduct) => void;
}

const renderStars = (rating: number) => {
  const stars: React.ReactNode[] = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  for (let i = 0; i < full; i++) {
    stars.push(
      <span key={`full-${i}`} className="text-[#F5B400] text-sm">
        ★
      </span>
    );
  }

  if (half) {
    stars.push(
      <span key="half" className="text-[#F5B400] text-sm">
        ☆
      </span>
    );
  }

  while (stars.length < 5) {
    stars.push(
      <span key={`empty-${stars.length}`} className="text-gray-300 text-sm">
        ★
      </span>
    );
  }

  return <div className="inline-flex items-center gap-1">{stars}</div>;
};

export default function ProductDetailModal({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setShowReviewPanel(false);
  }, [product?.id, open]);

  const mainImage = useMemo(
    () => product?.images?.[activeIndex] ?? product?.image ?? "",
    [product, activeIndex]
  );

  if (!product) return null;

  const handleSubmitReview = (payload: {
    name: string;
    rating: number;
    review: string;
  }) => {
    console.log("SUBMIT REVIEW:", {
      productId: product.id,
      productName: product.name,
      ...payload,
    });

    setShowReviewPanel(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close product details"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            layout
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/96 p-5 shadow-[0_22px_65px_rgba(0,0,0,0.35)] md:max-w-3xl md:rounded-[1.75rem] md:p-8"
            initial={{ opacity: 0, y: 40, scale: 0.94, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.97,
              filter: "blur(4px)",
              transition: { duration: 0.35, ease: "easeInOut" },
            }}
          >
            <button
              className="absolute right-3 top-3 text-neutral-400 transition hover:text-neutral-800 sm:right-4 sm:top-4"
              onClick={onClose}
              aria-label="Close product details"
            >
              <X className="h-5 w-5" />
            </button>

            <AnimatePresence mode="wait">
              {!showReviewPanel ? (
                <motion.div
                  key="product-info"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="grid items-center gap-7 md:grid-cols-2">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50 shadow-inner md:rounded-2xl">
                      {mainImage && (
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 80vw, 40vw"
                          className="object-contain"
                        />
                      )}
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-[#111014] sm:text-2xl md:text-3xl">
                          {product.name}
                        </h2>

                        <div className="flex items-center gap-2">
                          {renderStars(product.rating ?? 0)}
                          <span className="text-xs text-gray-500">
                            {(product.reviewsCount ?? 0).toLocaleString()} ratings
                          </span>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-neutral-600 sm:text-[0.95rem]">
                        {product.description}
                      </p>

                      <ul className="space-y-2 text-sm text-neutral-700">
                        {product.specs.map((spec) => (
                          <li key={spec.label}>
                            <strong>{spec.label}:</strong> {spec.value}
                          </li>
                        ))}
                      </ul>

                      <p className="text-xl font-semibold text-[#111014] sm:text-2xl">
                        {product.price}
                      </p>

                      {onAddToCart && (
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => onAddToCart(product)}
                          className="w-full rounded-full bg-[#111014] px-7 py-3 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-xl sm:w-auto sm:px-9"
                        >
                          Add to Cart
                        </motion.button>
                      )}

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewPanel(true)}
                          className="text-sm font-semibold tracking-[0.02em] text-[#c8a96a] underline decoration-[#d6cc6d]/50 underline-offset-4 transition hover:text-[#8f8440]"
                        >
                          Leave a review & rating
                        </button>
                      </div>
                    </div>
                  </div>

                  {product.images?.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-2.5 pt-2 sm:gap-3">
                      {product.images.map((img, i) => {
                        const isActive = i === activeIndex;

                        return (
                          <button
                            key={img + i}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className={`relative h-12 w-12 overflow-hidden rounded-lg border transition sm:h-16 sm:w-16 ${
                              isActive
                                ? "border-[#111014]"
                                : "border-neutral-200 hover:border-neutral-500"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`${product.name} ${i + 1}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ) : (
                <ProductReviewPanel
                  key="review-panel"
                  productName={product.name}
                  onBack={() => setShowReviewPanel(false)}
                  onSubmitReview={handleSubmitReview}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
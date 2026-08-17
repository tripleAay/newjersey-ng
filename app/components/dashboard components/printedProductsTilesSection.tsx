"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PrintedProduct = {
  id: string | number;
  title: string | null;
  category: string | null;
  subtitle?: string | null;
  price?: string | null;
  status?: "Active" | "Draft" | "Archived" | "Published" | null;
  description?: string | null;
  image?: string | null;
  material?: string | null;
  delivery?: string | null;
  link?: string | null;
};

type PrintedProductsResponse = {
  products: PrintedProduct[];
};

function getProductBadge(product: PrintedProduct) {
  return product.category || "Printed Product";
}

export default function PrintedProductsTilesSection() {
  const [products, setProducts] = useState<PrintedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/products", {
        method: "GET",
        cache: "no-store",
      });

      const text = await res.text();

      let data: PrintedProductsResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error("Failed to fetch printed products");
      }

      setProducts(data.products ?? []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to load printed products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const activeProducts = useMemo(() => {
    return products.filter((product) => {
      const status = product.status?.toLowerCase();
      return status === "active" || status === "published" || !status;
    });
  }, [products]);

  return (
    <section className="relative py-18 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,#141416_0%,#0c0c0e_55%,#080809_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
              >
                <div className="h-52 animate-pulse bg-white/5" />
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-4/6 animate-pulse rounded-full bg-white/10" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-9 flex-1 animate-pulse rounded-full bg-white/10" />
                    <div className="h-9 flex-1 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-red-400/20 bg-red-500/5 p-6 text-sm text-red-200">
            {error}
          </div>
        ) : !activeProducts.length ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-sm text-white/55">
              No printed products available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {activeProducts.map((product, index) => {
              const badge = getProductBadge(product);

              return (
                <motion.article
                  key={String(product.id)}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="group overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,#141416_0%,#0c0c0e_55%,#080809_100%)] text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-[#d6cc6d]/30 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={product.image || "/images/tote-bag.jpg"}
                      alt={product.title || "Printed product image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-[#d6cc6d]/35 bg-black/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#e8d78a] backdrop-blur-sm">
                      {badge}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d6cc6d]/10 text-[#d6cc6d] ring-1 ring-[#d6cc6d]/15">
                        <ShoppingBag className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-white">
                          {product.title || "Untitled Product"}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-[#eadb97]">
                          {product.price || "Request Quote"}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-4 text-sm leading-7 text-white/60">
                      {product.subtitle ||
                        product.description ||
                        "A refined printed product designed to carry your brand beautifully into the real world."}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/35">
                      <span>{product.material || "Premium Finish"}</span>
                      <span>{product.delivery || "Made to Order"}</span>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <motion.div
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Link
                          href={`/shop/printed-products/${product.id}`}
                          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#d6cc6d] px-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition duration-300 hover:bg-[#e5d98a]"
                        >
                          View Product
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>

                      {product.link ? (
                        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            href={product.link}
                            target="_blank"
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:border-[#d6cc6d]/35 hover:bg-[#171611]"
                          >
                            Order
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </motion.div>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
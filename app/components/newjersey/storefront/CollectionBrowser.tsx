"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { NewJerseyProduct } from "@/app/types/commerce";
import type { StoreProduct } from "@/app/lib/newjersey/storefront/catalogue";
import ProductGrid from "./ProductGrid";
export default function CollectionBrowser({
  products,
  department,
}: {
  products: NewJerseyProduct[];
  department: "print" | "branding" | "apparel";
}) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState("featured"),
    [topic, setTopic] = useState("all");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = products.filter(
      (p) =>
        (!q || (p.name + " " + p.description).toLowerCase().includes(q)) &&
        (topic === "all" || (p as StoreProduct).topic === topic),
    );
    if (sort !== "featured")
      result.sort((a, b) => {
        const av =
            a.pricing.type === "quote"
              ? Infinity
              : (a.pricing.basePrice ?? Infinity),
          bv =
            b.pricing.type === "quote"
              ? Infinity
              : (b.pricing.basePrice ?? Infinity);
        if (av === Infinity) return bv === Infinity ? 0 : 1;
        if (bv === Infinity) return -1;
        return sort === "low" ? av - bv : bv - av;
      });
    return result;
  }, [products, query, sort, topic]);
  const topics = [
    ["all", "All services"],
    ["signage", "Signage"],
    ["vehicle", "Vehicle"],
    ["space", "Spaces"],
    ["identity", "Identity"],
  ];
  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 border-y border-black/10 py-4 sm:flex-row sm:items-center">
        <label className="flex min-h-11 max-w-md flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3">
          <Search size={16} className="text-[#8A8379]" aria-hidden="true" />
          <span className="sr-only">Search this collection</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this collection"
            className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none sm:text-xs"
          />
        </label>
        <div className="flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-xs text-[#625D55]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
          <label className="text-xs text-[#625D55]">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="min-h-11 rounded-lg border border-black/10 bg-white px-3"
            >
              <option value="featured">Featured first</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
      {department === "branding" && (
        <div
          className="mb-5 flex flex-wrap gap-2"
          aria-label="Branding collections"
        >
          {topics.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={topic === id}
              onClick={() => setTopic(id)}
              className={`min-h-11 rounded-full border px-4 text-xs ${topic === id ? "border-[#FF6B00] bg-[#FF6B00] text-[#181818]" : "border-black/10 bg-white text-[#625D55]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {filtered.length ? (
        <ProductGrid
          key={query + sort + topic}
          products={filtered}
          department={department}
        />
      ) : (
        <p role="status" className="py-12 text-center text-sm text-[#625D55]">
          No products match. Try another search or collection.
        </p>
      )}
    </>
  );
}

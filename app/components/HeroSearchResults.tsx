"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import ProductImage from "./newjersey/storefront/ProductImage";

type SearchProduct = {
  id: string;
  name: string;
  image?: string | null;
  href: string;
  department: string;
  pricing?: {
    type?: string;
    basePrice?: number | null;
  } | null;
};

type SearchResponse = {
  results?: SearchProduct[];
  total?: number;
  error?: string;
};

type SearchState = {
  query: string;
  status: "loading" | "success" | "error";
  results: SearchProduct[];
  total: number;
  error: string;
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatPrice(product: SearchProduct) {
  const pricing = product.pricing;
  const price = pricing?.basePrice;

  if (
    pricing?.type === "quote" ||
    typeof price !== "number" ||
    !Number.isFinite(price)
  ) {
    return "View pricing";
  }

  const prefix =
    pricing?.type === "starting-from" ||
    pricing?.type === "starting_from"
      ? "From "
      : "";

  return `${prefix}${currency.format(price)}`;
}

export default function HeroSearchResults({
  query,
  onSearch,
  onClose,
}: {
  query: string;
  onSearch: (query: string) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState(query);
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState<SearchState>({
    query,
    status: "loading",
    results: [],
    total: 0,
    error: "",
  });

  const headingRef = useRef<HTMLHeadingElement>(null);

  const loading =
    state.query !== query || state.status === "loading";

  const error =
    state.query === query && state.status === "error"
      ? state.error
      : "";

  const results = loading || error ? [] : state.results;

  useEffect(() => {
    setInput(query);
    headingRef.current?.focus({ preventScroll: true });
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function search() {
      setState({
        query,
        status: "loading",
        results: [],
        total: 0,
        error: "",
      });

      try {
        const response = await fetch(
          `/api/storefront/search?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (
          !response.headers
            .get("content-type")
            ?.includes("application/json")
        ) {
          throw new Error(
            "Search returned an unexpected response. Please try again.",
          );
        }

        const data: SearchResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to search products.",
          );
        }

        if (!Array.isArray(data.results)) {
          throw new Error(
            "Search returned an unexpected response. Please try again.",
          );
        }

        if (controller.signal.aborted) return;

        setState({
          query,
          status: "success",
          results: data.results,
          total:
            typeof data.total === "number"
              ? data.total
              : data.results.length,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          query,
          status: "error",
          results: [],
          total: 0,
          error:
            error instanceof Error
              ? error.message
              : "Unable to search products. Please try again.",
        });
      }
    }

    void search();

    return () => controller.abort();
  }, [query, retry]);

  return (
    <section
      aria-label="Product search results"
      className="relative min-h-[680px] bg-[#D4C685] px-5 py-10 text-[#1A1A1A] sm:px-8 lg:px-10 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#743600]">
              NewJersey.ng / Search
            </p>

            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 break-words text-2xl font-black tracking-tight outline-none sm:text-4xl"
            >
              Results for “{query}”
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search and return to hero"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white/60 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();

            const value = input.trim();

            if (!value) return;

            if (value === query) {
              setRetry((previous) => previous + 1);
            } else {
              onSearch(value);
            }
          }}
          className="mt-7 flex min-h-14 max-w-2xl items-center rounded-2xl bg-white p-1.5 shadow-sm"
        >
          <label
            htmlFor="hero-results-query"
            className="sr-only"
          >
            Search products
          </label>

          <input
            id="hero-results-query"
            name="q"
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search business cards, jerseys, mugs..."
            required
            maxLength={120}
            enterKeyHint="search"
            className="min-w-0 flex-1 rounded-lg bg-transparent px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
          />

          <button
            type="submit"
            aria-label="Search products"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00] text-black transition-colors hover:bg-[#E85F00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Search size={19} aria-hidden="true" />
          </button>
        </form>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-6"
        >
          {loading ? (
            <p className="flex items-center gap-2 text-sm">
              <LoaderCircle
                size={17}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
              Searching the catalogue…
            </p>
          ) : error ? (
            <div className="rounded-xl border border-black/10 bg-white/75 p-5">
              <p className="text-sm">{error}</p>

              <button
                type="button"
                onClick={() =>
                  setRetry((previous) => previous + 1)
                }
                className="mt-3 min-h-11 rounded text-sm font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                Try again
              </button>
            </div>
          ) : (
            <p className="text-sm text-black/70">
              {state.total > 0
                ? `${state.total} product${
                    state.total === 1 ? "" : "s"
                  } found${
                    state.total > results.length
                      ? ` · Showing ${results.length}`
                      : ""
                  }`
                : "No matching products. Try a different name or category."}
            </p>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {results.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-black/[0.07] bg-white transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <div className="flex h-36 items-center justify-center overflow-hidden bg-[#F5F4F0] sm:h-40">
                  {product.image ? (
                    <ProductImage
                      src={product.image}
                      name={product.name}
                    />
                  ) : (
                    <span className="px-4 text-center text-xs text-[#7A7368]">
                      Image coming soon
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8A3B00]">
                    {product.department}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-xs font-semibold leading-5">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-[13px] font-bold">
                    {formatPrice(product)}
                  </p>

                  <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-[11px] font-semibold text-[#984000]">
                    View product
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
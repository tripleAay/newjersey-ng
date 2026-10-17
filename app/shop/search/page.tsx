import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { products } from "@/app/data/newjersey/products";
import {
  APPAREL_FIELDS,
  toApparelProduct,
  type ApparelRow,
} from "@/app/lib/newjersey/apparel/catalogue";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search | NewJersey.ng",
  description: "Find printing, jerseys, apparel and branding services.",
};

type Props = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

type Result = {
  id: string;
  name: string;
  description: string;
  href: string;
  category: string;
  score: number;
};

const departments = [
  {
    name: "Custom printing",
    href: "/shop/custom",
    description: "Print your artwork or request design assistance.",
    keywords:
      "custom printing branded logo tshirt shirts polo hoodies artwork design assistance uniforms",
  },
  {
    name: "Printing",
    href: "/shop/print",
    description: "Business cards, flyers, banners and printed materials.",
    keywords:
      "print printing business card cards flyer flyers poster posters banner banners sticker stickers brochure brochures envelope envelopes letterhead stationery packaging",
  },
  {
    name: "Jerseys",
    href: "/shop/jerseys",
    description: "Choose your team, kit, size, printed name and number.",
    keywords:
      "jersey jerseys football soccer team kit kits home away third player name number personalisation personalization",
  },
  {
    name: "Apparel",
    href: "/shop/apparel",
    description: "Printed clothing and branded apparel.",
    keywords:
      "apparel clothing clothes shirt shirts tshirt tshirts polo polos hoodie hoodies cap caps uniform uniforms",
  },
  {
    name: "Branding",
    href: "/shop/branding",
    description: "Explore branding and design services.",
    keywords: "branding brand identity logo logos design business corporate",
  },
];

const synonyms: Record<string, string[]> = {
  soccer: ["jersey", "football"],
  football: ["jersey"],
  kit: ["jersey"],
  kits: ["jersey"],
  tshirt: ["shirt"],
  tshirts: ["shirt"],
  tees: ["shirt"],
  stationery: ["card", "letterhead", "envelope"],
  leaflet: ["flyer"],
  leaflets: ["flyer"],
  logo: ["branding"],
  logos: ["branding"],
};

function normalise(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/t[\s-]+shirts?/g, "tshirt")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchTerms(query: string) {
  const ignored = new Set([
    "a",
    "an",
    "the",
    "for",
    "and",
    "of",
    "i",
    "want",
    "need",
    "buy",
    "me",
    "please",
  ]);

  const words = normalise(query)
    .split(" ")
    .filter((word) => word && !ignored.has(word))
    .slice(0, 6);

  return Array.from(
    new Set(words.flatMap((word) => [word, ...(synonyms[word] ?? [])])),
  ).slice(0, 12);
}

function score(
  name: string,
  description: string,
  terms: string[],
  query: string,
) {
  const title = normalise(name);
  const body = normalise(description);
  const phrase = normalise(query);

  let result = phrase && title.includes(phrase) ? 12 : 0;

  for (const term of terms) {
    if (title.includes(term)) result += 4;
    else if (body.includes(term)) result += 1;
  }

  return result;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;

  const query =
    typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";

  const terms = searchTerms(query);

  const matchingDepartments = terms.length
    ? departments.filter((department) =>
        terms.some((term) =>
          normalise(`${department.name} ${department.keywords}`).includes(term),
        ),
      )
    : [];

  const results: Result[] = [];

  // Search the existing print catalogue used by /shop/print.
  if (terms.length) {
    for (const product of products) {
      if (
        product.published === false ||
        !["print", "apparel"].includes(product.category)
      ) {
        continue;
      }

      const relevance = score(
        product.name,
        product.description ?? "",
        terms,
        query,
      );

      if (relevance <= 0) continue;

      results.push({
        id: `catalogue-${product.id}`,
        name: product.name,
        description: product.shortDescription || product.description || "",
        href:
          product.slug === "custom-jerseys"
            ? "/shop/jerseys"
            : `/shop/${product.category === "apparel" ? "custom" : "print"}/${encodeURIComponent(product.slug)}`,
        category:
          product.category === "apparel" ? "Custom printing" : "Printing",
        score: relevance,
      });
    }
  }

  let catalogueUnavailable = false;

  if (terms.length) {
    try {
      const supabase = getSupabaseAdmin();

      // Separate parameterised filters avoid raw search expressions.
      // Search names and descriptions for each keyword.
      const lookups = await Promise.all(
        terms.flatMap((term) =>
          ["name", "description"].map(async (column) => {
            const pattern = `%${term.replace(/[\\%_]/g, "\\$&")}%`;

            return supabase
              .from("products")
              .select(`${APPAREL_FIELDS},category`)
              .eq("publication_status", "published")
              .ilike(column, pattern)
              .order("name")
              .limit(24);
          }),
        ),
      );

      const seen = new Set<string>();

      for (const lookup of lookups) {
        if (lookup.error) {
          catalogueUnavailable = true;
          console.error("[Shop search]", lookup.error);
          continue;
        }

        for (const product of lookup.data ?? []) {
          const id = String(product.id);

          if (seen.has(id)) continue;
          seen.add(id);

          if (
            product.apparel_enabled &&
            !toApparelProduct(product as unknown as ApparelRow)
          )
            continue;
          if (!product.slug && !product.jersey_enabled) {
            continue;
          }

          results.push({
            id: `database-${id}`,
            name: product.name,
            description: product.description || "",
            category: product.jersey_enabled
              ? "Jerseys"
              : product.category || "Product",
            href: product.jersey_enabled
              ? "/shop/jerseys"
              : product.apparel_enabled
                ? `/shop/apparel/${encodeURIComponent(product.slug)}`
                : `/shop/products/${encodeURIComponent(product.slug)}`,
            score: score(product.name, product.description || "", terms, query),
          });
        }
      }
    } catch (error) {
      catalogueUnavailable = true;
      console.error("[Shop search connection]", error);
    }
  }

  const sortedResults = results
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 48);

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-sm backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto max-w-[1344px] px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center text-sm text-[#625D55] underline underline-offset-4"
        >
          Back to shop
        </Link>

        <h1 className="mt-5 break-words text-3xl font-semibold tracking-tight">
          {query ? `Results for “${query}”` : "What are you looking for?"}
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
          Find products and services across NewJersey.ng.
        </p>

        <form
          action="/shop/search"
          method="get"
          role="search"
          aria-label="Search the shop"
          className="mt-6 flex max-w-2xl items-center gap-2 rounded-xl border border-black/15 bg-white p-2"
        >
          <Search
            size={18}
            aria-hidden="true"
            className="ml-2 shrink-0 text-[#625D55]"
          />

          <input
            key={query}
            type="search"
            name="q"
            defaultValue={query}
            required
            maxLength={120}
            aria-label="Products and services"
            placeholder="Try business cards or football jerseys"
            className="min-h-11 min-w-0 flex-1 rounded-lg px-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
          />

          <button
            type="submit"
            className="min-h-11 rounded-lg bg-[#181818] px-4 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>

        {catalogueUnavailable && (
          <p role="status" className="mt-6 text-sm leading-6 text-[#625D55]">
            Some catalogue results could not be loaded. You can still browse the
            departments below or try again.
          </p>
        )}

        {(matchingDepartments.length > 0 || sortedResults.length === 0) && (
          <section className="mt-9" aria-label="Shop departments">
            <h2 className="text-sm font-semibold">
              {matchingDepartments.length
                ? "Relevant departments"
                : "Browse departments"}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {(matchingDepartments.length
                ? matchingDepartments
                : departments
              ).map((department) => (
                <Link
                  key={department.href}
                  href={department.href}
                  className="inline-flex min-h-11 items-center gap-3 rounded-full border border-black/10 bg-white px-4 text-sm hover:border-black/30"
                >
                  {department.name}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {sortedResults.length > 0 ? (
          <section className="mt-10" aria-label="Matching products">
            <h2 className="text-sm font-semibold">Matching products</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.href}
                  className="group flex flex-col rounded-xl border border-black/10 bg-white p-5 transition-colors hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A7368]">
                    {result.category}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold">{result.name}</h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#625D55]">
                    {result.description}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-semibold">
                    {result.category === "Jerseys"
                      ? "Choose your jersey"
                      : "View product"}
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : query && !catalogueUnavailable ? (
          <p className="mt-8 text-sm leading-7 text-[#625D55]">
            No individual products matched this search. Explore a department
            above or try a shorter phrase.
          </p>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";

import {
  loadApparel,
  loadDepartment,
  loadJerseys,
} from "@/app/lib/newjersey/storefront/load";

import { productHref } from "@/app/lib/newjersey/storefront/catalogue";
import type { NewJerseyProduct } from "@/app/types/commerce";

export const dynamic = "force-dynamic";

type SearchItem = {
  id: string;
  name: string;
  image: string;
  href: string;
  department: string;
  description: string;
  keywords: string;
  pricing: {
    type: string;
    basePrice: number | null;
  };
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function mapStoreProducts(
  products: NewJerseyProduct[],
  department: string,
  keywords: string,
): SearchItem[] {
  return products.map((product) => ({
    id: String(product.id),
    name: product.shortName || product.name,
    image: product.image || "",
    href: productHref(product),
    department,
    description: `${product.name} ${product.description ?? ""}`,
    keywords,
    pricing: {
      type: product.pricing.type,
      basePrice: product.pricing.basePrice ?? null,
    },
  }));
}

export async function GET(request: NextRequest) {
  const query =
    request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query || query.length > 120) {
    return NextResponse.json(
      {
        error: "Enter a search between 1 and 120 characters.",
      },
      { status: 400 },
    );
  }

  const normalizedQuery = normalize(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return NextResponse.json({
      results: [],
      total: 0,
    });
  }

  try {
    const [apparel, jerseys, prints, branding] =
      await Promise.all([
        loadApparel(),
        loadJerseys(),
        loadDepartment("print"),
        loadDepartment("branding"),
      ]);

    const jerseyItems: SearchItem[] = jerseys.map((product) => ({
      id: `jersey-${product.id}`,
      name: product.name,
      image: product.images[0] || "",

      // Your current jersey catalogue has no individual
      // product route. Link to the existing jersey collection.
      href: "/shop/jerseys",

      department: "Jerseys",
      description: [
        product.description,
        product.team,
        product.season,
        product.kit,
      ].join(" "),
      keywords: "jersey jerseys football sports team kits",
      pricing: {
        type: "fixed",
        // Jersey prices are stored in kobo.
        basePrice: product.priceMinor / 100,
      },
    }));

    const catalogue: SearchItem[] = [
      ...mapStoreProducts(
        apparel,
        "Apparel",
        "apparel clothing clothes shirts tshirts t shirts caps",
      ),
      ...jerseyItems,
      ...mapStoreProducts(
        prints,
        "Print",
        "print prints printing stationery",
      ),
      ...mapStoreProducts(
        branding,
        "Branding",
        "branding signage vehicle graphics",
      ),
    ];

    const matches = catalogue
      .flatMap((product) => {
        const name = normalize(product.name);

        const searchable = normalize(
          [
            product.name,
            product.description,
            product.department,
            product.keywords,
          ].join(" "),
        );

        if (!terms.every((term) => searchable.includes(term))) {
          return [];
        }

        const score =
          (name === normalizedQuery ? 10 : 0) +
          terms.reduce(
            (total, term) =>
              total + (name.includes(term) ? 3 : 1),
            0,
          );

        return [{ product, score }];
      })
      .sort((a, b) => b.score - a.score);

    // Use product IDs rather than URLs: jersey products
    // currently share the same collection URL.
    const unique = Array.from(
      new Map(
        matches.map(({ product }) => [product.id, product]),
      ).values(),
    );

    const results = unique
      .slice(0, 24)
      .map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        href: product.href,
        department: product.department,
        pricing: product.pricing,
      }));

    return NextResponse.json(
      {
        results,
        total: unique.length,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("[Storefront search]", error);

    return NextResponse.json(
      {
        error:
          "Search is unavailable right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
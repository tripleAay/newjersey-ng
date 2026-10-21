import { NextRequest, NextResponse } from "next/server";
import {
  loadApparel,
  loadDepartment,
  loadJerseys,
} from "@/app/lib/newjersey/storefront/load";
import { productHref } from "@/app/lib/newjersey/storefront/catalogue";

export const dynamic = "force-dynamic";

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query || query.length > 120) {
    return NextResponse.json(
      { error: "Enter a search between 1 and 120 characters." },
      { status: 400 },
    );
  }

  try {
    const [apparel, jerseys, prints, branding] = await Promise.all([
      loadApparel(),
      loadJerseys(),
      loadDepartment("print"),
      loadDepartment("branding"),
    ]);

    const groups = [
      {
        label: "Apparel",
        keywords: "apparel clothing clothes shirts tshirts t shirts caps",
        products: apparel,
      },
      {
        label: "Jerseys",
        keywords: "jersey jerseys sports football team kits",
        products: jerseys,
      },
      {
        label: "Print",
        keywords: "print prints printing stationery",
        products: prints,
      },
      {
        label: "Branding",
        keywords: "branding signage vehicle graphics",
        products: branding,
      },
    ];

    const terms = normalize(query).split(/\s+/).filter(Boolean);

    if (!terms.length) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const matches = groups.flatMap((group) =>
      group.products.flatMap((product) => {
        const name = normalize(
          `${product.name} ${product.shortName ?? ""}`,
        );

        const searchable = normalize(
          `${name} ${product.description ?? ""} ${group.keywords}`,
        );

        if (!terms.every((term) => searchable.includes(term))) return [];

        const href = productHref(product);

        return [
          {
            id: String(product.id),
            name: product.shortName || product.name,
            image: product.image,
            href,
            department: group.label,
            pricing: product.pricing,
            score: terms.reduce(
              (score, term) => score + (name.includes(term) ? 2 : 1),
              0,
            ),
          },
        ];
      }),
    );

    // A product can appear in more than one collection.
    const unique = Array.from(
      new Map(
        matches
          .sort((a, b) => b.score - a.score)
          .map((product) => [product.href, product]),
      ).values(),
    );

    return NextResponse.json(
      {
        results: unique.slice(0, 24).map(({ score, ...product }) => product),
        total: unique.length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[Hero search]", error);

    return NextResponse.json(
      { error: "Search is unavailable right now. Please try again." },
      { status: 500 },
    );
  }
}
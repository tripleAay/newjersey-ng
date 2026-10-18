import Link from "next/link";
import StoreShell from "@/app/components/newjersey/storefront/StoreShell";
import StoreSection from "@/app/components/newjersey/storefront/Section";
import ProductGrid from "@/app/components/newjersey/storefront/ProductGrid";
import JerseyShowcase from "@/app/shop/jerseys/JerseyShowcase";
import {
  loadDepartment,
  loadApparel,
  loadJerseys,
} from "@/app/lib/newjersey/storefront/load";
export const dynamic = "force-dynamic";
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").trim().slice(0, 120);
  const [print, apparel, branding, jerseys] = await Promise.all([
    loadDepartment("print"),
    loadApparel(),
    loadDepartment("branding"),
    loadJerseys(),
  ]);
  const tokens = normalize(q).split(/\s+/).filter(Boolean).slice(0, 10);
  const matches = (text: string) =>
    tokens.every((t) => normalize(text).includes(t));
  const p = print.filter((x) =>
      matches(
        x.name + " " + x.description + " printing print stationery packaging",
      ),
    ),
    a = apparel.filter((x) =>
      matches(x.name + " " + x.description + " apparel clothing clothes"),
    ),
    b = branding.filter((x) =>
      matches(x.name + " " + x.description + " branding " + x.topic),
    ),
    j = jerseys.filter((x) =>
      matches(
        x.name +
          " " +
          x.team +
          " " +
          x.season +
          " " +
          x.kit +
          " jersey jerseys football kit",
      ),
    );
  const total = p.length + a.length + b.length + j.length;
  return (
    <StoreShell>
      <main className="mx-auto max-w-[1344px] px-4 py-8 sm:px-8 lg:px-12">
        <Link href="/shop" className="text-xs text-[#625D55]">
          Back to shop
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Find your next idea.
        </h1>
        <form action="/shop/search" className="my-6 flex max-w-2xl gap-2">
          <label className="flex-1">
            <span className="sr-only">Search products</span>
            <input
              name="q"
              type="search"
              maxLength={120}
              defaultValue={q}
              placeholder="Search print, apparel, jerseys and branding"
              className="min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base"
            />
          </label>
          <button className="rounded-xl bg-[#FF6B00] px-5 text-sm font-semibold text-[#181818]">
            Search
          </button>
        </form>
        {!q ? (
          <div className="flex flex-wrap gap-3">
            {["print", "apparel", "jerseys", "branding"].map((s) => (
              <Link
                key={s}
                href={"/shop/" + s}
                className="rounded-full border border-black/10 px-5 py-3 text-sm capitalize"
              >
                {s}
              </Link>
            ))}
          </div>
        ) : (
          <>
            <p role="status" className="text-sm text-[#625D55]">
              {total} results for “{q}”
            </p>
            {!!a.length && (
              <StoreSection
                id="search-apparel"
                eyebrow="Apparel"
                title="Ready-designed clothing"
                description="Choose your size and colour."
                href="/shop/apparel"
              >
                <ProductGrid
                  products={a.slice(0, 12)}
                  department="apparel"
                  preview
                />
              </StoreSection>
            )}
            {!!j.length && (
              <div className="py-8">
                <JerseyShowcase products={j.slice(0, 8)} preview />
              </div>
            )}
            {!!p.length && (
              <StoreSection
                id="search-print"
                eyebrow="Print"
                title="Print products"
                description="Choose your specifications."
                href="/shop/print"
              >
                <ProductGrid
                  products={p.slice(0, 12)}
                  department="print"
                  preview
                />
              </StoreSection>
            )}
            {!!b.length && (
              <StoreSection
                id="search-branding"
                eyebrow="Branding"
                title="Branding for your business"
                description="Find the right application."
                href="/shop/branding"
              >
                <ProductGrid
                  products={b.slice(0, 12)}
                  department="branding"
                  preview
                />
              </StoreSection>
            )}
            {!total && (
              <p className="py-12 text-sm text-[#625D55]">
                Try a product name such as business cards, T-shirt, vehicle or
                your team’s name.
              </p>
            )}
          </>
        )}
      </main>
    </StoreShell>
  );
}

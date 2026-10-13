import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

function formatPrice(product: {
  price: number | string | null;
  currency: string | null;
  sale_mode: string | null;
}) {
  if (product.sale_mode === "quote") return "Price on request";

  const amount = Number(product.price);

  if (product.price === null || !Number.isFinite(amount)) {
    return "Price not set";
  }

  const currency = product.currency || "NGN";
  let formatted: string;

  try {
    formatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    formatted = `${currency} ${amount.toLocaleString("en-NG")}`;
  }

  return product.sale_mode === "starting_from"
    ? `From ${formatted}`
    : formatted;
}

export default async function ProductsPage() {
  await requireStoreAdmin();

  const supabase = getSupabaseAdmin();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, category, price, currency, sale_mode, publication_status, featured",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[NewJersey Products]", error);
    throw new Error("Unable to load products.");
  }

  return (
    <main className="min-w-0 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Products
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Select a product to view its details.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#181818] px-4 text-sm font-medium text-white transition hover:bg-[#363636]"
          >
            <Plus size={17} aria-hidden="true" />
            Add product
          </Link>
        </div>

        <section
          aria-label="Products"
          className="mt-6 overflow-hidden rounded-xl border border-black/[0.08] bg-white"
        >
          {!products?.length ? (
            <div className="px-6 py-12">
              <h2 className="font-semibold">No products yet</h2>
              <p className="mt-2 text-sm text-neutral-500">
                Add your first product to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.06]">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${encodeURIComponent(product.id)}`}
                  className="group flex min-w-0 flex-col gap-4 px-5 py-5 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <h2 className="break-words text-sm font-semibold">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                      {product.category || "Uncategorized"}
                      {product.featured ? " · Featured" : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-5">
                    <div className="sm:text-right">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatPrice(product)}
                      </p>

                      <p className="mt-1 text-xs capitalize text-neutral-500">
                        {(product.publication_status || "draft").replace(
                          /[-_]/g,
                          " ",
                        )}
                      </p>
                    </div>

                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-neutral-400 transition-colors group-hover:text-[#B8540A]"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
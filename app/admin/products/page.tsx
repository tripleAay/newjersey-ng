import Link from "next/link";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export default async function ProductsPage() {
  await requireStoreAdmin();

  const supabase = getSupabaseAdmin();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, category, price, currency, sale_mode, publication_status, featured"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[NewJersey Products]", error);
    throw new Error("Unable to load products.");
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-[#625D55]">
            Your latest products, including drafts.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex min-h-12 items-center rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636]"
        >
          Add product
        </Link>
      </div>

      <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
        {!products?.length ? (
          <p className="py-12 text-sm text-[#625D55]">
            No products yet. Add your first piece to get started.
          </p>
        ) : (
          products.map((product) => (
            <article
              key={product.id}
              className="flex flex-wrap items-center justify-between gap-4 py-5"
            >
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="mt-1 text-sm text-[#625D55]">
                  {product.category || "Uncategorized"}
                  {product.featured ? " · Featured" : ""}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">
                  {product.sale_mode === "quote"
                    ? "Price on request"
                    : `${
                        product.sale_mode === "starting_from" ? "From " : ""
                      }${new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: product.currency,
                      }).format(Number(product.price))}`}
                </p>
                <p className="mt-1 text-xs capitalize text-[#625D55]">
                  {product.publication_status}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
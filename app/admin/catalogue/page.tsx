import Link from "next/link";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  STORE_FIELDS,
  toStoreProduct,
  type StoreRow,
} from "@/app/lib/newjersey/storefront/catalogue";
export const dynamic = "force-dynamic";
export default async function CatalogueAdmin() {
  await requireStoreAdmin();
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(STORE_FIELDS)
    .eq("jersey_enabled", false)
    .eq("apparel_enabled", false)
    .order("catalogue_department")
    .order("catalogue_rank")
    .order("id")
    .limit(300);
  if (error) throw new Error("Run the storefront catalogue migration first.");
  return (
    <main className="mx-auto max-w-6xl p-5 sm:p-8">
      <p className="text-xs uppercase tracking-widest text-[#FF6B00]">
        Catalogue
      </p>
      <h1 className="mt-3 text-3xl font-semibold">Print & branding.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#625D55]">
        Set prices, images, product specifications and the order products appear
        in. Featured products appear first. Apparel and jerseys retain their own
        catalogue settings.
      </p>
      <div className="my-6 flex flex-wrap gap-4 text-sm font-semibold underline">
        <Link href="/admin/products/new">Create a product</Link>
        <Link href="/admin/catalogue/enquiries">Print & product enquiries</Link>
        <Link href="/admin/apparel">Manage apparel</Link>
        <Link href="/admin/jerseys">Manage jerseys</Link>
      </div>
      <div className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
        {((data ?? []) as unknown as StoreRow[]).map((row) => (
          <Link
            key={String(row.id)}
            href={"/admin/catalogue/" + row.id}
            className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-[#F6F4EF]"
          >
            <div>
              <h2 className="text-sm font-semibold">{row.name}</h2>
              <p className="mt-1 text-xs text-[#625D55]">
                {row.catalogue_department || "Choose department"} ·{" "}
                {row.sale_mode} · Position {row.catalogue_rank ?? 0}
              </p>
            </div>
            <span className="rounded-full bg-[#F0EFEB] px-3 py-2 text-xs">
              {toStoreProduct(row) ? "Live" : "Hidden / incomplete"} →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}

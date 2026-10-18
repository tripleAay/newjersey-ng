import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  STORE_FIELDS,
  type StoreRow,
} from "@/app/lib/newjersey/storefront/catalogue";
import ProductImageUpload from "@/app/components/admin/ProductImageUpload";
import { saveCatalogue } from "../actions";
export default async function EditCatalogue({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireStoreAdmin();
  const { id } = await params;
  if (!/^[1-9]\d{0,18}$/.test(id)) notFound();
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(STORE_FIELDS)
    .eq("id", id)
    .eq("jersey_enabled", false)
    .eq("apparel_enabled", false)
    .maybeSingle();
  if (error) throw new Error("Unable to load catalogue product.");
  if (!data) notFound();
  const row = data as unknown as StoreRow;
  const q = await searchParams;
  const field =
    "mt-2 block min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base";
  return (
    <main className="mx-auto max-w-4xl p-5 sm:p-8">
      <Link href="/admin/catalogue" className="text-sm underline">
        Back to catalogue
      </Link>
      <h1 className="mt-6 text-3xl font-semibold">{row.name}</h1>
      {q.error && (
        <p role="alert" className="mt-4 bg-red-50 p-4 text-red-800">
          {q.error}
        </p>
      )}
      {q.saved === "1" && (
        <p role="status" className="mt-4 text-sm">
          Product saved. Published changes are reflected in the shop.
        </p>
      )}
      <form action={saveCatalogue} className="mt-7 space-y-6">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="expected" value={row.updated_at} />
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["name", "Name", row.name],
            ["slug", "URL slug", row.slug],
          ].map(([key, label, value]) => (
            <label key={key} className="text-sm font-medium">
              {label}
              <input
                name={key}
                required
                maxLength={160}
                defaultValue={value}
                className={field}
              />
            </label>
          ))}
          <label className="text-sm font-medium">
            Department
            <select
              name="department"
              defaultValue={row.catalogue_department || "print"}
              className={field}
            >
              <option value="print">Print</option>
              <option value="branding">Branding</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            Branding collection
            <select
              name="topic"
              defaultValue={row.catalogue_topic || "general"}
              className={field}
            >
              {["general", "signage", "vehicle", "space", "identity"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="text-sm font-medium">
            Pricing
            <select
              name="sale_mode"
              defaultValue={row.sale_mode}
              className={field}
            >
              <option value="fixed">Fixed</option>
              <option value="starting_from">Starting from</option>
              <option value="quote">Quote required</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            Base production price (NGN)
            <input
              name="price"
              type="number"
              min="0"
              max="99999999.99"
              step=".01"
              defaultValue={row.price ?? 0}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Design assistance fee (NGN, blank = unavailable)
            <input
              name="design_fee"
              type="number"
              min="0"
              max="99999999.99"
              step=".01"
              defaultValue={row.design_fee ?? ""}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Base quantity
            <input
              name="quantity"
              type="number"
              min="1"
              max="1000000"
              required
              defaultValue={row.catalogue_quantity || 1}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Unit label
            <input
              name="unit"
              required
              maxLength={40}
              defaultValue={row.catalogue_unit || "pieces"}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Display position (lower first)
            <input
              name="rank"
              type="number"
              min="0"
              max="99999"
              defaultValue={row.catalogue_rank || 0}
              required
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Publication
            <select
              name="publication_status"
              defaultValue={row.publication_status}
              className={field}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Description
          <textarea
            name="description"
            rows={5}
            maxLength={10000}
            defaultValue={row.description ?? ""}
            className={field}
          />
        </label>
        <ProductImageUpload
          initialImages={[
            ...new Set([row.image_url, ...(row.image_urls ?? [])]),
          ].filter((s): s is string => !!s)}
        />
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={row.catalogue_enabled}
            />
            Show in shop
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={row.featured}
            />
            Featured
          </label>
        </div>
        <details className="rounded-xl border border-black/10 bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold">
            Advanced: product specifications and option charges
          </summary>
          <p className="mt-3 text-xs leading-6 text-[#625D55]">
            Each choice adds its priceModifier to the base price. Quantity
            choices describe copies per configured job. Imported print
            specifications are preserved. Use [] for a product without options.
          </p>
          <textarea
            name="options"
            required
            rows={16}
            maxLength={30000}
            defaultValue={JSON.stringify(row.catalogue_options ?? [], null, 2)}
            className={field + " font-mono text-xs"}
          />
        </details>
        <button className="min-h-12 rounded-full bg-[#FF6B00] px-7 text-sm font-semibold text-[#181818]">
          Save product
        </button>
      </form>
    </main>
  );
}

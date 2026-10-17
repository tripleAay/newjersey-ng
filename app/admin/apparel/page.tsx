import ProductImageUpload from "@/app/components/admin/ProductImageUpload";
import Link from "next/link";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  APPAREL_FIELDS,
  type ApparelRow,
  toApparelProduct,
} from "@/app/lib/newjersey/apparel/catalogue";
import { saveApparel } from "./actions";
export const dynamic = "force-dynamic";
export default async function ApparelAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireStoreAdmin();
  const params = await searchParams;
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(APPAREL_FIELDS)
    .eq("jersey_enabled", false)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error)
    throw new Error(
      "Unable to load apparel. Apply the apparel migration first.",
    );
  const field =
    "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base";
  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8">
      <h1 className="text-3xl font-semibold">Apparel.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#625D55]">
        Sell the finished designs shown in your product photos. Customers choose
        size, colour and quantity. No customer artwork is required. Only enable
        products intended for this flow.
      </p>
      <Link
        href="/admin/products/new"
        className="mt-5 inline-flex min-h-12 items-center rounded-full bg-[#181818] px-5 text-sm text-white"
      >
        Create apparel product
      </Link>
      <p className="mt-3 text-xs leading-6 text-[#625D55]">
        Create the product with a fixed NGN price, upload its finished design
        images, then return here to enable it and set options. Publish it when
        ready.
      </p>
      {params.error && (
        <p role="alert" className="mt-4 text-red-700">
          {params.error}
        </p>
      )}
      {params.saved === "1" && (
        <p role="status" className="mt-4 text-green-800">
          Settings saved.
        </p>
      )}
      <div className="mt-7 space-y-4">
        {((data ?? []) as unknown as ApparelRow[]).map((row) => (
          <details
            key={String(row.id)}
            className="rounded-xl border border-black/10 bg-white p-5"
          >
            <summary className="cursor-pointer text-sm font-semibold">
              {row.name}{" "}
              <span className="ml-3 text-xs font-normal text-[#625D55]">
                {toApparelProduct(row)
                  ? "Visible in Apparel"
                  : row.apparel_enabled
                    ? "Enabled - check publication, price, images and options"
                    : "Not enabled"}
              </span>
            </summary>
            <Link
              href={`/admin/products/${row.id}`}
              className="mt-4 inline-block text-xs underline"
            >
              Product details and images
            </Link>
            <form
              action={saveApparel}
              className="mt-4 grid gap-5 sm:grid-cols-2"
            >
              <input type="hidden" name="product_id" value={String(row.id)} />
              <label className="text-sm">
                Name
                <input
                  name="name"
                  required
                  maxLength={160}
                  defaultValue={row.name}
                  className={field}
                />
              </label>
              <label className="text-sm">
                URL slug
                <input
                  name="slug"
                  required
                  maxLength={160}
                  defaultValue={row.slug}
                  className={field}
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Description
                <textarea
                  name="description"
                  maxLength={10000}
                  defaultValue={row.description ?? ""}
                  rows={3}
                  className={field}
                />
              </label>
              <label className="text-sm">
                Price per piece (NGN)
                <input
                  name="price"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  max="99999999.99"
                  defaultValue={row.price ?? ""}
                  className={field}
                />
              </label>
              <label className="text-sm">
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
              <div className="sm:col-span-2">
                <p className="mb-3 text-sm">Finished product images</p>
                <ProductImageUpload
                  initialImages={[
                    ...new Set([row.image_url, ...(row.image_urls ?? [])]),
                  ].filter((x): x is string => typeof x === "string" && !!x)}
                />
              </div>
              <label className="text-sm">
                Sizes
                <input
                  name="sizes"
                  required
                  maxLength={500}
                  defaultValue={(row.apparel_sizes ?? []).join(", ")}
                  placeholder="S, M, L, XL"
                  className={field}
                />
              </label>
              <label className="text-sm">
                Colours
                <input
                  name="colours"
                  required
                  maxLength={500}
                  defaultValue={(row.apparel_colours ?? []).join(", ")}
                  placeholder="Black, White"
                  className={field}
                />
              </label>
              <label className="flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="enabled"
                  defaultChecked={row.apparel_enabled}
                />
                Enable ready-designed apparel sales
              </label>
              <button className="min-h-12 rounded-full bg-[#181818] px-5 text-sm text-white">
                Save apparel settings
              </button>
            </form>
          </details>
        ))}
      </div>
    </main>
  );
}

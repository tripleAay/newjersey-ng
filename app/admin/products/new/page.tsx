import Link from "next/link";

import ProductImageUpload from "@/app/components/admin/ProductImageUpload";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { saveProduct } from "../actions";

type Props = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

const field =
  "mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818] outline-none transition focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20";

const designFeeGuide = [
  ["T-shirts", 10000],
  ["Polo shirts", 10000],
  ["Jerseys", 15000],
  ["Hoodies", 20000],
  ["Business cards", 30000],
  ["Flyers", 15000],
  ["Posters", 20000],
  ["Banners", 10000],
  ["Brochures", 50000],
  ["Stickers", 5000],
  ["Labels", 20000],
  ["Letterheads", 25000],
  ["Booklets", 20000],
  ["Receipt books", 5000],
] as const;

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default async function NewProductPage({
  searchParams,
}: Props) {
  await requireStoreAdmin();

  const params = await searchParams;
  const error =
    typeof params.error === "string" ? params.error : "";

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 text-[#181818] sm:px-8 sm:py-12">
      <Link
        href="/admin/products"
        className="inline-flex min-h-11 items-center text-sm text-[#625D55] hover:underline"
      >
        ← Products
      </Link>

      <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em]">
        Add a product
      </h1>

      <p className="mt-3 text-sm leading-6 text-[#625D55]">
        Upload images, set your production price and design
        fee, then save a draft or publish.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800"
        >
          {error}
        </p>
      )}

      <form action={saveProduct} className="mt-8 space-y-7">
        <ProductImageUpload />

        <label className="block text-sm font-medium">
          Product name
          <input
            name="name"
            required
            maxLength={160}
            className={field}
            placeholder="Name your product"
          />
        </label>

        <label className="block text-sm font-medium">
          URL name
          <input
            name="slug"
            required
            maxLength={160}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            autoCapitalize="none"
            spellCheck={false}
            className={field}
            placeholder="your-product-name"
          />
          <span className="mt-2 block text-xs leading-5 text-[#625D55]">
            Use lowercase letters, numbers and hyphens.
            Each product needs a unique URL name.
          </span>
        </label>

        <label className="block text-sm font-medium">
          Description
          <textarea
            name="description"
            rows={5}
            maxLength={10000}
            className={field}
            placeholder="Describe the product, materials and what is included."
          />
        </label>

        <label className="block text-sm font-medium">
          Category
          <input
            name="category"
            maxLength={100}
            className={field}
            placeholder="Jerseys, Art, Accessories..."
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Pricing type
            <select
              name="sale_mode"
              className={field}
              defaultValue="fixed"
            >
              <option value="fixed">Fixed price</option>
              <option value="starting_from">
                Starting price
              </option>
              <option value="quote">Request a quote</option>
            </select>
          </label>

          <label className="block text-sm font-medium">
            Production price (₦)
            <input
              name="price"
              type="number"
              min="0"
              max="9999999999"
              step="0.01"
              className={field}
              placeholder="18000"
            />
            <span className="mt-2 block text-xs leading-5 text-[#625D55]">
              Required for fixed and starting prices.
              Exclude the separate design fee.
            </span>
          </label>
        </div>

        <section
          aria-labelledby="design-fee-heading"
          className="rounded-2xl border border-black/10 bg-[#F4F1E9] p-5 sm:p-6"
        >
          <h2
            id="design-fee-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Artwork design
          </h2>

          <label className="mt-4 block text-sm font-medium">
            Design fee (₦)
            <input
              name="design_fee"
              type="number"
              min="0"
              max="9999999999"
              step="0.01"
              className={field}
              placeholder="10000"
              aria-describedby="design-fee-help"
            />
          </label>

          <p
            id="design-fee-help"
            className="mt-3 text-xs leading-6 text-[#625D55]"
          >
            Applies only when the customer requests design
            help. Charge once per configured design in the
            order, regardless of identical-piece quantity.
            Enter 0 if design is included. Leave blank if
            the fee has not been configured.
          </p>

          <details className="mt-5 border-t border-black/10 pt-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Your design fee reference
            </summary>

            <p className="mt-3 text-xs leading-5 text-[#625D55]">
              Reference only. Enter the applicable amount
              in the field above.
            </p>

            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {designFeeGuide.map(([name, fee]) => (
                <div
                  key={name}
                  className="flex justify-between gap-3 text-xs"
                >
                  <dt className="text-[#625D55]">{name}</dt>
                  <dd className="font-semibold">
                    {currency.format(fee)}
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        </section>

        <label className="block text-sm font-medium">
          Fulfillment
          <select
            name="fulfillment_type"
            className={field}
            defaultValue="made_to_order"
          >
            <option value="made_to_order">Made to order</option>
            <option value="in_stock">In stock</option>
            <option value="preorder">Preorder</option>
            <option value="digital">Digital</option>
            <option value="service">Service</option>
          </select>
        </label>

        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="featured"
            className="h-5 w-5 accent-[#F58220]"
          />
          Feature this product in the shop
        </label>

        <label className="block text-sm font-medium">
          Publication
          <select
            name="publication_status"
            className={field}
            defaultValue="draft"
          >
            <option value="draft">
              Draft — hidden from customers
            </option>
            <option value="published">
              Published — visible to customers
            </option>
          </select>

          <span className="mt-2 block text-xs leading-5 text-[#625D55]">
            Published products require at least one image.
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-5 border-t border-black/10 pt-6">
          <button
            type="submit"
            className="min-h-12 rounded-full bg-[#F58220] px-6 text-sm font-semibold text-[#181818] transition-colors hover:bg-[#D96B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
          >
            Save product
          </button>

          <Link
            href="/admin/products"
            className="inline-flex min-h-11 items-center text-sm hover:underline"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { updateProductDesignFee } from "../design-fee-actions";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string | string[];
    saved?: string | string[];
  }>;
};

function formatMoney(
  value: number | string | null,
  currency = "NGN"
) {
  if (
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return "Not set";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) return "Not set";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

function formatPrice(product: {
  price: number | string | null;
  currency: string | null;
  sale_mode: string | null;
}) {
  if (product.sale_mode === "quote") {
    return "Price on request";
  }

  const formatted = formatMoney(
    product.price,
    product.currency || "NGN"
  );

  if (formatted === "Not set") return "Price not set";

  return product.sale_mode === "starting_from"
    ? `From ${formatted}`
    : formatted;
}

function label(value: string | null) {
  return (value || "Not set").replace(/[-_]/g, " ");
}

function getProductImages(
  mainImage: unknown,
  galleryImages: unknown
): string[] {
  const candidates = [
    mainImage,
    ...(Array.isArray(galleryImages) ? galleryImages : []),
  ];

  const images: string[] = [];

  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;

    const value = candidate.trim();
    if (!value) continue;

    try {
      const url = new URL(value);

      if (
        url.protocol === "https:" &&
        !url.username &&
        !url.password
      ) {
        images.push(value);
      }
    } catch {
      // Ignore invalid image URLs.
    }
  }

  return [...new Set(images)];
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  await requireStoreAdmin();

  const { id } = await params;
  const query = await searchParams;

  if (
    !/^[1-9]\d*$/.test(id) ||
    id.length > 19 ||
    BigInt(id) > 9223372036854775807n
  ) {
    notFound();
  }

  const supabase = getSupabaseAdmin();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      category,
      price,
      design_fee,
      currency,
      sale_mode,
      fulfillment_type,
      publication_status,
      featured,
      image_url,
      image_urls
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[NewJersey Product Details]", error);
    throw new Error("Unable to load this product.");
  }

  if (!product) notFound();

  const images = getProductImages(
    product.image_url,
    product.image_urls
  );

  const errorMessage =
    typeof query.error === "string" ? query.error : "";

  const feeSaved = query.saved === "design-fee";

  const details = [
    {
      name: "Category",
      value: product.category || "Uncategorized",
    },
    {
      name: "Production price",
      value: formatPrice(product),
    },
    {
      name: "Publication status",
      value: label(product.publication_status),
    },
    {
      name: "Sale mode",
      value: label(product.sale_mode),
    },
    {
      name: "Fulfillment",
      value: label(product.fulfillment_type),
    },
    {
      name: "Featured",
      value: product.featured ? "Yes" : "No",
    },
    {
      name: "Currency",
      value: product.currency || "NGN",
    },
  ];

  return (
    <main className="min-w-0 p-4 text-[#181818] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/products"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#625D55] transition-colors hover:text-[#181818]"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to products
        </Link>

        <div className="mt-4">
          <p className="text-sm text-[#625D55]">
            Product details
          </p>

          <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.name}
          </h1>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800"
          >
            {errorMessage}
          </p>
        )}

        {feeSaved && !errorMessage && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-[#F58220]/30 bg-[#F58220]/10 p-4 text-sm"
          >
            Design fee saved.
          </p>
        )}

        <Link href={`/admin/jerseys/${id}`} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">Manage jersey details and images</Link>

        <div className="mt-6 grid min-w-0 items-start gap-6 xl:grid-cols-2">
          <section
            aria-labelledby="product-images-heading"
            className="min-w-0 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="product-images-heading"
                className="text-base font-semibold"
              >
                Product images
              </h2>

              <span className="text-xs text-[#625D55]">
                {images.length}{" "}
                {images.length === 1 ? "image" : "images"}
              </span>
            </div>

            {images.length === 0 ? (
              <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-lg bg-[#F4F1E9] px-6 text-center">
                <p className="text-sm text-[#625D55]">
                  No images are saved for this product.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <a
                  href={images[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open main image of ${product.name} in a new tab`}
                  className="relative block aspect-square overflow-hidden rounded-lg border border-black/10 bg-[#F4F1E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                >
                  <Image
                    src={images[0]}
                    alt={`${product.name} — main image`}
                    fill
                    unoptimized
                    sizes="(max-width: 1279px) 100vw, 50vw"
                    className="object-contain p-3"
                  />
                </a>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-[#625D55]">
                    Main image
                  </p>

                  <a
                    href={images[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-[#625D55] hover:text-[#181818]"
                  >
                    Open full size
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.slice(1).map((url, index) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open image ${index + 2} of ${product.name} in a new tab`}
                        className="relative block aspect-square overflow-hidden rounded-lg border border-black/10 bg-[#F4F1E9] transition-colors hover:border-[#F58220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                      >
                        <Image
                          src={url}
                          alt={`${product.name} — image ${index + 2}`}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 50vw, 200px"
                          className="object-contain p-2"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="min-w-0 space-y-6">
            <section
              aria-labelledby="design-fee-heading"
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <h2
                id="design-fee-heading"
                className="text-base font-semibold"
              >
                Artwork design fee
              </h2>

              <p className="mt-3 text-2xl font-bold tracking-tight">
                {product.design_fee === null
                  ? "Not configured"
                  : formatMoney(product.design_fee)}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#625D55]">
                Set the fee for this product when a customer
                needs design help. It is separate from the
                production price.
              </p>

              <form
                action={updateProductDesignFee}
                className="mt-5"
              >
                <input
                  type="hidden"
                  name="product_id"
                  value={id}
                />

                <label
                  htmlFor="design-fee"
                  className="block text-sm font-medium"
                >
                  Design fee (₦)
                </label>

                <input
                  id="design-fee"
                  name="design_fee"
                  type="number"
                  min="0"
                  max="9999999999"
                  step="0.01"
                  defaultValue={
                    product.design_fee === null
                      ? ""
                      : String(product.design_fee)
                  }
                  aria-describedby="design-fee-help"
                  placeholder="10000"
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                />

                <p
                  id="design-fee-help"
                  className="mt-3 text-xs leading-6 text-[#625D55]"
                >
                  Enter 0 if design is included. Leave blank
                  to mark the fee as unconfigured. The intended
                  charge is once per configured design in an
                  order, not per identical piece.
                </p>

                <button
                  type="submit"
                  className="mt-5 min-h-12 rounded-full bg-[#F58220] px-6 text-sm font-semibold text-[#181818] transition hover:bg-[#D96B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
                >
                  Save design fee
                </button>
              </form>
            </section>

            <section
              aria-labelledby="product-information-heading"
              className="min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white"
            >
              <div className="border-b border-black/10 p-5 sm:p-6">
                <h2
                  id="product-information-heading"
                  className="text-base font-semibold"
                >
                  Product information
                </h2>
              </div>

              <dl className="grid sm:grid-cols-2">
                {details.map((detail) => (
                  <div
                    key={detail.name}
                    className="min-w-0 border-b border-black/10 p-5 sm:p-6"
                  >
                    <dt className="text-sm text-[#625D55]">
                      {detail.name}
                    </dt>

                    <dd className="mt-2 break-words text-sm font-semibold capitalize">
                      {detail.value}
                    </dd>
                  </div>
                ))}

                <div className="min-w-0 border-b border-black/10 p-5 sm:p-6">
                  <dt className="text-sm text-[#625D55]">
                    Product ID
                  </dt>
                  <dd className="mt-2 break-all font-mono text-xs text-[#625D55]">
                    {product.id}
                  </dd>
                </div>

                <div className="min-w-0 border-b border-black/10 p-5 sm:col-span-2 sm:p-6">
                  <dt className="text-sm text-[#625D55]">
                    URL name
                  </dt>
                  <dd className="mt-2 break-all text-sm font-medium">
                    {product.slug || "Not set"}
                  </dd>
                </div>

                <div className="min-w-0 p-5 sm:col-span-2 sm:p-6">
                  <dt className="text-sm text-[#625D55]">
                    Description
                  </dt>
                  <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#625D55]">
                    {product.description || "No description added."}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
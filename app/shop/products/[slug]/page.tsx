import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatPrice(
  price: number | string | null,
  currency: string | null,
  saleMode: string | null,
) {
  if (saleMode === "quote") return "Price on request";

  const amount = Number(price);

  if (price === null || price === "" || !Number.isFinite(amount)) {
    return "Price on request";
  }

  const code = currency || "NGN";
  let formatted: string;

  try {
    formatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    formatted = `${code} ${amount.toLocaleString("en-NG")}`;
  }

  return saleMode === "starting_from"
    ? `From ${formatted}`
    : formatted;
}

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      name,
      description,
      category,
      price,
      currency,
      sale_mode,
      fulfillment_type,
      image_url,
      image_urls
    `)
    .eq("slug", slug)
    .eq("publication_status", "published")
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("[NewJersey Shop Product]", error);
    throw new Error("Unable to load this product.");
  }

  if (!product) notFound();

  const candidates: unknown[] = [
    product.image_url,
    ...(Array.isArray(product.image_urls) ? product.image_urls : []),
  ];

  const images = [
    ...new Set(
      candidates.filter((value): value is string => {
        if (typeof value !== "string") return false;

        try {
          const url = new URL(value);
          return url.protocol === "https:" && !url.username && !url.password;
        } catch {
          return false;
        }
      }),
    ),
  ];

  const inquiry = encodeURIComponent(
    `Hello NewJersey.ng, I'm interested in ${product.name}. Please confirm pricing, available options and delivery.`,
  );

  return (
    <main className="min-h-screen bg-[#FCFBF8] px-5 py-8 text-[#181818] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-[#625D55] hover:text-[#181818]"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to shop
        </Link>

        <div className="mt-6 grid min-w-0 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <section aria-label="Product images" className="min-w-0">
            {images.length > 0 ? (
              <>
                <a
                  href={images[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open main image of ${product.name}`}
                  className="relative block aspect-square overflow-hidden rounded-xl bg-[#EFEDE7]"
                >
                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-contain p-4"
                  />
                </a>

                {images.length > 1 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {images.slice(1).map((url, index) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open image ${index + 2} of ${product.name}`}
                        className="relative block aspect-square overflow-hidden rounded-lg bg-[#EFEDE7]"
                      >
                        <Image
                          src={url}
                          alt={`${product.name} — image ${index + 2}`}
                          fill
                          unoptimized
                          sizes="(max-width: 1023px) 33vw, 180px"
                          className="object-contain p-2"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl bg-[#EFEDE7] text-sm text-[#625D55]">
                Image coming soon
              </div>
            )}
          </section>

          <section className="min-w-0">
            <p className="text-sm text-[#625D55]">
              {product.category || "Products"}
            </p>

            <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-semibold">
              {formatPrice(
                product.price,
                product.currency,
                product.sale_mode,
              )}
            </p>

            {product.description && (
              <p className="mt-6 whitespace-pre-wrap break-words text-sm leading-7 text-[#625D55]">
                {product.description}
              </p>
            )}

            {product.fulfillment_type && (
              <p className="mt-6 text-sm capitalize text-[#625D55]">
                {product.fulfillment_type.replace(/_/g, " ")}
              </p>
            )}

            <a
              href={`https://wa.me/2348089570493?text=${inquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636]"
            >
              Enquire about this product
            </a>

            <p className="mt-3 text-xs leading-5 text-[#625D55]">
              Confirm specifications, quantity and delivery with our team.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
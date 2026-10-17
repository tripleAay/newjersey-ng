import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  APPAREL_FIELDS,
  toApparelProduct,
  type ApparelRow,
} from "@/app/lib/newjersey/apparel/catalogue";

type Props = {
  limit?: number;
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default async function ApparelTileGrid({ limit }: Props) {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(APPAREL_FIELDS)
    .eq("apparel_enabled", true)
    .eq("publication_status", "published")
    .eq("jersey_enabled", false)
    .order("featured", { ascending: false })
    .order("id")
    .limit(100);
  if (error) {
    console.error("[Apparel catalogue]", error);
    return (
      <p className="text-sm text-[#625D55]">
        Apparel could not be loaded. Please try again.
      </p>
    );
  }
  const available = ((data ?? []) as unknown as ApparelRow[])
    .map(toApparelProduct)
    .filter((p) => p !== null);

  const apparelProducts =
    typeof limit === "number"
      ? available.slice(0, Math.max(0, limit))
      : available;

  if (!apparelProducts.length) {
    return (
      <p className="rounded-xl border border-black/10 bg-white p-5 text-sm text-[#625D55]">
        Apparel products will appear here soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {apparelProducts.map((product) => {
        const isJersey = product.slug === "custom-jerseys";

        const href = isJersey
          ? "/shop/jerseys"
          : `/shop/apparel/${encodeURIComponent(product.slug)}`;

        const price = product.pricing;

        const priceLabel =
          price.type === "quote"
            ? "Price on request"
            : `${
                price.type === "starting-from" ? "From " : ""
              }${currency.format(price.basePrice ?? 0)}`;

        return (
          <article
            key={product.id}
            className="group min-w-0 overflow-hidden rounded-xl border border-black/[0.08] bg-white transition-colors hover:border-black/20"
          >
            <Link
              href={href}
              aria-label={`View ${product.name}`}
              className="flex h-full flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220]"
            >
              <div className="relative h-36 overflow-hidden bg-[#F3F2ED] sm:h-40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none sm:p-4"
                />
              </div>

              <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
                <h3 className="line-clamp-2 min-h-9 text-xs font-medium leading-[18px] text-[#181818]">
                  {product.name}
                </h3>

                <p className="mt-1 text-[13px] font-semibold tracking-tight text-[#181818]">
                  {isJersey ? "Choose your kit" : priceLabel}
                </p>

                <span className="mt-3 inline-flex min-h-11 items-center justify-between gap-2 rounded-full border border-black/10 px-3 text-[11px] font-semibold text-[#625D55] transition-colors group-hover:border-[#181818] group-hover:bg-[#181818] group-hover:text-white">
                  {isJersey ? "Shop jerseys" : "Details"}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

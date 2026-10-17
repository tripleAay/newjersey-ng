import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { products } from "@/app/data/newjersey/products";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1A36] focus-visible:ring-offset-4 focus-visible:ring-offset-white";

export default function JerseyShowcase() {
  const jerseys = products
    .filter(
      (product) =>
        product.category === "apparel" &&
        product.published !== false &&
        /\bjerseys?\b/i.test(
          `${product.name} ${product.slug.replaceAll("-", " ")}`
        )
    )
    .slice(0, 4);

  if (jerseys.length === 0) return null;

  return (
    <section
      aria-labelledby="jersey-heading"
      className="bg-white py-12 text-[#181818] sm:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#625D55]">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#6D1A36]"
              />
              NewJersey.ng / Teamwear
            </p>

            <h2
              id="jersey-heading"
              className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
            >
              Find your next jersey.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#625D55]">
              Choose your jersey. Explore the options.
              Make it your own.
            </p>
          </div>

          <Link
            href="/shop/quote"
            className={`inline-flex min-h-11 w-fit shrink-0 items-center gap-3 rounded-sm text-xs font-semibold text-[#181818] transition-colors hover:text-[#6D1A36] ${focusClass}`}
          >
            Ordering for a team?
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Four-column jersey display */}
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-9 sm:gap-x-6 lg:grid-cols-4">
          {jerseys.map((product) => {
            const href = `/shop/apparel/${product.slug}`;

            const image =
              product.image || product.images?.[0];

            const secondImage = product.images?.find(
              (candidate) => candidate && candidate !== image
            );

            const price = product.pricing.basePrice;

            const formattedPrice =
              product.pricing.type !== "quote" &&
              typeof price === "number" &&
              Number.isFinite(price) &&
              price >= 0
                ? currency.format(price)
                : null;

            const quantity = product.pricing.baseQuantity;

            return (
              <article
                key={product.id}
                className="group flex min-w-0 flex-col"
              >
                <Link
                  href={href}
                  aria-label={`View ${product.name}`}
                  className={`relative block overflow-hidden rounded-xl bg-[#F3F3F0] ${focusClass}`}
                >
                  <div className="relative aspect-[4/5]">
                    {image ? (
                      <>
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.045] motion-reduce:transform-none motion-reduce:transition-none sm:p-6"
                        />

                        {secondImage && (
                          <Image
                            src={secondImage}
                            alt={`${product.name}, alternate view`}
                            fill
                            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
                            className="hidden object-contain bg-[#F3F3F0] p-6 opacity-0 transition-opacity duration-300 motion-reduce:transition-none lg:block lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center px-5 text-center">
                        <span className="text-xs leading-6 text-[#7A7368]">
                          {product.name}
                          <span className="mt-1 block">
                            Image coming soon
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="absolute bottom-3 right-3 hidden h-9 w-9 items-center justify-center rounded-full bg-white text-[#181818] shadow-sm transition-colors group-hover:bg-[#181818] group-hover:text-white sm:flex">
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </span>
                </Link>

                <div className="flex flex-1 flex-col pt-4">
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#7A7368] sm:text-[10px]">
                    Jersey / Apparel
                  </p>

                  <h3 className="mt-1.5 text-sm font-semibold leading-6 tracking-tight sm:text-base">
                    <Link
                      href={href}
                      className={`rounded-sm transition-colors hover:text-[#6D1A36] ${focusClass}`}
                    >
                      {product.name}
                    </Link>
                  </h3>

                  <div className="mt-3">
                    <p className="text-sm font-semibold tracking-tight sm:text-lg">
                      {formattedPrice ? (
                        <>
                          {product.pricing.type ===
                            "starting-from" && (
                            <span className="mr-1 text-[11px] font-normal text-[#625D55]">
                              From
                            </span>
                          )}
                          {formattedPrice}
                        </>
                      ) : (
                        "Request a quote"
                      )}
                    </p>

                    <p className="mt-1 min-h-5 text-[10px] leading-5 text-[#7A7368] sm:text-xs">
                      {formattedPrice && quantity != null
                        ? `For ${quantity} ${
                            product.pricing.unit || "pieces"
                          }`
                        : "Pricing confirmed for your requirements"}
                    </p>
                  </div>

                  <div className="mt-auto pt-4">
                    <Link
                      href={href}
                      className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-lg bg-[#181818] px-3 text-[11px] font-semibold text-white transition-colors hover:bg-[#6D1A36] sm:px-4 sm:text-xs ${focusClass}`}
                    >
                      Choose options
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Team enquiries */}
        <div className="mt-9 flex flex-col justify-between gap-4 border-y border-black/10 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold tracking-tight">
              One team. A complete order.
            </p>

            <p className="mt-1 text-xs leading-6 text-[#625D55]">
              Share your quantity, sizes and artwork requirements
              for a team quote.
            </p>
          </div>

          <Link
            href="/shop/quote"
            className={`inline-flex min-h-11 w-fit shrink-0 items-center gap-4 rounded-sm text-xs font-semibold text-[#6D1A36] hover:underline hover:underline-offset-4 ${focusClass}`}
          >
            Request a team quote
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-3 text-[10px] leading-5 text-[#7A7368] sm:text-[11px]">
          Prices depend on selected specifications and quantity.
          Check each product for available options.
        </p>
      </div>
    </section>
  );
}
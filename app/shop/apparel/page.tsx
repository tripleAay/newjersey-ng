import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { products } from "@/app/data/newjersey/products";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function ApparelPage() {
  const apparelProducts = products.filter(
    (product) =>
      product.category === "apparel" &&
      product.published !== false
  );

  return (
    <div className="min-h-screen bg-[#F4F1E9] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#F4F1E9]/95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="py-5 sm:py-7"
        >
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#F58220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F1E9]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to shop
          </Link>
        </nav>

        <section
          aria-labelledby="apparel-heading"
          className="pb-9 pt-3 sm:pb-12 sm:pt-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
            NewJersey.ng{" "}
            <span className="px-1 text-[#F58220]">/</span>{" "}
            Apparel
          </p>

          <h1
            id="apparel-heading"
            className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl"
          >
            Wear your identity.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#625D55] sm:text-base">
            Branded clothing for businesses, teams, creators,
            and events. Choose a product to explore its
            available specifications.
          </p>
        </section>

        <section aria-labelledby="products-heading">
          <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
            <h2
              id="products-heading"
              className="text-lg font-semibold tracking-tight sm:text-xl"
            >
              Explore apparel
            </h2>

            <span className="shrink-0 text-xs text-[#625D55]">
              {apparelProducts.length}{" "}
              {apparelProducts.length === 1
                ? "product"
                : "products"}
            </span>
          </div>

          {apparelProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
                {apparelProducts.map((product) => {
                  const price = product.pricing.basePrice;

                  const hasPrice =
                    product.pricing.type !== "quote" &&
                    price != null;

                  const image =
                    product.image || product.images?.[0];

                  return (
                    <article
                      key={product.id}
                      className="min-w-0"
                    >
                      <Link
                        href={`/shop/apparel/${product.slug}`}
                        className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F1E9]"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#EFEDE7]">
                          {image ? (
                            <Image
                              src={image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 1023px) 50vw, (max-width: 1440px) 25vw, 320px"
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#625D55]">
                              {product.name}
                            </div>
                          )}
                        </div>

                        <div className="pt-4">
                          <p className="text-xs font-medium text-[#625D55]">
                            Apparel
                          </p>

                          <div className="mt-1.5 flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold leading-6 transition-colors group-hover:text-[#F58220] sm:text-base">
                              {product.name}
                            </h3>

                            <ArrowUpRight
                              size={17}
                              aria-hidden="true"
                              className="mt-1 shrink-0 text-[#F58220]"
                            />
                          </div>

                          <p className="mt-3 text-sm leading-6 sm:text-base">
                            {hasPrice && price != null ? (
                              <>
                                {product.pricing.type ===
                                  "starting-from" && (
                                  <span className="mr-1 text-xs text-[#625D55]">
                                    From
                                  </span>
                                )}

                                <span className="font-semibold">
                                  {currency.format(price)}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold">
                                Request a quote
                              </span>
                            )}
                          </p>

                          {hasPrice &&
                            product.pricing.baseQuantity !=
                              null && (
                              <p className="mt-0.5 text-xs leading-5 text-[#625D55] sm:text-sm">
                                For{" "}
                                {product.pricing.baseQuantity}{" "}
                                {product.pricing.unit ||
                                  "pieces"}
                              </p>
                            )}
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              <p className="mt-8 max-w-2xl border-t border-black/10 pt-5 text-sm leading-6 text-[#625D55]">
                Prices vary with your selected specifications
                and quantity. Design assistance and delivery
                are quoted separately.
              </p>
            </>
          ) : (
            <div className="border-t border-black/10 py-12">
              <h3 className="text-lg font-semibold">
                Apparel products are coming soon.
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-7 text-[#625D55]">
                Have a clothing project in mind? Tell us what
                you need, including your quantity and branding
                requirements.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <Link
                  href="/quote"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-[#181818] underline decoration-[#F58220] underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F1E9]"
                >
                  Request a quote
                  <ArrowUpRight
                    size={17}
                    aria-hidden="true"
                    className="text-[#F58220]"
                  />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F1E9]"
                >
                  Explore the shop
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
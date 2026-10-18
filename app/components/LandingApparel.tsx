import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { loadApparel } from "@/app/lib/newjersey/storefront/load";
import ProductGrid from "@/app/components/newjersey/storefront/ProductGrid";
export default async function LandingApparel() {
  let products: Awaited<ReturnType<typeof loadApparel>> = [];
  let unavailable = false;
  try {
    products = await loadApparel();
  } catch {
    unavailable = true;
  }
  return (
    <section
      aria-labelledby="landing-apparel-title"
      className="bg-[#FCFBF8] px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="mx-auto max-w-[1344px]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#9A4000]">
              NewJersey.ng / Apparel
            </p>
            <h2
              id="landing-apparel-title"
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              Wear it your way.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#625D55]">
              Ready-designed pieces. Choose your size and colour, then add to
              cart. No account needed to start.
            </p>
          </div>
          <Link
            href="/shop/apparel"
            className="inline-flex min-h-11 items-center gap-3 rounded-full border border-black/15 px-5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
          >
            All apparel <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {unavailable ? (
          <div
            role="status"
            className="rounded-xl border border-black/10 bg-white p-5 text-sm leading-7 text-[#625D55]"
          >
            This collection is temporarily unavailable. Please try again shortly
            or{" "}
            <a
              href="https://wa.me/2348089570493"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#181818] underline"
            >
              contact us on WhatsApp
            </a>
            .
          </div>
        ) : (
          <ProductGrid
            products={products.slice(0, 12)}
            department="apparel"
            preview
          />
        )}
      </div>
    </section>
  );
}

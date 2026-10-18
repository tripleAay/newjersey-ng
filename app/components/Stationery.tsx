import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { loadDepartment } from "@/app/lib/newjersey/storefront/load";
import ProductGrid from "@/app/components/newjersey/storefront/ProductGrid";
export default async function BusinessStationery() {
  let products: Awaited<ReturnType<typeof loadDepartment>> = [];
  let unavailable = false;
  try {
    products = await loadDepartment("print");
  } catch {
    unavailable = true;
  }
  return (
    <section
      aria-labelledby="landing-print-title"
      className="bg-[#F0EFEB] px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="mx-auto max-w-[1344px]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#9A4000]">
              NewJersey.ng / Print
            </p>
            <h2
              id="landing-print-title"
              className="mt-3 text-3xl font-semibold tracking-tight text-[#181818]"
            >
              Print that means business.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
              Cards, stationery and everyday print essentials. Choose your
              specifications to see your order price.
            </p>
          </div>
          <Link
            href="/shop/print"
            className="inline-flex min-h-11 items-center gap-3 rounded-full border border-black/15 px-5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
          >
            Explore print <ArrowUpRight size={16} aria-hidden="true" />
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
            products={products.slice(0, 6)}
            department="print"
            preview
          />
        )}
      </div>
    </section>
  );
}

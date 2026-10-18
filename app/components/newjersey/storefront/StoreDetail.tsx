import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { StoreProduct } from "@/app/lib/newjersey/storefront/catalogue";
import ProductGallery from "@/app/components/newjersey/product/ProductGallery";
import ProductConfigurator from "@/app/components/newjersey/product/ProductConfigurator";
import EnquiryForm from "./EnquiryForm";
import ProductImage from "./ProductImage";
import StoreShell from "./StoreShell";
export default function StoreDetail({ product: p }: { product: StoreProduct }) {
  return (
    <StoreShell>
      <main className="mx-auto max-w-[1344px] px-4 pb-16 pt-5 sm:px-8 lg:px-12">
        <Link
          href={"/shop/" + p.department}
          className="inline-flex min-h-11 items-center gap-2 text-xs text-[#625D55]"
        >
          <ArrowLeft size={15} />
          Back to {p.department}
        </Link>
        <section className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            {p.images.length ? (
              <ProductGallery name={p.name} images={p.images} />
            ) : (
              <div className="h-72 overflow-hidden rounded-2xl bg-[#EEE9E2] sm:h-96">
                <ProductImage name={p.name} department={p.department} />
              </div>
            )}
            <div className="mt-6 rounded-xl border border-black/10 p-5">
              <h2 className="text-sm font-semibold">
                Made to your specifications.
              </h2>
              <p className="mt-3 text-xs leading-6 text-[#625D55]">
                {p.department === "print"
                  ? "Choose your print specifications and artwork option. Production begins after your artwork, pricing and payment are confirmed."
                  : "Dimensions, artwork, materials and any installation requirements are agreed before work starts."}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-[#FF6B00]">
              NewJersey.ng / {p.department}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {p.name}
            </h1>
            <p className="mb-7 mt-4 whitespace-pre-wrap text-sm leading-7 text-[#625D55]">
              {p.description}
            </p>
            {p.pricing.type === "quote" ? (
              <EnquiryForm slug={p.slug} department={p.department} />
            ) : (
              <ProductConfigurator product={p} />
            )}
          </div>
        </section>
      </main>
    </StoreShell>
  );
}

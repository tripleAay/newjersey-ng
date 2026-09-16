import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";

import {
  getProductBySlug,
  products,
} from "@/app/data/newjersey/products";

import ProductGallery from "@/app/components/newjersey/product/ProductGallery";
import ProductConfigurator from "@/app/components/newjersey/product/ProductConfigurator";
import ProductInformation from "@/app/components/newjersey/product/ProductInformation";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const statusLabels = {
  available: "Available Now",
  "made-to-order": "Made to Order",
  custom: "Custom",
  "pre-order": "Pre-Order",
} as const;

export function generateStaticParams() {
  return products
    .filter(
      (product) =>
        product.category === "print" &&
        product.published !== false
    )
    .map((product) => ({
      slug: product.slug,
    }));
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (
    !product ||
    product.category !== "print"
  ) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#222]">
      <div className="mx-auto w-[92%] max-w-[1440px]">
        <div className="py-5 sm:py-7">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#FF6B00]"
          >
            <ArrowLeft size={15} />
            Back to shop
          </Link>
        </div>

        <section className="grid gap-8 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-16">
          <ProductGallery
            name={product.name}
            images={
              product.images.length
                ? product.images
                : [product.image]
            }
          />

          <div>
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
                  Print
                </span>

                <span className="text-[#ccc]">
                  /
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f0ed] px-2.5 py-1 text-[10px] font-semibold text-[#666]">
                  <BadgeCheck size={12} />

                  {statusLabels[product.status]}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#222] sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#777] sm:text-[15px]">
                {product.description}
              </p>
            </div>

            <ProductConfigurator
              product={product}
            />
          </div>
        </section>

        <ProductInformation
          turnaround={product.turnaround}
        />
      </div>
    </main>
  );
}
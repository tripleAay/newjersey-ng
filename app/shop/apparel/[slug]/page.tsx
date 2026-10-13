import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import {
  getProductBySlug,
} from "@/app/data/newjersey/products";

import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import ProductGallery from "@/app/components/newjersey/product/ProductGallery";
import ProductConfigurator from "@/app/components/newjersey/product/ProductConfigurator";
import ProductInformation from "@/app/components/newjersey/product/ProductInformation";

export const dynamic = "force-dynamic";

type ApparelProductPageProps = {
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

function parseDesignFee(value: unknown): number | undefined {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return undefined;
  }

  if (
    typeof value !== "number" &&
    typeof value !== "string"
  ) {
    throw new Error("Invalid product design fee.");
  }

  const amount = Number(value);

  if (
    !Number.isFinite(amount) ||
    amount < 0 ||
    amount > 9999999999
  ) {
    throw new Error("Invalid product design fee.");
  }

  return Math.round(amount * 100) / 100;
}

export default async function ApparelProductPage({
  params,
}: ApparelProductPageProps) {
  const { slug } = await params;

  const catalogueProduct = getProductBySlug(slug);

  if (
    !catalogueProduct ||
    catalogueProduct.category !== "apparel" ||
    catalogueProduct.published === false
  ) {
    notFound();
  }

  const supabase = getSupabaseAdmin();

  const { data: settings, error } = await supabase
    .from("products")
    .select("design_fee")
    .eq("slug", catalogueProduct.slug)
    .eq("publication_status", "published")
    .maybeSingle();

  if (error) {
    console.error("[Apparel product design fee]", error);
    throw new Error("Unable to load product pricing.");
  }

  const product = {
    ...catalogueProduct,
    designFee: parseDesignFee(settings?.design_fee),
  };

  const galleryImages = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

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

      <main className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="py-5 sm:py-7"
        >
          <Link
            href="/shop/apparel"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#F58220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F1E9]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to apparel
          </Link>
        </nav>

        <section className="grid gap-8 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-16">
          <div className="min-w-0">
            <ProductGallery
              key={product.id}
              name={product.name}
              images={galleryImages}
            />
          </div>

          <div className="min-w-0">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/shop/apparel"
                  className="rounded-sm text-xs font-bold uppercase tracking-[0.18em] text-[#625D55] transition-colors hover:text-[#F58220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4"
                >
                  Apparel
                </Link>

                <span
                  aria-hidden="true"
                  className="text-[#F58220]"
                >
                  /
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F58220]/10 px-2.5 py-1 text-[10px] font-semibold text-[#181818]">
                  <BadgeCheck
                    size={12}
                    aria-hidden="true"
                    className="text-[#F58220]"
                  />

                  {statusLabels[product.status]}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#625D55] sm:text-[15px]">
                {product.description}
              </p>
            </div>

            <ProductConfigurator
              key={`${product.id}:${product.designFee ?? "unset"}`}
              product={product}
            />
          </div>
        </section>

        <ProductInformation
          turnaround={product.turnaround}
        />
      </main>

      <Footer />
    </div>
  );
}
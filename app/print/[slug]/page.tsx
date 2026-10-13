import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

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
    product.category !== "print" ||
    product.published === false
  ) {
    notFound();
  }

  const galleryImages = product.images.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#6D1A36]/95 shadow-[0_2px_12px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main>
        <div className="mx-auto w-[92%] max-w-[1440px]">
          <nav
            aria-label="Breadcrumb"
            className="py-5 sm:py-7"
          >
            <Link
              href="/print"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#6D1A36]"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to print products
            </Link>
          </nav>

          <section className="grid gap-8 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-16">
            <div className="min-w-0">
              <ProductGallery
                name={product.name}
                images={galleryImages}
              />
            </div>

            <div className="min-w-0">
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/print"
                    className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D1A36]"
                  >
                    Print
                  </Link>

                  <span
                    aria-hidden="true"
                    className="text-[#ccc]"
                  >
                    /
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEECE6] px-2.5 py-1 text-[10px] font-semibold text-[#666]">
                    <BadgeCheck
                      size={12}
                      aria-hidden="true"
                    />
                    {statusLabels[product.status]}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#777] sm:text-[15px]">
                  {product.description}
                </p>
              </div>

              <ProductConfigurator
                key={product.id}
                product={product}
              />
            </div>
          </section>

          <ProductInformation
            turnaround={product.turnaround}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
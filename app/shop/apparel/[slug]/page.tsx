import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
import ProductGallery from "@/app/components/newjersey/product/ProductGallery";
import ApparelPurchase from "@/app/components/newjersey/product/ApparelPurchase";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { getProductBySlug } from "@/app/data/newjersey/products";
import {
  APPAREL_FIELDS,
  toApparelProduct,
  type ApparelRow,
} from "@/app/lib/newjersey/apparel/catalogue";
export const dynamic = "force-dynamic";
const statusLabels = {
  available: "Ready-designed",
  "made-to-order": "Made to order",
  custom: "Custom",
  "pre-order": "Preorder",
};
export default async function ApparelProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "custom-jerseys") redirect("/shop/jerseys");
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(APPAREL_FIELDS)
    .eq("slug", slug)
    .eq("apparel_enabled", true)
    .eq("publication_status", "published")
    .maybeSingle();
  if (error) throw new Error("Unable to load apparel.");
  const product = data ? toApparelProduct(data as unknown as ApparelRow) : null;
  if (!product) {
    const legacy = getProductBySlug(slug);
    if (legacy?.category === "apparel")
      redirect(`/shop/custom/${encodeURIComponent(slug)}`);
    notFound();
  }
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
        <nav aria-label="Breadcrumb" className="py-5 sm:py-7">
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

                <span aria-hidden="true" className="text-[#F58220]">
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

            <ApparelPurchase key={product.id} product={product} />
          </div>
        </section>

        <section className="border-t border-black/10 py-8 text-sm leading-7 text-[#625D55]">
          The product is sold with the design shown. Choose your size and colour
          before ordering. Delivery charges and availability are confirmed
          before payment.
        </section>
      </main>

      <Footer showQuoteCTA={false} />
    </div>
  );
}

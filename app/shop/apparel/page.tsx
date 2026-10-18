import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StoreShell from "@/app/components/newjersey/storefront/StoreShell";
import DepartmentBanner from "@/app/components/newjersey/storefront/DepartmentBanner";
import CollectionBrowser from "@/app/components/newjersey/storefront/CollectionBrowser";
import { loadApparel } from "@/app/lib/newjersey/storefront/load";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Apparel | NewJersey.ng",
  description:
    "Ready-designed clothing. Find your design, choose your size and colour, and add it to your cart.",
};
export default async function CollectionPage() {
  const products = await loadApparel();
  const imageHost = new URL(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://kqymeonftowhtgynerny.supabase.co",
  ).hostname;
  const heroProduct = products.find((product) => {
    try {
      const url = new URL(product.image);
      return (
        url.protocol === "https:" &&
        url.hostname === imageHost &&
        url.pathname.startsWith(
          "/storage/v1/object/public/newjersey-product-images/",
        )
      );
    } catch {
      return false;
    }
  });
  return (
    <StoreShell>
      <main className="mx-auto max-w-[1344px] px-4 pb-16 pt-5 sm:px-8 lg:px-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 text-xs text-[#625D55]"
        >
          <ArrowLeft size={15} />
          Back to shop
        </Link>
        <DepartmentBanner
          department="apparel"
          image={heroProduct?.image}
          imageName={heroProduct?.name}
        />
        <section
          id="apparel-collection"
          aria-label="Apparel collection"
          className="scroll-mt-40"
        >
          <CollectionBrowser products={products} department="apparel" />
        </section>
      </main>
    </StoreShell>
  );
}

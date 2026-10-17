import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import HeroSlider from "@/app/components/dashboard components/mainheroe";
import TopProducts from "@/app/components/dashboard components/popularPick";
import ShopDepartments from "@/app/components/dashboard components/shopDepartments";
import ShopProcess from "@/app/components/dashboard components/shopProcess";

import JerseyBanner from "@/app/components/newjersey/JerseyBanner";
import ApparelTileGrid from "@/app/components/newjersey/ApparelTileGrid";
import Footer from "@/app/components/Footer";

import JerseyShowcase from "@/app/shop/jerseys/JerseyShowcase";

import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import {
  JERSEY_FIELDS,
  toJerseyProduct,
  type JerseyProduct,
  type JerseyRow,
} from "@/app/lib/newjersey/jerseys/catalogue";

export const dynamic = "force-dynamic";

async function getShopJerseys(): Promise<JerseyProduct[]> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("products")
      .select(JERSEY_FIELDS)
      .eq("jersey_enabled", true)
      .eq("publication_status", "published")
      .eq("sale_mode", "fixed")
      .eq("currency", "NGN")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .limit(24);

    if (error) {
      console.error("[Shop jersey showcase]", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      return [];
    }

    return ((data ?? []) as unknown as JerseyRow[])
      .map(toJerseyProduct)
      .filter(
        (product): product is JerseyProduct =>
          product !== null
      )
      .slice(0, 8);
  } catch (error) {
    console.error("[Shop jersey showcase connection]", error);
    return [];
  }
}

export default async function ShopPage() {
  const jerseys = await getShopJerseys();

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
        <HeroSlider />

        <JerseyBanner />

        {jerseys.length > 0 && (
          <section
            aria-label="Shop jerseys"
            className="min-w-0 px-5 py-8 sm:px-8 sm:py-12 lg:px-12"
          >
            <div className="mx-auto min-w-0 max-w-[1344px]">
              <JerseyShowcase products={jerseys} />

              <div className="mt-5 flex justify-end">
                <Link
                  href="/shop/jerseys"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
                >
                  View all jerseys
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section
          aria-labelledby="shop-apparel-title"
          className="px-5 py-8 sm:px-8 sm:py-12 lg:px-12"
        >
          <div className="mx-auto max-w-[1344px]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8379]">
                  NewJersey.ng / Apparel
                </p>

                <h2
                  id="shop-apparel-title"
                  className="mt-2 text-xl font-semibold tracking-tight"
                >
                  Wear your identity.
                </h2>
              </div>

              <Link
                href="/shop/apparel"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
              >
                View all
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <ApparelTileGrid limit={4} />
          </div>
        </section>

        <TopProducts />
        <ShopDepartments />
        <ShopProcess />
      </main>

      <Footer />
    </div>
  );
}
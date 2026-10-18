import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import {
  JERSEY_FIELDS,
  toJerseyProduct,
  type JerseyProduct,
  type JerseyRow,
} from "@/app/lib/newjersey/jerseys/catalogue";

import JerseyBanner from "@/app/components/newjersey/JerseyBanner";
import JerseyShowcase from "./JerseyShowcase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Jerseys | NewJersey.ng",
  description:
    "Shop home, away and third kits. Choose your team, season and size, then personalise your jersey with a printed name and number.",
};

export default async function JerseysPage() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("products")
    .select(JERSEY_FIELDS)
    .eq("jersey_enabled", true)
    .eq("publication_status", "published")
    .eq("sale_mode", "fixed")
    .eq("currency", "NGN")
    .order("featured", { ascending: false })
    .order("jersey_team", { ascending: true })
    .order("jersey_season", { ascending: false })
    .order("id", { ascending: true })
    .limit(500);

  if (error) {
    console.error("[Jersey catalogue]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    throw new Error("Unable to load jerseys. Please try again.");
  }

  const products = ((data ?? []) as unknown as JerseyRow[])
    .map(toJerseyProduct)
    .filter((product): product is JerseyProduct => product !== null);

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-[1344px] px-5 pb-16 pt-5 sm:px-8 sm:pb-20 lg:px-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to shop
        </Link>

        <JerseyBanner embedded />
        <div id="jersey-kits" className="scroll-mt-40">
          {products.length > 0 && (
            <p className="mb-4 text-xs text-[#8A8379]">
              {products.length}{" "}
              {products.length === 1 ? "jersey available" : "jerseys available"}
            </p>
          )}
          <JerseyShowcase products={products} />
        </div>

        {products.length > 0 && (
          <aside
            aria-label="Jersey personalisation information"
            className="mt-10 border-t border-black/10 pt-5"
          >
            <p className="max-w-2xl text-xs leading-6 text-[#7A7368]">
              Prices shown are for the jersey. Available name and number charges
              are listed separately. Review your size, kit, spelling and
              capitalisation before submitting your order.
            </p>
          </aside>
        )}
      </main>

      <Footer showQuoteCTA={false} />
    </div>
  );
}

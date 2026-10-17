export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
import ApparelTileGrid from "@/app/components/newjersey/ApparelTileGrid";

export const metadata: Metadata = {
  title: "Apparel | NewJersey.ng",
  description:
    "Explore branded T-shirts, polos, hoodies and jerseys. Choose a product to view printing options and personalise your order.",
};

export default function ApparelPage() {
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

      <main className="mx-auto max-w-[1344px] px-5 pb-16 pt-5 sm:px-8 lg:px-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium text-[#625D55] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to shop
        </Link>

        <section aria-labelledby="apparel-title" className="pb-8 pt-6 sm:pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8379]">
            NewJersey.ng / Apparel
          </p>

          <h1
            id="apparel-title"
            className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
          >
            Wear your identity.
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-7 text-[#625D55]">
            Ready-designed clothing for everyday wear. Select a product to
            explore the details.
          </p>
        </section>

        <section aria-label="Apparel products">
          <ApparelTileGrid />
        </section>
      </main>

      <Footer showQuoteCTA={false} />
    </div>
  );
}

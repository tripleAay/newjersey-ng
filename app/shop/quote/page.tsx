import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import TopNav from "@/app/components/dashboard components/topnav";
import DashboardHeader from "@/app/components/dashboard components/mainheader";
import QuoteForm from "@/app/components/QuoteForm";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Request a Quote | NewJersey.ng",
  description:
    "Request a quote for printing, apparel, signage and branding.",
};

export default function ShopQuotePage() {
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

      <main>
        <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium text-[#625D55] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to shop
          </Link>
        </div>

        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
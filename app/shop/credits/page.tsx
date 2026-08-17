// src/app/credit/page.tsx
"use client";

import Header from "@/components/dashboard components/mainheader";
import GiftcardTradingHero from "@/components/credits/trading-hero";
import CurrencyStripe from "@/components/credits/currency-variety";
import Currency from "@/components/credits/card-types";
import GlassSearchBar from "@/components/credits/glassSearchBar";
import GiftCardOfferCard from "@/components/credits/giftcard-offer";
import HomeFooterNav from "@/components/dashboard components/footer-nav";

export default function CreditPage() {
  return (
    <div className="min-h-screen bg-black text-slate-50">
      {/* Fixed top header (handled inside Header) */}
      <Header />

      {/* Everything below clears the fixed header height (≈64px) */}
      <div className="pt-16">
        {/* HERO – scrolls normally, not sticky */}
        

        {/* STICKY CURRENCY BAR (no overflow) */}
        <div className="sticky top-15 z-30 bg-black/95/95 backdrop-blur-sm pb-6">
          <div className="max-w-6xl mt-5 mx-auto px-4 sm:px-6 lg:px-10 py-2 space-y-2">
            {/* These two can scroll horizontally inside themselves if needed,
               but the sticky wrapper itself will not overflow the viewport. */}
            <Currency />
            <CurrencyStripe />
            
          </div>
        </div>

        {/* MAIN BODY */}
        <main className="px-4 sm:px-6 lg:px-10 pb-10">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="pt-6">
              <GlassSearchBar />
            </div>

            {/* Offer card */}
            <div className="pt-4">
              <GiftCardOfferCard />
            </div>

          
          </div>
          <section className="px-4 sm:px-6 lg:px-10 pt-4 pb-3">
          <div className="max-w-6xl mx-auto">
            <GiftcardTradingHero />
          </div>

        </section>
        <div className="max-w-6xl mx-auto">
            {/* <FooterNav /> */}
            <HomeFooterNav />
          </div>
        </main>
      </div>
    </div>
  );
}

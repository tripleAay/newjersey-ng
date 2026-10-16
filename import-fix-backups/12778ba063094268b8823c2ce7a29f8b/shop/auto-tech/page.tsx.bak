// src/app/credit/page.tsx
"use client";

import Header from "@/components/dashboard components/mainheader";
import AutoTechHero from "@/components/auto-tech/auto-hero";
import VehicleQualitySection from "@/components/auto-tech/vehicleQualitySection";
import ProductFinderGrid from "@/components/auto-tech/product-finder";
import Footer from "@/components/footer";

export default function CreditPage() {
  return (
    <div className="min-h-screen bg-black text-slate-50">
      {/* Fixed top header */}
      <Header />

      {/* Main content – starts below fixed header */}
      <div className="pt-16"> {/* ← gives space for fixed header ≈64px */}
        {/* STICKY CURRENCY/BAR SECTION */}
        <div className="sticky top-16 z-30 bg-black/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AutoTechHero />
            <VehicleQualitySection />
            <ProductFinderGrid />
          </div>
        </div>

        {/* Footer at the bottom */}
        <Footer />
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
// import DashboardHeader from "../../components/dashboard components/mainheader";
import HeroSlider from "@/app/components/dashboard components/mainheroe";
import Collections from "@/app/components/dashboard components/collections";
import ProductTileGrid from "@/app/components/dashboard components/ProductTileGridMirror";
import HotStuffSection from "@/app/components/dashboard components/hotstuffSections";
import Footer from "@/app/components/Footer";
import ExploreByCategorySection from "@/app/components/dashboard components/exploreByCategorySection";
import HowItWorksSection from "@/app/components/dashboard components/howItWorksSection";
import ProjectModeCTA from "@/app/components/dashboard components/projectModeCTA";

const dashboardCategories = [
  {
    id: "web-services",
    name: "Web & Mobile App",
    image: "/categories/web.png",
    description:
      "High-performance websites, mobile apps and digital product experiences crafted to position your brand with clarity, speed and premium execution.",
    badge: "Digital Build",
  },
  {
    id: "services",
    name: "Services",
    image: "/categories/design.png",
    description:
      "Explore Fynaro’s service offers, pricing and execution options across websites, design, product support and brand-focused solutions for serious businesses.",
    badge: "Pricing & Offers",
  },
  {
    id: "printed-products",
    name: "Printed Products",
    image: "/categories/print.png",
    description:
      "Premium print, packaging and branded materials designed to carry your identity beautifully into the physical world.",
    badge: "Physical Brand",
  },
];

export default function ShopPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | number>(
    "web-services"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      {/* <DashboardHeader /> */}

      <main className="pt-16">
        {isLoading ? (
          <section className="px-4 sm:px-6 lg:px-10 mt-4 animate-pulse">
            <div className="max-w-6xl mx-auto">
              <div className="h-40 sm:h-56 lg:h-64 rounded-3xl bg-gradient-to-r from-neutral-800/70 to-neutral-900/70 border border-neutral-800/60" />
              <div className="mt-4 flex gap-3">
                <div className="h-8 w-32 rounded-full bg-neutral-800/80" />
                <div className="h-8 w-20 rounded-full bg-neutral-800/60" />
              </div>
            </div>
          </section>
        ) : (
          <HeroSlider />
        )}

        {isLoading ? (
          <section className="mt-10 px-4 sm:px-6 lg:px-10 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-40 rounded-full bg-neutral-800/80" />
              <div className="h-6 w-20 rounded-full bg-neutral-800/60" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-neutral-900/70 border border-neutral-800/70 p-4"
                >
                  <div className="h-32 rounded-xl bg-neutral-800/80 mb-3" />
                  <div className="h-4 w-3/4 bg-neutral-800/80 rounded-full mb-2" />
                  <div className="h-3 w-1/2 bg-neutral-800/70 rounded-full mb-1.5" />
                  <div className="h-3 w-1/3 bg-neutral-800/60 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <Collections />
        )}

        {isLoading ? (
          <section className="mt-10 px-4 sm:px-6 lg:px-10 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-40 rounded-full bg-neutral-800/80" />
              <div className="h-6 w-20 rounded-full bg-neutral-800/60" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-neutral-900/70 border border-neutral-800/70 p-4"
                >
                  <div className="h-32 rounded-xl bg-neutral-800/80 mb-3" />
                  <div className="h-4 w-3/4 bg-neutral-800/80 rounded-full mb-2" />
                  <div className="h-3 w-1/2 bg-neutral-800/70 rounded-full mb-1.5" />
                  <div className="h-3 w-1/3 bg-neutral-800/60 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-10 px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Featured Products
              </h2>
              <button className="text-sm text-white/60 hover:text-white transition">
                View all
              </button>
            </div>

            <ProductTileGrid />
          </section>
        )}

        {isLoading ? (
          <section className="mt-10 px-4 sm:px-6 lg:px-10 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-32 rounded-full bg-neutral-800/80" />
              <div className="h-6 w-16 rounded-full bg-neutral-800/60" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-neutral-900/70 border border-neutral-800/70 p-4"
                >
                  <div className="h-24 rounded-xl bg-neutral-800/80 mb-3" />
                  <div className="h-4 w-2/3 bg-neutral-800/80 rounded-full mb-2" />
                  <div className="h-3 w-1/2 bg-neutral-800/70 rounded-full mb-1" />
                  <div className="h-3 w-1/3 bg-neutral-800/60 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <HotStuffSection />
        )}

        <ExploreByCategorySection
          isLoading={isLoading}
          categories={dashboardCategories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={(cat) => {
            setActiveCategoryId(cat.id);
            console.log("Selected category:", cat.id);
          }}
        />

        <HowItWorksSection isLoading={isLoading} />
        <ProjectModeCTA />
      </main>

      <Footer />
    </div>
  );
}
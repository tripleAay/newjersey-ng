"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard components/mainheader";
import WebServicesHero from "@/components/dashboard components/WebServicesHero";
import DashboardBreadcrumb from "@/components/dashboard components/breadcrumb";
import Footer from "@/components/footer";
import HowItWorksSection from "@/components/dashboard components/howItWorksSection";
import ProjectModeCTA from "@/components/dashboard components/projectModeCTA";
import ServiceTilesSection from "@/components/dashboard components/webserviceTilesSection";
import ExploreByCategorySection from "@/components/dashboard components/exploreByCategorySection";

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
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState("web-services");

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <div className="border-b border-white/5 px-3 pb-4 pt-30">
        <DashboardBreadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Web Services" },
          ]}
        />
      </div>

      <DashboardHeader />
      <WebServicesHero />

      <main className="pt-4">
        <ServiceTilesSection />

        <ExploreByCategorySection
          isLoading={isLoading}
          categories={dashboardCategories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={(cat) => {
            setActiveCategoryId(String(cat.id));
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
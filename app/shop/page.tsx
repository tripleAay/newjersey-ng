"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import HeroSlider from "@/app/components/dashboard components/mainheroe";
import Collections from "@/app/components/dashboard components/collections";
import ProductTileGrid from "@/app/components/dashboard components/ProductTileGridMirror";
import HotStuffSection from "@/app/components/dashboard components/hotstuffSections";
import Footer from "@/app/components/Footer";
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

// Tracks scroll direction to decide whether the top nav should be visible.
function useTopNavVisibility(hideAfter = 80) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY.current;

      if (currentY < hideAfter) {
        setVisible(true);
      } else if (diff > 4) {
        setVisible(false);
      } else if (diff < -4) {
        setVisible(true);
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideAfter]);

  return visible;
}

export default function ShopPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | number>(
    "web-services"
  );
  const topNavVisible = useTopNavVisibility();

  // Measure real heights so DashboardHeader always sits flush under TopNav,
  // and page content never hides behind either fixed bar.
  const topNavRef = useRef<HTMLDivElement | null>(null);
  const dashboardHeaderRef = useRef<HTMLDivElement | null>(null);
  const [topNavHeight, setTopNavHeight] = useState(0);
  const [dashboardHeaderHeight, setDashboardHeaderHeight] = useState(0);

  // Portals need the DOM to exist first (SSR-safe mount check)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const topNavEl = topNavRef.current;
    const headerEl = dashboardHeaderRef.current;
    if (!topNavEl || !headerEl) return;

    const topNavObserver = new ResizeObserver((entries) => {
      setTopNavHeight(entries[0].contentRect.height);
    });
    const headerObserver = new ResizeObserver((entries) => {
      setDashboardHeaderHeight(entries[0].contentRect.height);
    });

    topNavObserver.observe(topNavEl);
    headerObserver.observe(headerEl);

    return () => {
      topNavObserver.disconnect();
      headerObserver.disconnect();
    };
  }, [mounted]);

  const fixedBars = (
    <>
      {/* TopNav: fixed at the very top, slides up and out on scroll down */}
      <motion.div
        ref={topNavRef}
        initial={false}
        animate={{ y: topNavVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.35, 1] }}
        className="fixed top-0 left-0 right-0 z-[60]"
      >
        <TopNav />
      </motion.div>

      {/* DashboardHeader: always fixed and visible, slides up to y:0 once
          TopNav is out of the way, so it stays flush against the very top */}
      <motion.div
        ref={dashboardHeaderRef}
        initial={false}
        animate={{ y: topNavVisible ? topNavHeight : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.35, 1] }}
        className="fixed left-0 right-0 top-0 z-50 bg-[#6D1A36]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
      >
        <DashboardHeader />
      </motion.div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#12100E] text-white">
      {/* Rendered via portal directly into <body>, so no ancestor's
          transform/filter/backdrop-blur can hijack the fixed positioning */}
      {mounted && createPortal(fixedBars, document.body)}

      {/* Spacer so page content starts below the fixed bars instead of
          being covered by them */}
      <div
        style={{
          height: (topNavVisible ? topNavHeight : 0) + dashboardHeaderHeight,
        }}
        aria-hidden
      />

      <main className="">
        <div className="mb-10">
          <HeroSlider />
        </div>

        <Collections />

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

        <HotStuffSection />

        <HowItWorksSection isLoading={false} />
        <ProjectModeCTA />
      </main>

      <Footer />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

import DashboardHeader from "@/components/dashboard components/mainheader";
import DashboardBreadcrumb from "@/components/dashboard components/breadcrumb";
import Footer from "@/components/footer";

import HowItWorksSection from "@/components/dashboard components/howItWorksSection";
import ProjectModeCTA from "@/components/dashboard components/projectModeCTA";

// 🔹 Dashboard-style categories (AutoTech-flavoured)
const dashboardCategories = [
    {
        id: "web-services",
        name: "Web Services",
        image: "/categories/web.png",
        description:
            "Landing pages, dashboards & booking flows for AutoTech brands.",
        badge: "AutoTech",
    },
    {
        id: "brand-design",
        name: "Brand Design",
        image: "/categories/design.png",
        description: "Logos, identity systems and brand kits for serious teams.",
        badge: "Studio",
    },
    {
        id: "printed-products",
        name: "Printed Products",
        image: "/categories/print.png",
        description: "Business cards, merch, packaging and rollout materials.",
        badge: "Print",
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
            {/* Header */}
            <DashboardHeader />
            {/* Breadcrumb */}
            <div className="pt-20 pb-4 border-b border-white/5">
                <DashboardBreadcrumb
                    items={[
                        { label: "Shop", href: "/shop" },
                        { label: "Brand Design" },
                    ]}
                />
            </div>

            {/* Main Content */}
            <main className="pt-16">
                {/* ===================== How It Works ===================== */}
                <HowItWorksSection isLoading={isLoading} />

                {/* ===================== Call-to-Action ===================== */}
                <ProjectModeCTA />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
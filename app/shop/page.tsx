import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import HeroSlider from "@/app/components/dashboard components/mainheroe";

import TopProducts from "@/app/components/dashboard components/popularPick";
import PrintedProducts from "@/app/components/dashboard components/printedProducts";
import BrandingProducts from "@/app/components/dashboard components/brandingProducts";
import ApparelMerch from "@/app/components/dashboard components/MerchProducts";
import ArtCreativeCustom from "@/app/components/dashboard components/ArtProducts";

import HowItWorksSection from "@/app/components/dashboard components/howItWorksSection";
import ProjectModeCTA from "@/app/components/dashboard components/projectModeCTA";
import Footer from "@/app/components/Footer";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#12100E] text-white">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#6D1A36]/95 shadow-[0_2px_12px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main>
        <HeroSlider />

        <TopProducts />

        <PrintedProducts />

        <BrandingProducts />

        <ApparelMerch />

        <ArtCreativeCustom />

        <HowItWorksSection isLoading={false} />

        <ProjectModeCTA />
      </main>

      <Footer />
    </div>
  );
}
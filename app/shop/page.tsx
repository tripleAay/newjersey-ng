import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import HeroSlider from "@/app/components/dashboard components/mainheroe";
import TopProducts from "@/app/components/dashboard components/popularPick";
import ShopDepartments from "@/app/components/dashboard components/shopDepartments";
import ShopProcess from "@/app/components/dashboard components/shopProcess";
import Footer from "@/app/components/Footer";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      {/* HEADER */}
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#6D1A36]/95 shadow-[0_2px_12px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      {/* STOREFRONT */}
      <main>
        <HeroSlider />

        <TopProducts />

        <ShopDepartments />

        <ShopProcess />
      </main>

      <Footer />
    </div>
  );
}
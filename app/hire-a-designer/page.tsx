import type { Metadata } from "next";
import Header from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
import DesignerSelection from "./DesignerSelection";
export const metadata: Metadata = {
  title: "Choose Your Designer | NewJersey.ng",
  description:
    "Choose INK or FORM for your NewJersey design project. Send a brief, review your quote and download your finished design.",
};
export default function HireDesignerPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>
        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <Header />
        </div>
      </header>
      <DesignerSelection />
      <Footer showQuoteCTA={false} />
    </div>
  );
}

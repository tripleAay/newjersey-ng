import type { ReactNode } from "react";
import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
export default function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-w-0 min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>
        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,.1)] backdrop-blur">
          <DashboardHeader />
        </div>
      </header>
      {children}
      <Footer showQuoteCTA={false} />
    </div>
  );
}

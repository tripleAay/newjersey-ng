import type { ReactNode } from "react";
import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
export const dynamic = "force-dynamic";
export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100]">
        <TopNav />
        <div className="bg-[#FF6B00]">
          <DashboardHeader />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">{children}</main>
      <Footer showQuoteCTA={false} />
    </div>
  );
}

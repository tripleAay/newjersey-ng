import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  PackagePlus,
  Sparkles,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import PrintCatalogue from "@/app/components/newjersey/print/PrintCatalogue";
import Footer from "@/app/components/Footer";

export default function PrintPage() {
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

      <main>
        {/* =========================================
            PRINT DEPARTMENT INTRO
        ========================================= */}
        <section className="border-b border-black/[0.08] bg-[#F3F0E8]">
          <div className="mx-auto w-[92%] max-w-[1440px]">
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 border-b border-black/[0.07] py-5">
              <Link
                href="/shop"
                className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-[#88847C] transition hover:text-[#FF6B00]"
              >
                <ArrowLeft
                  size={13}
                  className="transition-transform group-hover:-translate-x-0.5"
                />

                Shop
              </Link>

              <span className="text-black/20">/</span>

              <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#181818]">
                Print
              </span>
            </div>

            {/* HERO */}
            <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:py-20">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-[2px] w-7 bg-[#FF6B00]" />

                  <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">
                    Print Department
                  </span>
                </div>

                <h1 className="max-w-[800px] text-[48px] font-black leading-[0.9] tracking-[-0.055em] text-[#181818] sm:text-[64px] lg:text-[78px]">
                  Print what
                  <br />
                  needs to exist.
                </h1>
              </div>

              <div className="lg:pb-1">
                <p className="max-w-[450px] text-[13px] leading-7 text-[#6F6B64] sm:text-sm">
                  Everyday business print, promotional materials and custom
                  production. Choose a product, set the requirements and move
                  the job forward.
                </p>

                <Link
                  href="/custom"
                  className="group mt-6 inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.13em] text-[#181818] transition-colors hover:text-[#FF6B00]"
                >
                  Need something custom?

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white transition-all group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white">
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CATALOGUE
        ========================================= */}
        <PrintCatalogue />

        {/* =========================================
            CUSTOM PRINT
        ========================================= */}
        <section className="bg-[#181818] py-14 text-white sm:py-16">
          <div className="mx-auto w-[92%] max-w-[1440px]">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex gap-5">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] sm:flex">
                  <PackagePlus size={19} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={13}
                      className="text-[#FF6B00]"
                    />

                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">
                      Custom production
                    </p>
                  </div>

                  <h2 className="mt-3 text-[27px] font-black tracking-[-0.035em] sm:text-[34px]">
                    Can't find the exact print job?
                  </h2>

                  <p className="mt-3 max-w-[600px] text-[12px] leading-6 text-white/50 sm:text-[13px]">
                    Send the quantity, dimensions, material, finishing and
                    deadline. We'll review the requirements before production.
                  </p>
                </div>
              </div>

              <Link
                href="/custom"
                className="group inline-flex min-h-[50px] w-fit items-center justify-center gap-4 rounded-full bg-[#FF6B00] px-7 text-[9px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#181818]"
              >
                Start custom job

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
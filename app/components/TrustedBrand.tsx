"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const brandLogos = [
  {
    name: "DADDIESHINOR",
    image: "/images/brands/daddieshinor.png",
    url: "https://daddieshinor.com",
  },
  {
    name: "FYNARO",
    image: "/images/brands/fynarotech-04-04.jpg",
    url: "https://fynarotech.com",
  },
  {
    name: "Bosch",
    image: "/images/brands/bosch.png",
    url: "https://bosch.com",
  },
  {
    name: "EDC",
    image: "/images/brands/edc.png",
    url: "https://edc.edu.ng",
  },
  {
    name: "Alpha Pharma",
    image: "/images/brands/alpha-pharma.png",
    url: "https://alphapharma.com",
  },
  {
    name: "Brand",
    image: "/images/brands/brand-logo.png",
    url: "https://example.com",
  },
];

export default function TrustedBrandsSection() {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const handleBrandClick = (name: string) => {
    setActiveBrand((current) => (current === name ? null : name));
  };

  return (
    <section className="bg-[#2E1E0F] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">

        {/* MAIN CARD */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#FF6B00] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-7 lg:p-8">

          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/20" />

          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/15" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

          {/* HEADER */}
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />

                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-black/60">
                  Trusted Brands
                </span>
              </div>

              <h2 className="text-2xl font-black leading-none tracking-[-0.03em] text-black sm:text-3xl">
                Brands we’ve helped{" "}
                <span className="text-white">show up.</span>
              </h2>
            </div>

            <Link
              href="/shop"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition duration-300 hover:bg-white hover:text-black"
            >
              Start printing

              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* LOGO WALL */}
          <div className="relative z-10 mt-5 overflow-hidden rounded-[20px] bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">

              {brandLogos.map((logo) => {
                const isActive = activeBrand === logo.name;

                return (
                  <button
                    key={logo.name}
                    type="button"
                    onClick={() => handleBrandClick(logo.name)}
                    aria-label={`View ${logo.name} details`}
                    className={`
                      group relative flex min-h-[96px] cursor-pointer
                      items-center justify-center
                      border-b border-r border-black/5
                      px-4 py-5
                      text-left
                      outline-none
                      transition-all duration-300 ease-out
                      hover:bg-[#f7f3ee]
                      focus-visible:z-20
                      focus-visible:ring-2
                      focus-visible:ring-inset
                      focus-visible:ring-black

                      sm:min-h-[112px] sm:px-6
                      lg:min-h-[132px] lg:px-7

                      [&:nth-child(2n)]:border-r-0
                      sm:[&:nth-child(2n)]:border-r
                      sm:[&:nth-child(3n)]:border-r-0
                      lg:[&:nth-child(3n)]:border-r
                      lg:[&:nth-child(6n)]:border-r-0

                      lg:[&:nth-child(n+4)]:border-b-0

                      ${isActive ? "bg-[#f7f3ee]" : ""}
                    `}
                  >
                    {/* Logo */}
                    <div
                      className={`
                        relative flex h-full w-full
                        items-center justify-center
                        transition-transform duration-300 ease-out
                        ${isActive ? "-translate-y-2 scale-[0.94]" : ""}
                        group-hover:-translate-y-1
                        group-hover:scale-[1.02]
                      `}
                    >
                      <Image
                        src={logo.image}
                        alt={logo.name}
                        width={240}
                        height={100}
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                        className={`
                          h-auto
                          w-[75%]
                          max-w-[240px]
                          object-contain
                          opacity-100
                          transition-all
                          duration-300
                          ease-out

                          sm:w-[78%]
                          lg:w-[82%]

                          group-hover:scale-105
                          group-hover:opacity-60

                          ${isActive ? "opacity-40" : ""}
                        `}
                      />
                    </div>

                    {/* FLYOUT */}
                    <div
                      className={`
                        pointer-events-none absolute
                        bottom-2 left-1/2 z-20
                        w-[calc(100%-16px)]
                        -translate-x-1/2

                        transition-all duration-300 ease-out

                        ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-3 opacity-0"
                        }
                      `}
                    >
                      <div className="rounded-[12px] bg-black px-3 py-2 text-white shadow-[0_8px_25px_rgba(0,0,0,0.18)]">

                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[9px] font-black uppercase tracking-[0.12em]">
                              {logo.name}
                            </p>

                            <p className="mt-0.5 truncate text-[7px] font-medium text-white/50">
                              {logo.url.replace(/^https?:\/\//, "")}
                            </p>
                          </div>

                          <ExternalLink className="h-3 w-3 shrink-0 text-white/50" />
                        </div>

                      </div>
                    </div>

                    {/* ACTIVE INDICATOR */}
                    <span
                      className={`
                        absolute bottom-0 left-1/2
                        h-[2px] -translate-x-1/2
                        rounded-full bg-[#FF6B00]
                        transition-all duration-300
                        ${isActive ? "w-8" : "w-0"}
                      `}
                    />
                  </button>
                );
              })}

            </div>
          </div>

          {/* MICRO FOOTER */}
          <div className="relative z-10 mt-4 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/50">
              Selected clients
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">
              06 brands
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
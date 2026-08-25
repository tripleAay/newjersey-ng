"use client";

import Link from "next/link";
import { ArrowUpRight, Palette, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const [designerHover, setDesignerHover] = useState(false);

  return (
    <div className="w-full border-t border-black/80 bg-[#f7f7f7]">
      <div className="relative mx-auto flex h-[34px] w-full max-w-[1893px] items-center justify-between px-4 sm:px-8 lg:px-[70px]">

        {/* LEFT — Hire a Designer */}
        <Link
          href="/hire-a-designer"
          onMouseEnter={() => setDesignerHover(true)}
          onMouseLeave={() => setDesignerHover(false)}
          className="group flex items-center gap-1.5 text-[11px] font-medium text-[#222] transition-all duration-200 sm:text-[12px]"
        >
          <span
            className={`flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#968e68] text-white transition-all duration-300 ${
              designerHover
                ? "rotate-[-8deg] scale-110"
                : "rotate-0 scale-100"
            }`}
          >
            <Palette
              size={10}
              strokeWidth={2.5}
            />
          </span>

          <span className="whitespace-nowrap">
            Hire a Designer
          </span>

          <ArrowUpRight
            size={12}
            className={`transition-all duration-300 ${
              designerHover
                ? "translate-x-[2px] -translate-y-[2px] opacity-100"
                : "translate-x-0 translate-y-0 opacity-50"
            }`}
          />
        </Link>

        {/* CENTER — BRAND */}
        <Link
          href="/"
          aria-label="newjersey.ng home"
          className="absolute left-1/2 flex -translate-x-1/2 items-center transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="text-[15px] font-black tracking-[-0.8px] text-[#252525] sm:text-[17px]">
            newjersey
          </span>

          <span className="ml-[1px] text-[9px] font-bold text-[#968e68] sm:text-[10px]">
            .ng
          </span>
        </Link>

        {/* RIGHT — SERVICES */}
        <div className="ml-auto flex items-center gap-3 sm:gap-5">

          {/* Pay */}
          <Link
            href="/payments"
            className="group hidden items-center gap-1 text-[#a5a5a5] transition-colors hover:text-[#968e68] sm:flex"
          >
            <ShieldCheck
              size={14}
              strokeWidth={2.3}
              className="transition-transform duration-200 group-hover:scale-110"
            />

            <span className="text-[10px] font-bold tracking-wide">
              PAY
            </span>
          </Link>

          {/* Delivery */}
          <Link
            href="/delivery"
            className="group hidden items-center gap-1 text-[#a5a5a5] transition-colors hover:text-[#968e68] sm:flex"
          >
            <Truck
              size={14}
              strokeWidth={2.3}
              className="transition-transform duration-200 group-hover:-translate-y-[1px]"
            />

            <span className="text-[10px] font-bold tracking-wide">
              DELIVERY
            </span>
          </Link>

          {/* Mobile designer shortcut */}
          <Link
            href="/hire-a-designer"
            className="flex items-center gap-1 text-[#968e68] sm:hidden"
          >
            <Palette size={13} />

            <span className="text-[10px] font-semibold">
              Designer
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}
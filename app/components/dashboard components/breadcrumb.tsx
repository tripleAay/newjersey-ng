"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function DashboardBreadcrumb({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <div className="w-full px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.08em] text-white/40">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition-all hover:text-[#d6cc6d]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#d6cc6d]">
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight className="h-3 w-3 text-white/20" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { ArrowUpRight, Palette } from "lucide-react";
export default function TopNav() {
  return (
    <div className="border-b border-[#FF6B00]/[.07] bg-[#F3EFE9] text-[#746E65]">
      <div className="mx-auto flex min-h-8 max-w-[1344px] items-center justify-between gap-3 px-4 sm:px-8 lg:px-12">
        <p className="text-[10px] tracking-wide">
          NewJersey.ng{" "}
          <span className="hidden sm:inline">/ Print &amp; branding</span>
        </p>
        <nav
          aria-label="Store information"
          className="flex items-center gap-4 text-[10px]"
        >
          <Link
            href="/hire-a-designer"
            className="inline-flex min-h-8 items-center gap-1.5 font-medium text-[#FF6B00] focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
          >
            <Palette size={12} strokeWidth={1.5} aria-hidden="true" />
            Hire a designer
            <ArrowUpRight size={11} aria-hidden="true" />
          </Link>
          <Link
            href="/shop/help/payments"
            className="hidden min-h-8 items-center transition-colors duration-500 hover:text-[#FF6B00] sm:inline-flex"
          >
            Payments
          </Link>
          <Link
            href="/shop/help/delivery"
            className="hidden min-h-8 items-center transition-colors duration-500 hover:text-[#FF6B00] sm:inline-flex"
          >
            Delivery
          </Link>
        </nav>
      </div>
    </div>
  );
}

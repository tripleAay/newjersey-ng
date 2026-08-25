"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  UserRound,
  CircleHelp,
  Shopping,
   ShoppingCart,
  ChevronDown,
  Package,
  Heart,
  User,
  LogIn,
  ShoppingBag,
  Truck,
  XCircle,
  RotateCcw,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export default function MainHeader() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
   <header className="w-full border-b border-neutral-200/70 bg-[#E7E5DF] text-[#262626] shadow-[0_1px_6px_rgba(0,0,0,0.06)]">

      {/* =========================================================
          DESKTOP HEADER
      ========================================================= */}
      <div className="hidden lg:block">
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center gap-4 px-5 xl:px-7">

          {/* =====================================================
              BRAND
          ===================================================== */}
          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="newjersey.ng home"
          >
            <span className="text-[24px] font-black leading-none tracking-[-1.5px] text-[#242424]">
              newjersey
            </span>

            <span className="ml-0.5 text-[16px] font-bold leading-none tracking-[-0.7px] text-[#f58220]">
              .ng
            </span>
          </Link>

          {/* =====================================================
              SEARCH
          ===================================================== */}
          <div className="min-w-0 flex-1">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex h-[40px] w-full items-center overflow-hidden rounded-full bg-[#f3f3f3] transition-all focus-within:bg-[#eeeeee] focus-within:ring-2 focus-within:ring-[#f58220]/15"
            >
              <Search
                size={19}
                strokeWidth={2.2}
                className="ml-4 shrink-0 text-[#333]"
              />

              <input
                type="text"
                placeholder="Search products, brands and categories"
                className="min-w-0 flex-1 bg-transparent px-2.5 text-[13px] text-[#333] outline-none placeholder:text-[#777]"
              />

              <button
                type="submit"
                className="mr-1 h-[34px] rounded-full bg-[#f58220] px-5 text-[13px] font-semibold text-white transition hover:bg-[#e87512] active:scale-[0.98]"
              >
                Search
              </button>
            </form>
          </div>

          {/* =====================================================
              ACCOUNT
          ===================================================== */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => {
              setAccountOpen(true);
              setHelpOpen(false);
            }}
            onMouseLeave={() => setAccountOpen(false)}
          >
            <button
              type="button"
              className={`flex h-[40px] items-center gap-1.5 rounded-lg px-2 transition ${
                accountOpen
                  ? "bg-[#f5f5f5]"
                  : "hover:bg-[#f5f5f5]"
              }`}
              aria-expanded={accountOpen}
            >
              <UserRound
                size={20}
                strokeWidth={2}
                className="text-[#303030]"
              />

              <span className="text-[13px] font-semibold">
                Account
              </span>

              <ChevronDown
                size={14}
                strokeWidth={2.3}
                className={`transition-transform duration-200 ${
                  accountOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* ACCOUNT DROPDOWN */}
            <div
              className={`absolute right-0 top-[46px] w-[225px] origin-top-right transition-all duration-200 ${
                accountOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1.5 scale-[0.98] opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.12)]">

                {/* SIGN IN FEATURE */}
                <Link
                  href="/login"
                  className="group flex items-center gap-2.5 rounded-lg bg-[#fff8f3] px-2.5 py-2.5 transition hover:bg-[#fff1e5]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1e5]">
                    <LogIn
                      size={15}
                      className="text-[#f58220]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-neutral-900">
                      Sign in
                    </p>

                    <p className="mt-0.5 text-[9px] text-neutral-500">
                      Access your account
                    </p>
                  </div>

                  <ArrowRight
                    size={13}
                    className="text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-[#f58220]"
                  />
                </Link>

                <div className="my-1.5 border-t border-neutral-100" />

                <DropdownItem
                  href="/account"
                  icon={<User size={16} />}
                  label="Account"
                />

                <DropdownItem
                  href="/orders"
                  icon={<Package size={16} />}
                  label="Orders"
                />

                <DropdownItem
                  href="/wishlist"
                  icon={<Heart size={16} />}
                  label="Wishlist"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              HELP
          ===================================================== */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => {
              setHelpOpen(true);
              setAccountOpen(false);
            }}
            onMouseLeave={() => setHelpOpen(false)}
          >
            <button
              type="button"
              className={`flex h-[40px] items-center gap-1.5 rounded-lg px-2 transition ${
                helpOpen
                  ? "bg-[#f5f5f5]"
                  : "hover:bg-[#f5f5f5]"
              }`}
              aria-expanded={helpOpen}
            >
              <CircleHelp
                size={20}
                strokeWidth={2}
                className="text-[#303030]"
              />

              <span className="text-[13px] font-semibold">
                Help
              </span>

              <ChevronDown
                size={14}
                strokeWidth={2.3}
                className={`transition-transform duration-200 ${
                  helpOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* HELP DROPDOWN */}
            <div
              className={`absolute right-0 top-[46px] w-[245px] origin-top-right transition-all duration-200 ${
                helpOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1.5 scale-[0.98] opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.12)]">

                <DropdownItem
                  href="/help/place-order"
                  icon={<ShoppingBag size={16} />}
                  label="Place an order"
                  description="Learn how to shop"
                />

                <DropdownItem
                  href="/help/track-order"
                  icon={<Truck size={16} />}
                  label="Track an order"
                  description="Check your delivery status"
                />

                <DropdownItem
                  href="/help/cancel-order"
                  icon={<XCircle size={16} />}
                  label="Cancel an order"
                  description="Manage an existing order"
                />

                <DropdownItem
                  href="/help/returns-refunds"
                  icon={<RotateCcw size={16} />}
                  label="Returns & refunds"
                  description="Get help with returns"
                />

                <div className="my-1.5 border-t border-neutral-100" />

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/2340000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 transition hover:bg-[#f1faf4]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f7ee]">
                    <MessageCircle
                      size={16}
                      className="text-[#25D366]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-neutral-800 transition group-hover:text-[#168c45]">
                      WhatsApp
                    </p>

                    <p className="mt-0.5 text-[9px] text-neutral-500">
                      Chat with our support team
                    </p>
                  </div>

                  <ArrowRight
                    size={13}
                    className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-[#25D366]"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* =====================================================
              CART
          ===================================================== */}
          <Link
            href="/shop/cart"
            className="flex h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-2 transition hover:bg-[#f5f5f5]"
          >
            <div className="relative">
              <ShoppingCart
                size={21}
                strokeWidth={2}
              />

              <span className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#f58220] px-1 text-[8px] font-bold text-white">
                0
              </span>
            </div>

            <span className="text-[13px] font-semibold">
              Cart
            </span>
          </Link>
        </div>
      </div>

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <div className="lg:hidden">
        <div className="flex h-[52px] items-center justify-between px-4">

          {/* BRAND */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            <span className="text-[21px] font-black tracking-[-1.3px]">
              newjersey
            </span>

            <span className="ml-0.5 text-[14px] font-bold text-[#f58220]">
              .ng
            </span>
          </Link>

          <div className="flex items-center gap-0.5">

            {/* ACCOUNT */}
            <Link
              href="/account"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-neutral-100"
              aria-label="Account"
            >
              <UserRound size={19} />
            </Link>

            {/* CART */}
            <Link
              href="/shop/cart"
              className="relative flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-neutral-100"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />

              <span className="absolute right-0 top-0 flex h-[13px] min-w-[13px] items-center justify-center rounded-full bg-[#f58220] px-0.5 text-[7px] font-bold text-white">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="border-t border-neutral-100 px-4 py-2">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex h-[38px] items-center overflow-hidden rounded-full bg-[#f3f3f3]"
          >
            <Search
              size={17}
              className="ml-3.5 shrink-0 text-neutral-700"
            />

            <input
              type="text"
              placeholder="Search products, brands and categories"
              className="min-w-0 flex-1 bg-transparent px-2.5 text-[12px] outline-none placeholder:text-neutral-500"
            />

            <button
              type="submit"
              className="mr-1 h-[32px] rounded-full bg-[#f58220] px-3.5 text-[11px] font-semibold text-white"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

/* =============================================================
   DROPDOWN ITEM
============================================================= */

function DropdownItem({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition hover:bg-[#fff5ed]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition group-hover:bg-[#fff1e5] group-hover:text-[#f58220]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-neutral-800 transition group-hover:text-[#f58220]">
          {label}
        </p>

        {description && (
          <p className="mt-0.5 truncate text-[9px] text-neutral-500">
            {description}
          </p>
        )}
      </div>

      <ArrowRight
        size={12}
        className="text-neutral-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:text-[#f58220] group-hover:opacity-100"
      />
    </Link>
  );
}
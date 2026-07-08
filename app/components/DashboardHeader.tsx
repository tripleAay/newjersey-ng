"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Quotes", href: "/dashboard/quotes" },
  { label: "Designs", href: "/dashboard/designs" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchUrl = `/products?search=${encodeURIComponent(searchTerm)}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-8 lg:px-16">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[24px] font-black tracking-tight text-black">
            New<span className="text-[#ff6b00]">Jersey</span>
            <span className="text-[14px] font-bold text-black">.ng</span>
          </span>

         
        </Link>

        <nav className="hidden items-center gap-7 text-[14px] font-semibold text-black/65 lg:flex">
          {dashboardLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative transition hover:text-[#ff6b00] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#ff6b00] after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex h-full items-center">
          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-zinc-100"
            >
              <Image src="/images/search.png" alt="Search" width={19} height={19} />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-14 z-50 w-[340px] rounded-2xl border border-black/10 bg-white p-4 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff6b00]">
                  Quick Search
                </p>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products, orders, quotes..."
                  className="h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none transition focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                  autoFocus
                />

                {searchTerm.trim() && (
                  <div className="mt-3 space-y-2">
                    <Link
                      href={searchUrl}
                      className="flex items-center justify-between rounded-xl bg-[#f7f3ee] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#ff6b00] hover:text-white"
                    >
                      <span>Search Products</span>
                      <span>→</span>
                    </Link>

                    <Link
                      href={`/dashboard/orders?search=${encodeURIComponent(
                        searchTerm
                      )}`}
                      className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black ring-1 ring-black/10 transition hover:bg-black hover:text-white"
                    >
                      <span>Search Orders</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/dashboard/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-zinc-100"
            >
              🔔
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff6b00]" />
            </Link>

            <a
              href="https://wa.me/2348089570493"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-zinc-100"
            >
              <Image src="/images/whatsapp.png" alt="WhatsApp" width={26} height={26} />
            </a>
          </div>

          <Link
            href="/cart"
            className="relative ml-4 flex h-[68px] w-[68px] items-center justify-center bg-[#E7EFC5] transition hover:bg-[#ff6b00]"
          >
            <Image src="/images/shopping-cart.png" alt="Cart" width={21} height={21} />
            <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffdd00] text-[9px] font-black text-black">
              0
            </span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((prev) => !prev)}
              className="flex h-[68px] items-center gap-3 border-l border-black/10 px-5 transition hover:bg-zinc-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-black text-white">
                NJ
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-sm font-black leading-none text-black">
                  Account
                </p>
                <p className="mt-1 text-[11px] text-black/45">
                  Manage profile
                </p>
              </div>

              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-[76px] z-50 w-[240px] rounded-2xl border border-black/10 bg-white p-3 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
                <Link
                  href="/dashboard/profile"
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-black transition hover:bg-[#ff6b00] hover:text-white"
                >
                  Profile
                </Link>

                <Link
                  href="/dashboard/orders"
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-black transition hover:bg-[#ff6b00] hover:text-white"
                >
                  My Orders
                </Link>

                <Link
                  href="/dashboard/quotes"
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-black transition hover:bg-[#ff6b00] hover:text-white"
                >
                  My Quotes
                </Link>

                <div className="my-2 h-px bg-black/10" />

                <Link
                  href="/"
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                >
                  Back to Website
                </Link>

                <button className="mt-1 block w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
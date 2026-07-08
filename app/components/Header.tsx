"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchUrl = `/products?search=${encodeURIComponent(searchTerm)}`;

  return (
    <header className="w-full bg-white border-b border-black/10">
      <div className="h-[72px] flex items-center justify-between px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[26px] font-black tracking-tight text-black">
            New<span className="text-[#ff6b00]">Jersey</span>
            <span className="text-[15px] font-bold text-black">.ng</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-semibold text-black/75">
          {[
            { label: "All Products", href: "/products" },
            { label: "Apparel", href: "/apparel" },
            { label: "Hire a Designer", href: "/hire-designer" },
            { label: "Training", href: "/training" },
            { label: "About", href: "/about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative transition-colors duration-300 hover:text-[#ff6b00] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#ff6b00] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center h-full">
          <Link
            href="/login"
            className="hidden xl:flex items-center justify-center h-11 min-w-[120px] rounded-full border-2 border-black px-6 text-[14px] font-semibold text-black transition-all hover:bg-[#ff6b00] hover:border-[#ff6b00] hover:text-white"
          >
            Login
          </Link>

          <div className="relative flex items-center gap-1 ml-4">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 transition"
            >
              <Image src="/images/search.png" alt="Search" width={20} height={20} />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-14 z-50 w-[320px] rounded-2xl border border-black/10 bg-white p-4 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff6b00]">
                  Search Products
                </p>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search apparel, mugs, cards..."
                  className="h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#ff6b00]"
                  autoFocus
                />

                {searchTerm.trim() && (
                  <Link
                    href={searchUrl}
                    className="mt-3 flex items-center justify-between rounded-xl bg-[#f7f3ee] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#ff6b00] hover:text-white"
                  >
                    <span>Open All Products</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            )}

            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 transition">
              <Image
                src="/images/phone-call (1).png"
                alt="Phone"
                width={20}
                height={20}
              />
            </button>

            <a
              href="https://wa.me/2348089570493"
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 transition"
            >
              <Image src="/images/whatsapp.png" alt="WhatsApp" width={28} height={28} />
            </a>
          </div>

          <Link
            href="/cart"
            className="relative ml-4 flex h-[72px] w-[72px] items-center justify-center bg-[#E7EFC5] transition hover:bg-[#ff6b00]"
          >
            <Image src="/images/shopping-cart.png" alt="Cart" width={22} height={22} />
            <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffdd00] text-[9px] font-black text-black">
              0
            </span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((prev) => !prev)}
              className="flex h-[72px] items-center gap-2 px-6 border-l border-black/10 hover:bg-zinc-50 transition"
            >
              <Image src="/images/user.png" alt="Account" width={22} height={22} />
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
              <div className="absolute right-0 top-[78px] z-50 w-[210px] rounded-2xl border border-black/10 bg-white p-3 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
                <Link
                  href="/login"
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-black transition hover:bg-[#ff6b00] hover:text-white"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
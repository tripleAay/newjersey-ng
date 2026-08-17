"use client";

import Link from "next/link";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/why-fynaro", label: "Why Fynaro" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/6 bg-[#050506]/92 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" onClick={closeMenu}>
            <Image
              src="/images/fynaro-tech logo.png"
              alt="Fynaro Tech Logo"
              width={200}
              height={80}
              className="h-8 w-auto sm:h-9"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/68">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors duration-300 hover:text-[#d6cc6d]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/75 transition-all duration-300 hover:border-[#d6cc6d]/30 hover:bg-[#d6cc6d]/10 hover:text-[#d6cc6d]"
            >
              <FiUser className="text-[15px]" />
              <span>Login</span>
            </Link>

            <button
              onClick={toggleMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/75 transition-all duration-300 hover:border-[#d6cc6d]/30 hover:bg-[#d6cc6d]/10 hover:text-[#d6cc6d] md:hidden"
              aria-label="Toggle menu"
              type="button"
            >
              {isMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMenuOpen
            ? "pointer-events-auto bg-black/55 opacity-100"
            : "pointer-events-none bg-black/0 opacity-0"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed left-0 right-0 top-14 z-50 border-b border-white/6 bg-[#050506]/97 backdrop-blur-2xl md:hidden transition-all duration-300 ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-6">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-[15px] font-medium text-white/82 transition-all duration-300 hover:border-[#d6cc6d]/25 hover:bg-[#d6cc6d]/8 hover:text-[#d6cc6d]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/auth/login"
            onClick={closeMenu}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d6cc6d] px-5 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#e4d98a]"
          >
            <FiUser className="text-[16px]" />
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
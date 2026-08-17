"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu as MenuIcon,
  X,
  Printer,
  Layers,
  Palette,
  Settings,
  Home,
  Package,
  ClipboardList,
  Heart,
} from "lucide-react";

type DropdownKey = "prints" | "branding" | null;

const Dashhead: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = (dropdown: DropdownKey) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const isActive = (href: string) => pathname === href;

  const baseLinkClass =
    "flex items-center gap-3 w-full transition-all duration-300";
  const activeClass = "text-[#F5B400]";
  const inactiveClass = "text-[#111014] hover:text-[#F5B400]";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-md bg-[#111014] p-2 text-white shadow-md transition-all duration-300 hover:bg-[#1b1a22] lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 transform flex-col justify-between border-r border-gray-200/80 bg-white px-7 py-8 text-[#111014] transition-transform duration-500 ease-in-out lg:static lg:h-auto lg:w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Branding */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="block">
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-[#111014]">Fynaro</span>{" "}
                <span className="text-[#111014]/30">Studio</span>
              </h2>
              <p className="text-[0.7rem] uppercase tracking-[0.15em] text-gray-400">
                Dashboard
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 transition-all hover:text-black lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Info */}
          <div className="mb-6 rounded-2xl bg-[#111014]/5 px-4 py-3">
            <p className="text-xs font-medium text-gray-600">
              Active Workspace
            </p>
            <p className="mt-1 text-sm font-semibold text-[#111014]">
              Product & Print Management
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-6 text-sm">
            {/* Dashboard */}
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className={`group flex w-full items-center justify-between font-semibold transition-all ${
                isActive("/shop") ? activeClass : inactiveClass
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center justify-center rounded-full p-1.5 ${
                    isActive("/shop")
                      ? "bg-[#F5B400]/15"
                      : "bg-[#111014]/5"
                  }`}
                >
                  <Home size={15} />
                </span>
                <span>Overview</span>
              </span>
            </Link>

            {/* Orders & Activity */}
            <div className="space-y-3">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-gray-400">
                Activity
              </p>

              <Link
                href="/shop/order"
                onClick={() => setIsOpen(false)}
                className={`${baseLinkClass} font-medium ${
                  isActive("/shop/order") ? activeClass : inactiveClass
                }`}
              >
                <Package size={16} />
                <span>Orders & Fulfilment</span>
              </Link>

              <Link
                href="/shop/requests/new"
                onClick={() => setIsOpen(false)}
                className={`${baseLinkClass} font-medium ${
                  isActive("/shop/print-requests")
                    ? activeClass
                    : inactiveClass
                }`}
              >
                <ClipboardList size={16} />
                <span>Print Requests</span>
              </Link>

              <Link
                href="/shop/wish-list"
                onClick={() => setIsOpen(false)}
                className={`${baseLinkClass} font-medium ${
                  isActive("/shop/saved-products")
                    ? activeClass
                    : inactiveClass
                }`}
              >
                <Heart size={16} />
                <span>Saved Products</span>
              </Link>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-gray-400">
                Services
              </p>

              {/* Print Products */}
              <div>
                <button
                  onClick={() => toggleDropdown("prints")}
                  className="flex w-full items-center justify-between font-semibold text-[#111014] transition-all hover:text-[#F5B400]"
                >
                  <span className="flex items-center gap-3">
                    <Printer size={16} />
                    <span>Print Products</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openDropdown === "prints"
                        ? "rotate-180 text-[#F5B400]"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {openDropdown === "prints" && (
                  <div className="mt-3 space-y-2 pl-7 text-[13px] text-gray-600">
                    <Link
                      href="/shop/printed-products"
                      onClick={() => setIsOpen(false)}
                      className={`block text-left transition-all ${
                        isActive("/shop/printedproducts")
                          ? "font-semibold text-[#F5B400]"
                          : "hover:text-[#111014]"
                      }`}
                    >
                      All Print Products
                    </Link>
                    <button className="block text-left transition-all hover:text-[#111014]">
                      Business Cards
                    </button>
                    <button className="block text-left transition-all hover:text-[#111014]">
                      Posters & Banners
                    </button>
                    <button className="block text-left transition-all hover:text-[#111014]">
                      T-Shirts & Apparel
                    </button>
                    <button className="block text-left transition-all hover:text-[#111014]">
                      Packaging Prints
                    </button>
                  </div>
                )}
              </div>

              {/* Branding Services */}
              <div>
                <button
                  onClick={() => toggleDropdown("branding")}
                  className="flex w-full items-center justify-between font-semibold text-[#111014] transition-all hover:text-[#F5B400]"
                >
                  <span className="flex items-center gap-3">
                    <Layers size={16} />
                    <span>Branding Services</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openDropdown === "branding"
                        ? "rotate-180 text-[#F5B400]"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {openDropdown === "branding" && (
                  <div className="mt-3 space-y-2 pl-7 text-[13px] text-gray-600">
                    <Link
                      href="/shop/branding-services"
                      onClick={() => setIsOpen(false)}
                      className={`block text-left transition-all ${
                        isActive("/shop/branding-services")
                          ? "font-semibold text-[#F5B400]"
                          : "hover:text-[#111014]"
                      }`}
                    >
                      All Branding Services
                    </Link>
                    <button className="block text-left transition-all hover:text-[#111014]">
                      Logo Design
                    </button>
                    <button className="block text-left transition-all hover:text-[#111014]">
                      Brand Identity Systems
                    </button>
                    <button className="block text-left transition-all hover:text-[#111014]">
                      Social Media Kit
                    </button>
                  </div>
                )}
              </div>

              {/* Digital Design */}
              <Link
                href="/shop/digital-assets"
                onClick={() => setIsOpen(false)}
                className={`${baseLinkClass} font-semibold ${
                  isActive("/shop/web-services")
                    ? activeClass
                    : inactiveClass
                }`}
              >
                <Palette size={16} />
                <span>Web Services</span>
              </Link>
            </div>

            {/* Settings */}
            <div className="mt-4 border-t border-gray-200/70 pt-2">
              <Link
                href="/shop/settings"
                onClick={() => setIsOpen(false)}
                className={`${baseLinkClass} text-[14px] font-medium ${
                  isActive("/shop/settings") ? activeClass : inactiveClass
                }`}
              >
                <Settings size={16} />
                <span>Workspace Settings</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer Currency Section */}
        <footer className="mt-8 border-t border-gray-200 pt-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6 overflow-hidden rounded-full border border-gray-300">
                <Image
                  src="https://flagcdn.com/w20/ng.png"
                  alt="Nigeria Flag"
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
              <button className="flex items-center gap-1 font-medium text-[#111014] transition-all hover:text-[#F5B400]">
                NGN
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <p className="text-[0.7rem] text-gray-400">
              Prices shown in Nigerian Naira
            </p>
          </div>
        </footer>
      </aside>
    </>
  );
};

export default Dashhead;
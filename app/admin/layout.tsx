"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  FileImage,
  Images,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Truck,
  X,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Collections", href: "/admin/collections", icon: Tags },
  { name: "Showcase", href: "/admin/showcase", icon: Images },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList },
  { name: "Artwork", href: "/admin/artworks", icon: FileImage },
  { name: "Production", href: "/admin/production", icon: Boxes },
  { name: "Delivery", href: "/admin/delivery", icon: Truck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const currentPage =
    navigation.find((item) => isActive(item.href))?.name ?? "Admin";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  function renderNavigation(mobile = false) {
    return (
      <nav
        aria-label={mobile ? "Mobile admin navigation" : "Admin navigation"}
        className={mobile ? "grid grid-cols-2 gap-1" : "space-y-1"}
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-11 items-center gap-3 rounded-lg px-3",
                "text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
                className={`shrink-0 ${active ? "text-[#F58220]" : ""}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="flex min-h-screen items-start bg-[#F6F6F3] text-[#181818]">
      {/* No independent sidebar scrolling */}
      <aside className="sticky top-0 hidden min-h-screen w-56 shrink-0 flex-col bg-[#181818] lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link
            href="/admin"
            aria-label="NewJersey.ng admin home"
            className="text-xl font-bold tracking-tight text-white"
          >
            newjersey<span className="text-[#F58220]">.ng</span>
          </Link>
        </div>

        <div className="px-3 py-4">
          {renderNavigation()}
        </div>

        <div className="mt-auto border-t border-white/10 p-3">
          <Link
            href="/shop"
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Store size={18} aria-hidden="true" />
            View store
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-black/[0.08] bg-white">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-admin-navigation"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-neutral-100 lg:hidden"
              >
                {menuOpen ? (
                  <X size={20} aria-hidden="true" />
                ) : (
                  <Menu size={20} aria-hidden="true" />
                )}
              </button>

              <p className="truncate text-sm font-semibold">
                {currentPage}
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-neutral-100"
            >
              <Store size={16} aria-hidden="true" />
              View store
            </Link>
          </div>
        </header>

        {menuOpen && (
          <div
            id="mobile-admin-navigation"
            className="bg-[#181818] p-3 lg:hidden"
          >
            {renderNavigation(true)}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
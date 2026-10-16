"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  FileImage,
  Images,
  Landmark,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Truck,
} from "lucide-react";

import AdminHeader from "./AdminHeader";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Collections", href: "/admin/collections", icon: Tags },
  { name: "Showcase", href: "/admin/showcase", icon: Images },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList },
  { name: "Payments", href: "/admin/payments", icon: Landmark },
  { name: "Artwork", href: "/admin/artworks", icon: FileImage },
  { name: "Production", href: "/admin/production", icon: Boxes },
  { name: "Delivery", href: "/admin/delivery", icon: Truck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

type Props = {
  children: ReactNode;
  adminName: string;
  role: "owner" | "admin" | "production";
};

export default function AdminShell({
  children,
  adminName,
  role,
}: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  const visibleNavigation = navigation.filter(
    (item) =>
      role !== "production" ||
      !["Products", "Collections", "Showcase", "Payments", "Settings"].includes(
        item.name
      )
  );

  function isActive(href: string) {
    return href === "/admin"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  const currentPage =
    navigation.find((item) => isActive(item.href))?.name ||
    "Admin";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    function closeOnDesktop() {
      if (media.matches) setMenuOpen(false);
    }

    media.addEventListener("change", closeOnDesktop);

    return () =>
      media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("admin-menu-toggle")?.focus();
      }
    }

    function outside(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      const toggle = document.getElementById("admin-menu-toggle");

      if (
        !mobileRef.current?.contains(event.target) &&
        !toggle?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);

    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [menuOpen]);

  function renderNavigation(mobile = false) {
    return (
      <nav
        aria-label={
          mobile ? "Mobile admin navigation" : "Admin navigation"
        }
        className={
          mobile ? "grid grid-cols-2 gap-1" : "space-y-1"
        }
      >
        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
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
                className={
                  active ? "shrink-0 text-[#F58220]" : "shrink-0"
                }
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
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Store size={18} aria-hidden="true" />
            View store
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <AdminHeader
          title={currentPage}
          adminName={adminName}
          role={role}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((current) => !current)}
        />

        <div
          ref={mobileRef}
          id="mobile-admin-navigation"
          hidden={!menuOpen}
          className="border-t border-white/10 bg-[#181818] p-3 lg:hidden"
        >
          {renderNavigation(true)}
        </div>

        {children}
      </div>
    </div>
  );
}
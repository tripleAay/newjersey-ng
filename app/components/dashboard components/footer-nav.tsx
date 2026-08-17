// src/components/fynaro/FynaroFooterNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import type { ReactNode } from "react";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: "Home",
    href: "/fynaro",
    icon: <Home className="h-[18px] w-[18px]" />,
  },
  {
    key: "wishlist",
    label: "Wishlist",
    href: "/fynaro/wishlist",
    icon: <Heart className="h-[18px] w-[18px]" />,
  },
  {
    key: "cart",
    label: "Cart",
    href: "/fynaro/cart",
    icon: <ShoppingCart className="h-[18px] w-[18px]" />,
  },
  {
    key: "profile",
    label: "Profile",
    href: "/fynaro/profile",
    icon: <User className="h-[18px] w-[18px]" />,
  },
];

export default function HomeFooterNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;

    // Home matches only exact
    if (href === "/fynaro") return pathname === "/fynaro";

    // Everything else uses startsWith
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-4000
        md:hidden
        bg-black/95 backdrop-blur-2xl
        border-t border-white/10
        shadow-[0_-8px_32px_rgba(0,0,0,0.85)]
      "
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-2.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`
                flex flex-1 flex-col items-center justify-center
                gap-0.5 text-[10px] font-medium
                transition-all
                ${
                  active
                    ? "text-[#F5B400]"
                    : "text-white/55 hover:text-white"
                }
              `}
            >
              <span
                className={`
                  flex h-9 w-9 items-center justify-center rounded-full
                  border transition-all
                  ${
                    active
                      ? "bg-white text-black border-white shadow-[0_0_18px_rgba(245,180,0,0.75)]"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }
                `}
              >
                {item.icon}
              </span>
              <span className="leading-none tracking-[0.16em] uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

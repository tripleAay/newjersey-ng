"use client";

import { Menu, ChevronRight, X } from "lucide-react";

import AdminNotifications from "./AdminNotifications";

type Props = {
  title: string;
  section?: string;
  adminName: string;
  role: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export default function AdminHeader({
  title,
  section,
  adminName,
  role,
  menuOpen,
  onToggleMenu,
}: Props) {
  const initials =
    adminName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white">
      <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            id="admin-menu-toggle"
            type="button"
            onClick={onToggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-admin-navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] lg:hidden"
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>

          {section && section !== title && section !== "Overview" && (
            <>
              <span className="hidden text-xs text-[#7A7368] sm:inline">
                {section}
              </span>
              <ChevronRight
                size={14}
                aria-hidden="true"
                className="hidden text-black/25 sm:block"
              />
            </>
          )}
          <p className="truncate text-sm font-semibold">{title}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <AdminNotifications />

          <div className="flex items-center gap-3 border-l border-black/10 pl-3 sm:pl-4">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F1EE] text-xs font-semibold"
            >
              {initials}
            </span>

            <div className="hidden max-w-40 sm:block">
              <p className="truncate text-xs font-semibold">
                {adminName || "Administrator"}
              </p>
              <p className="mt-1 text-[11px] capitalize text-[#7A7368]">
                {role}
              </p>
            </div>

            <span className="sr-only sm:hidden">
              {adminName}, {role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

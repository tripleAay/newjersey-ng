"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";

import AdminHeader from "./AdminHeader";
import { navigationFor } from "./navigation";

type Props = {
  children: ReactNode;
  adminName: string;
  role: "owner" | "admin" | "production";
};

type Badges = Record<string, number>;

function readBadges(value: unknown): Badges | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("badges" in value)
  ) {
    return null;
  }

  const raw = value.badges;

  if (
    typeof raw !== "object" ||
    raw === null ||
    Array.isArray(raw)
  ) {
    return null;
  }

  const result: Badges = {};

  for (const [href, count] of Object.entries(raw)) {
    if (
      href.startsWith("/admin/") &&
      typeof count === "number" &&
      Number.isSafeInteger(count) &&
      count >= 0
    ) {
      result[href] = count;
    }
  }

  return result;
}

export default function AdminShell({
  children,
  adminName,
  role,
}: Props) {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [badges, setBadges] = useState<Badges>({});

  const mobileRef = useRef<HTMLDivElement>(null);

  const visibleNavigation = navigationFor(role);

  function isActive(href: string) {
    return href === "/admin"
      ? pathname === href
      : pathname === href ||
          pathname.startsWith(`${href}/`);
  }

  const currentItem = [...visibleNavigation]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => isActive(item.href));

  const currentPage = currentItem?.name || "Admin";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    function closeOnDesktop() {
      if (media.matches) setMenuOpen(false);
    }

    media.addEventListener("change", closeOnDesktop);

    return () => {
      media.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setMenuOpen(false);
      document.getElementById("admin-menu-toggle")?.focus();
    }

    function outside(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      const toggle = document.getElementById(
        "admin-menu-toggle"
      );

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

  useEffect(() => {
    let disposed = false;
    let loading = false;
    let controller: AbortController | null = null;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    async function refreshBadges() {
      if (
        disposed ||
        loading ||
        document.visibilityState !== "visible"
      ) {
        return;
      }

      loading = true;
      controller = new AbortController();

      timeout = setTimeout(() => {
        controller?.abort();
      }, 12000);

      try {
        const response = await fetch(
          "/api/admin/navigation-badges",
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          if (!disposed) setBadges({});
          return;
        }

        if (!response.ok) return;

        const payload: unknown = await response.json();
        const nextBadges = readBadges(payload);

        if (!disposed && nextBadges) {
          setBadges(nextBadges);
        }
      } catch {
        // Keep existing counts during temporary network failures.
      } finally {
        clearTimeout(timeout);
        loading = false;
      }
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        void refreshBadges();
      }
    }

    void refreshBadges();

    const interval = setInterval(() => {
      void refreshBadges();
    }, 30000);

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener(
      "visibilitychange",
      refreshWhenVisible
    );

    // Notification controls can dispatch this after marking read.
    window.addEventListener(
      "admin-notifications-updated",
      refreshWhenVisible
    );

    return () => {
      disposed = true;
      clearInterval(interval);
      clearTimeout(timeout);
      controller?.abort();

      window.removeEventListener(
        "focus",
        refreshWhenVisible
      );
      document.removeEventListener(
        "visibilitychange",
        refreshWhenVisible
      );
      window.removeEventListener(
        "admin-notifications-updated",
        refreshWhenVisible
      );
    };
  }, [pathname, role]);

  function renderNavigation(mobile = false) {
    return (
      <nav
        aria-label={
          mobile
            ? "Mobile admin navigation"
            : "Admin navigation"
        }
        className="space-y-1"
      >
        {visibleNavigation.map((item, index) => {
          const Icon = item.icon;
          const active = currentItem?.href === item.href;
          const unreadCount = badges[item.href] ?? 0;

          const startsGroup =
            index === 0 ||
            visibleNavigation[index - 1].group !== item.group;

          return (
            <div key={item.href}>
              {startsGroup && (
                <p className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  {item.group}
                </p>
              )}

              <Link
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
                    active
                      ? "shrink-0 text-[#F58220]"
                      : "shrink-0"
                  }
                />

                <span className="min-w-0 flex-1">
                  {item.name}
                </span>

                {unreadCount > 0 && (
                  <>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#F58220] px-1.5 text-[10px] font-bold tabular-nums text-[#181818]"
                    >
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>

                    <span className="sr-only">
                      , {unreadCount} unread notifications
                    </span>
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="flex min-h-screen items-start bg-[#F6F6F3] text-[#181818]">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-[#181818] lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
          <Link
            href="/admin"
            aria-label="NewJersey.ng admin home"
            className="text-xl font-bold tracking-tight text-white"
          >
            newjersey
            <span className="text-[#F58220]">.ng</span>
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
          {renderNavigation()}
        </div>

        <div className="shrink-0 border-t border-white/10 p-3">
          <Link
            href="/shop"
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/60 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
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
          onToggleMenu={() => {
            setMenuOpen((current) => !current);
          }}
        />

        <div
          ref={mobileRef}
          id="mobile-admin-navigation"
          hidden={!menuOpen}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-[#181818] p-3 lg:hidden"
        >
          {renderNavigation(true)}
        </div>

        {children}
      </div>
    </div>
  );
}
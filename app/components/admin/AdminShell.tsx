"use client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, Store, X } from "lucide-react";
import AdminHeader from "./AdminHeader";
import { adminGroups, navigationFor } from "./navigation";
type Props = {
  children: ReactNode;
  adminName: string;
  role: "owner" | "admin" | "production";
};
type Badges = Record<string, number>;

function readBadges(value: unknown): Badges | null {
  if (typeof value !== "object" || value === null || !("badges" in value)) {
    return null;
  }

  const raw = value.badges;

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
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

export default function AdminShell({ children, adminName, role }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [badges, setBadges] = useState<Badges>({});
  const visibleNavigation = navigationFor(role);
  const currentItem = [...visibleNavigation]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/admin"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
  const activeGroup = currentItem?.group ?? "Overview";
  const [expanded, setExpanded] = useState(activeGroup);
  const drawerRef = useRef<HTMLDivElement>(null);
  const currentPage = currentItem?.name ?? "Admin";
  useEffect(() => {
    setMenuOpen(false);
    setExpanded(activeGroup);
  }, [pathname, activeGroup]);
  useEffect(() => {
    const media = matchMedia("(min-width: 1024px)");
    const close = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const before =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled])",
        ) ?? [],
      ).filter((node) => node.getClientRects().length > 0);
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keyboard);
      before?.focus();
    };
  }, [menuOpen]);
  useEffect(() => {
    let disposed = false;
    let loading = false;
    let controller: AbortController | null = null;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    async function refreshBadges() {
      if (disposed || loading || document.visibilityState !== "visible") {
        return;
      }

      loading = true;
      controller = new AbortController();

      timeout = setTimeout(() => {
        controller?.abort();
      }, 12000);

      try {
        const response = await fetch("/api/admin/navigation-badges", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401 || response.status === 403) {
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
    document.addEventListener("visibilitychange", refreshWhenVisible);

    // Notification controls can dispatch this after marking read.
    window.addEventListener("admin-notifications-updated", refreshWhenVisible);

    return () => {
      disposed = true;
      clearInterval(interval);
      clearTimeout(timeout);
      controller?.abort();

      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener(
        "admin-notifications-updated",
        refreshWhenVisible,
      );
    };
  }, [pathname, role]);

  function badge(count: number) {
    return count > 0 ? (
      <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-md bg-[#FF6B00] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-[#181818]">
        <span aria-hidden="true">{count > 99 ? "99+" : count}</span>
        <span className="sr-only">{count} unread notifications</span>
      </span>
    ) : null;
  }
  function renderNavigation(mobile = false) {
    return (
      <nav
        aria-label={mobile ? "Mobile admin navigation" : "Admin navigation"}
        className="space-y-2"
      >
        <Link
          href="/admin"
          onClick={() => setMenuOpen(false)}
          aria-current={pathname === "/admin" ? "page" : undefined}
          className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] ${pathname === "/admin" ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
        >
          <LayoutDashboard size={18} aria-hidden="true" />
          Overview
        </Link>
        <p className="px-3 pb-1 pt-6 text-[9px] font-semibold uppercase tracking-[.18em] text-white/35">
          Manage your store
        </p>
        {adminGroups.map((group) => {
          const items = visibleNavigation.filter(
            (item) => item.group === group.name,
          );
          if (!items.length) return null;
          const Icon = group.icon,
            open = expanded === group.name,
            active = activeGroup === group.name;
          const count = items.reduce(
            (total, item) => total + (badges[item.href] ?? 0),
            0,
          );
          const id = `${mobile ? "mobile" : "desktop"}-admin-${group.name.toLowerCase()}`;
          return (
            <div key={group.name}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setExpanded(open ? "" : group.name)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] ${active ? "text-white" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon
                  size={18}
                  aria-hidden="true"
                  className={active ? "text-[#FF6B00]" : ""}
                />
                <span>{group.name}</span>
                {!open && badge(count)}
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`ml-auto transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                />
              </button>
              <div
                id={id}
                hidden={!open}
                className="ml-5 space-y-1 border-l border-white/10 pb-3 pl-3 pt-1"
              >
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={
                      currentItem?.href === item.href ? "page" : undefined
                    }
                    className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] ${currentItem?.href === item.href ? "bg-[#FF6B00]/15 font-semibold text-[#FF9A51]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  >
                    <span>{item.name}</span>
                    {badge(badges[item.href] ?? 0)}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    );
  }
  const brand = (
    <Link
      href="/admin"
      className="text-xl font-bold tracking-tight text-white"
      aria-label="NewJersey.ng admin home"
    >
      newjersey<span className="text-[#FF6B00]">.ng</span>
    </Link>
  );
  const store = (
    <Link
      href="/shop"
      onClick={() => setMenuOpen(false)}
      className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-xs text-white/60 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
    >
      <Store size={17} aria-hidden="true" />
      View store
    </Link>
  );
  return (
    <div className="flex min-h-screen items-start bg-[#F7F7F4] text-[#181818]">
      <a
        href="#admin-page-content"
        className="sr-only z-[100] rounded-lg bg-[#FF6B00] p-3 text-sm text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to page content
      </a>
      <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col bg-[#181818] lg:flex">
        <div className="flex h-[72px] shrink-0 items-center border-b border-white/10 px-6">
          {brand}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          {renderNavigation()}
        </div>
        <div className="border-t border-white/10 p-3">{store}</div>
      </aside>
      <div className="min-w-0 flex-1" inert={menuOpen || undefined}>
        <AdminHeader
          title={currentPage}
          section={activeGroup}
          adminName={adminName}
          role={role}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((value) => !value)}
        />
        <div
          id="admin-page-content"
          tabIndex={-1}
          className="min-w-0 outline-none"
        >
          {children}
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/45 lg:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) setMenuOpen(false);
          }}
        >
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            id="mobile-admin-navigation"
            className="flex h-dvh w-[min(310px,85vw)] flex-col bg-[#181818] shadow-xl"
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
              {brand}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
              {renderNavigation(true)}
            </div>
            <div className="border-t border-white/10 p-3">{store}</div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  ClipboardList,
  Heart,
  HelpCircle,
  Palette,
  Printer,
  Settings,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";

const groups = [
  {
    label: "Shop",
    items: [
      {
        label: "Explore shop",
        href: "/shop",
        icon: ShoppingBag,
      },
      {
        label: "Printing",
        href: "/shop/print",
        icon: Printer,
      },
      {
        label: "Apparel",
        href: "/shop/apparel",
        icon: Shirt,
      },
      {
        label: "Jerseys",
        href: "/shop/jerseys",
        icon: Shirt,
      },
      { label: "Custom printing", href: "/shop/custom", icon: Printer },
      {
        label: "Branding",
        href: "/shop/branding",
        icon: Palette,
      },
    ],
  },
  {
    label: "Your account",
    items: [
      {
        label: "My orders",
        href: "/shop/order",
        icon: ClipboardList,
      },
      {
        label: "Cart",
        href: "/shop/cart",
        icon: ShoppingCart,
      },

      {
        label: "Settings",
        href: "/shop/account",
        icon: Settings,
      },
    ],
  },
];

export default function ShopSideNav() {
  const pathname = usePathname();
  const panelId = useId();

  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const activeHref = groups
    .flatMap((group) => group.items)
    .filter((item) =>
      item.href === "/shop"
        ? pathname === "/shop"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  function clearCloseTimer() {
    if (closeTimerRef.current !== undefined) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }

  function closeNavigation(returnFocus = false) {
    clearCloseTimer();
    setOpen(false);

    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }

  useEffect(() => {
    setOpen(false);

    if (closeTimerRef.current !== undefined) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== undefined) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const focusInside = rootRef.current?.contains(document.activeElement);

      setOpen(false);

      if (focusInside) {
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed left-0 top-1/2 z-[120] -translate-y-1/2"
      onPointerEnter={(event) => {
        clearCloseTimer();

        if (
          event.pointerType === "mouse" &&
          window.matchMedia("(hover: hover) and (pointer: fine)").matches
        ) {
          setOpen(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;

        clearCloseTimer();

        closeTimerRef.current = setTimeout(() => {
          if (rootRef.current?.contains(document.activeElement)) {
            return;
          }

          setOpen(false);
        }, 180);
      }}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          closeNavigation();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close shop navigation" : "Open shop navigation"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearCloseTimer();
          setOpen((current) => !current);
        }}
        className={[
          "relative flex min-h-24 w-9 flex-col items-center justify-center gap-2",
          "rounded-r-xl border border-l-0 border-black/10",
          "bg-white/95 text-[#625D55] shadow-[2px_2px_12px_rgba(0,0,0,0.04)]",
          "backdrop-blur-md transition-colors hover:text-[#181818]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220]",
        ].join(" ")}
      >
        <span className="text-[10px] font-semibold tracking-[0.08em] [writing-mode:vertical-rl]">
          Explore
        </span>

        <ChevronRight
          size={13}
          aria-hidden="true"
          className={[
            "transition-transform motion-reduce:transition-none",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-full top-1/2 w-[248px] max-w-[calc(100vw-3rem)] -translate-y-1/2 pl-2"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/5 px-4 py-2">
            <Link
              href="/shop"
              onClick={() => closeNavigation()}
              className="inline-flex min-h-11 items-center text-sm font-semibold tracking-tight text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              newjersey
              <span className="text-[#F58220]">.ng</span>
            </Link>

            <button
              type="button"
              aria-label="Close shop navigation"
              onClick={() => closeNavigation(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#625D55] hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Shop navigation"
            className="min-h-0 overflow-y-auto overscroll-contain px-2 pb-3"
          >
            {groups.map((group, groupIndex) => (
              <div
                key={group.label}
                className={
                  groupIndex > 0 ? "mt-3 border-t border-black/5 pt-1" : ""
                }
              >
                <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8379]">
                  {group.label}
                </p>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeHref === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => closeNavigation()}
                        className={[
                          "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]",
                          active
                            ? "bg-[#F5F4F0] font-semibold text-[#181818]"
                            : "text-[#625D55] hover:bg-[#FAF9F6] hover:text-[#181818]",
                        ].join(" ")}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.7}
                          aria-hidden="true"
                          className={
                            active ? "shrink-0 text-[#F58220]" : "shrink-0"
                          }
                        />

                        <span className="flex-1">{item.label}</span>

                        {active && (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-[#F58220]"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="shrink-0 border-t border-black/10 px-3 py-2">
            <a
              href="mailto:hello@newjersey.ng"
              onClick={() => closeNavigation()}
              className="flex min-h-11 items-center gap-3 rounded-xl px-2 text-xs font-medium text-[#625D55] hover:bg-[#FAF9F6] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              <HelpCircle size={17} strokeWidth={1.7} aria-hidden="true" />

              <span className="flex-1">Need help?</span>

              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

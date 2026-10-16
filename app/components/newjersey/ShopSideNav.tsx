"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Shop",
    href: "/shop",
    icon: ShoppingBag,
  },
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
    label: "Help",
    href: "/contact",
    icon: HelpCircle,
  },
];

export default function ShopSideNav() {
  const pathname = usePathname();
  const panelId = useId();

  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

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

  function isActive(href: string) {
    if (href === "/shop") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  useEffect(() => {
    setOpen(false);
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

      setOpen(false);

      // Return focus only when the keyboard user
      // was interacting with this navigation.
      if (
        document.activeElement &&
        rootRef.current?.contains(document.activeElement)
      ) {
        triggerRef.current?.focus();
      }
    }

    document.addEventListener(
      "pointerdown",
      handleOutsidePointer
    );
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointer
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
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
          window.matchMedia(
            "(hover: hover) and (pointer: fine)"
          ).matches
        ) {
          setOpen(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;

        clearCloseTimer();

        closeTimerRef.current = setTimeout(() => {
          // Keep navigation open while a link has focus.
          if (
            rootRef.current?.contains(
              document.activeElement
            )
          ) {
            return;
          }

          setOpen(false);
        }, 180);
      }}
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget as Node | null
          )
        ) {
          closeNavigation();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          open
            ? "Close shop navigation"
            : "Open shop navigation"
        }
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
        className="absolute left-full top-1/2 w-[232px] max-w-[calc(100vw-3rem)] -translate-y-1/2 pl-2"
      >
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
          <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
            <p className="text-[11px] font-medium text-[#7A7368]">
              Your NewJersey
            </p>

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
            className="space-y-1 px-2 pb-3"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    active ? "page" : undefined
                  }
                  onClick={() => closeNavigation()}
                  className={[
                    "flex min-h-12 items-center gap-3 rounded-xl px-3",
                    "text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]",
                    active
                      ? "bg-[#F5F4F0] font-semibold text-[#181818]"
                      : "text-[#625D55] hover:bg-[#FAF9F6] hover:text-[#181818]",
                  ].join(" ")}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {active && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#F58220]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-black/10 px-4 py-3">
            <Link
              href="/shop"
              onClick={() => closeNavigation()}
              className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#625D55] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              newjersey.ng
              <ArrowUpRight
                size={13}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
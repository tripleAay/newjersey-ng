"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowDown, ArrowUp, MessageCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/app/contexts/cartContext";
import { notifyShop } from "@/app/components/dashboard components/common/fynaroToast";
import { useShopIdentity } from "./useShopIdentity";
import SupportConversation from "./SupportConversation";
import type { SupportThread } from "@/app/lib/newjersey/support/model";
const browsePaths = new Set([
  "/shop",
  "/shop/apparel",
  "/shop/print",
  "/shop/branding",
  "/shop/jerseys",
  "/shop/custom",
  "/shop/search",
]);
export default function ShopExperience() {
  const pathname = usePathname();
  const identity = useShopIdentity();
  const { hydrated, itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState("");
  const [unread, setUnread] = useState(false);
  const [scroll, setScroll] = useState({ long: false, up: false });
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const initialCart = useRef<boolean | null>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname, identity]);
  useEffect(() => {
    const show = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setPrefill(
        typeof detail?.message === "string"
          ? detail.message.slice(0, 3000)
          : "",
      );
      setOpen(true);
      toast.dismiss("cart-reminder");
    };
    window.addEventListener("newjersey-open-support", show);
    return () => window.removeEventListener("newjersey-open-support", show);
  }, []);
  useEffect(() => {
    if (!open) return;
    heading.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !panel.current?.contains(event.target) &&
        !trigger.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  useEffect(() => {
    if (!identity) {
      setUnread(false);
      return;
    }
    const abort = new AbortController();
    const poll = async () => {
      if (document.visibilityState !== "visible" || open) return;
      try {
        const response = await fetch("/api/support?summary=1", {
          cache: "no-store",
          signal: abort.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          thread: SupportThread | null;
          viewerId: string;
        };
        if (abort.signal.aborted || data.viewerId !== identity) return;
        const t = data.thread;
        setUnread(
          Boolean(
            t?.last_admin_at &&
            (!t.customer_read_at ||
              Date.parse(t.last_admin_at) > Date.parse(t.customer_read_at)),
          ),
        );
      } catch {}
    };
    void poll();
    const timer = setInterval(() => void poll(), 60000);
    window.addEventListener("focus", poll);
    return () => {
      abort.abort();
      clearInterval(timer);
      window.removeEventListener("focus", poll);
    };
  }, [identity, open]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setScroll({ long: max > 600, up: scrollY > Math.max(250, max * 0.5) });
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [pathname]);
  useEffect(() => {
    if (!hydrated) return;
    if (initialCart.current === null) initialCart.current = itemCount > 0;
    if (!initialCart.current || !itemCount || !browsePaths.has(pathname))
      return;
    let already = false;
    try {
      already =
        sessionStorage.getItem("newjersey-cart-reminder-v1") === "shown" ||
        Date.now() -
          Number(localStorage.getItem("newjersey-cart-reminder-at") ?? 0) <
          1800000;
    } catch {
      return;
    }
    if (already) return;
    const timer = setTimeout(() => {
      if (
        document.visibilityState !== "visible" ||
        document.querySelector('[role="dialog"]') ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName ?? "",
        )
      )
        return;
      try {
        if (
          Date.now() -
            Number(localStorage.getItem("newjersey-cart-reminder-at") ?? 0) <
          1800000
        )
          return;
        sessionStorage.setItem("newjersey-cart-reminder-v1", "shown");
        localStorage.setItem("newjersey-cart-reminder-at", String(Date.now()));
      } catch {
        return;
      }
      notifyShop(
        "Your cart is right where you left it",
        `${itemCount} ${itemCount === 1 ? "item is" : "items are"} saved on this browser.`,
        {
          toastId: "cart-reminder",
          type: "info",
          autoClose: 9000,
          href: "/shop/cart",
          action: "Review your cart",
        },
      );
    }, 10000);
    return () => clearTimeout(timer);
  }, [hydrated, itemCount, pathname]);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          setPrefill("");
          setOpen((value) => !value);
          toast.dismiss("cart-reminder");
        }}
        aria-expanded={open}
        aria-controls="newjersey-support-panel"
        aria-label={
          open ? "Close NewJersey support" : "Message NewJersey support"
        }
        className="fixed bottom-5 right-3 z-[115] flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-[#FF6B00] text-[#181818] shadow-[0_5px_20px_rgba(24,24,24,.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4 sm:bottom-auto sm:right-3 sm:top-1/2 sm:-translate-y-1/2"
      >
        <MessageCircle size={21} strokeWidth={1.6} aria-hidden="true" />
        {unread && !open && (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#181818]">
            <span className="sr-only">Unread support reply</span>
          </span>
        )}
      </button>
      {open && (
        <div
          ref={panel}
          id="newjersey-support-panel"
          role="dialog"
          aria-label="NewJersey support"
          className="fixed bottom-[80px] right-3 z-[130] flex h-[min(580px,75dvh)] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(24,24,24,.16)] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-black/10 bg-[#FCFBF8] px-5 py-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[.17em] text-[#B94700]">
                A little help, from NewJersey
              </p>
              <h2
                ref={heading}
                tabIndex={-1}
                className="mt-2 text-base font-semibold outline-none"
              >
                Let’s sort it out.
              </h2>
              <p className="mt-1 text-[10px] leading-5 text-[#746E65]">
                Leave a message. Our team replies here when available.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close support conversation"
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
          <SupportConversation
            key={identity ?? "guest"}
            scope="customer"
            initialDraft={prefill}
            onUpdate={() => setUnread(false)}
          />
        </div>
      )}
      {browsePaths.has(pathname) && scroll.long && !open && (
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: scroll.up ? 0 : document.documentElement.scrollHeight,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            })
          }
          aria-label={scroll.up ? "Back to top" : "Go to page end"}
          title={scroll.up ? "Back to top" : "Explore below"}
          className="fixed bottom-[84px] right-3 z-[90] flex h-10 w-12 items-center justify-center rounded-xl border border-black/10 bg-white/95 text-[#625D55] shadow-sm backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] sm:bottom-6"
        >
          {scroll.up ? (
            <ArrowUp size={17} aria-hidden="true" />
          ) : (
            <ArrowDown size={17} aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}

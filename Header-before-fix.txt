"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Phone,
  MessageCircle,
  ShoppingCart,
  UserRound,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useCart } from "@/app/contexts/cartContext";
import { useShopIdentity } from "@/app/components/newjersey/experience/useShopIdentity";
import { createClient } from "@/app/lib/newjersey/supabase/client";

const navigation = [
  { label: "All Products", href: "/products" },
  { label: "Apparel", href: "/apparel" },
  { label: "Hire a Designer", href: "/hire-a-designer" },
  { label: "Training", href: "/training" },
  { label: "About", href: "/about" },
];
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-inset";
const menuLink = `flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold hover:bg-[#F7F3EE] ${focus}`;
type Panel = "search" | "account" | "mobile" | null;

function HeaderIcon({
  src,
  size = 20,
  fallback: Fallback,
}: {
  src: string;
  size?: number;
  fallback: typeof Phone;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <Fallback size={size} aria-hidden="true" />
  ) : (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}

export default function Header() {
  const { itemCount, hydrated } = useCart();
  const identity = useShopIdentity();
  const pathname = usePathname();
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [authError, setAuthError] = useState("");
  const busy = useRef(false);
  const count = hydrated ? itemCount : 0;

  useEffect(() => {
    setPanel(null);
  }, [pathname, identity]);
  useEffect(() => {
    if (!panel) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setPanel(null);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPanel(null);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [panel]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const close = () => setPanel(null);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  function toggle(next: Panel, button: HTMLButtonElement) {
    trigger.current = button;
    setPanel((current) => (current === next ? null : next));
  }
  async function signOut() {
    if (busy.current) return;
    busy.current = true;
    setSigningOut(true);
    setAuthError("");
    try {
      const { error } = await createClient().auth.signOut({ scope: "local" });
      if (error) throw error;
      window.location.replace("/login");
    } catch {
      setAuthError("Unable to sign out. Please try again.");
      busy.current = false;
      setSigningOut(false);
    }
  }
  function accountLinks() {
    if (identity === undefined)
      return (
        <p role="status" className="px-4 py-3 text-sm">
          Checking your account…
        </p>
      );
    return identity ? (
      <>
        <Link
          href="/shop/account"
          onClick={() => setPanel(null)}
          className={menuLink}
        >
          My account
        </Link>
        <Link
          href="/shop/order"
          onClick={() => setPanel(null)}
          className={menuLink}
        >
          My orders
        </Link>
        <button
          type="button"
          disabled={signingOut}
          onClick={signOut}
          className={`${menuLink} w-full gap-2 text-left disabled:opacity-50`}
        >
          <LogOut size={16} aria-hidden="true" />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
        {authError && (
          <p role="alert" className="px-4 py-3 text-xs text-red-700">
            {authError}
          </p>
        )}
      </>
    ) : (
      <>
        <Link href="/login" onClick={() => setPanel(null)} className={menuLink}>
          Login
        </Link>
        <Link
          href="/register"
          onClick={() => setPanel(null)}
          className={menuLink}
        >
          Create an account
        </Link>
      </>
    );
  }
  function searchForm() {
    return (
      <form
        action="/shop/search"
        method="get"
        onSubmit={(event) => {
          const input = event.currentTarget.elements.namedItem(
            "q",
          ) as HTMLInputElement;
          input.value = input.value.trim();
          if (!input.value) {
            event.preventDefault();
            input.focus();
          } else setPanel(null);
        }}
      >
        <label
          htmlFor={`${id}-query`}
          className="text-[11px] font-bold uppercase tracking-[.16em] text-[#9A4000]"
        >
          Search products
        </label>
        <div className="mt-3 flex gap-2">
          <input
            id={`${id}-query`}
            name="q"
            type="search"
            required
            maxLength={120}
            autoFocus={panel === "search"}
            placeholder="Apparel, jerseys, cards…"
            className={`min-h-11 min-w-0 flex-1 rounded-xl border border-black/15 bg-white px-3 text-base ${focus}`}
          />
          <button
            type="submit"
            aria-label="Search"
            className={`flex min-h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00] ${focus}`}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <header
      ref={root}
      className="relative w-full min-w-0 border-b border-black/10 bg-[#EBEBD3] text-black"
      onBlur={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setPanel(null);
      }}
    >
      <div className="mx-auto flex h-[72px] w-full min-w-0 max-w-[1600px] items-center justify-between gap-1 pl-3 sm:pl-6 lg:pl-10">
        <Link
          href="/"
          aria-label="NewJersey.ng home"
          className={`shrink-0 rounded-sm text-[18px] font-black tracking-tight sm:text-[26px] ${focus}`}
        >
          New<span className="text-[#FF6B00]">Jersey</span>
          <span className="text-[12px] font-bold sm:text-[15px]">.ng</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 text-[14px] font-semibold text-black/75 xl:flex 2xl:gap-9 2xl:text-[15px]"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-[#FF6B00] ${focus}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex h-full shrink-0 items-center">
          {identity !== undefined && (
            <Link
              href={identity ? "/shop/account" : "/login"}
              className={`mr-3 hidden h-11 min-w-[120px] items-center justify-center rounded-full border-2 border-black px-6 text-sm font-semibold transition-colors hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white 2xl:flex ${focus}`}
            >
              {identity ? "My account" : "Login"}
            </Link>
          )}
          <button
            type="button"
            aria-label="Open product search"
            aria-expanded={panel === "search"}
            aria-controls={`${id}-search`}
            onClick={(e) => toggle("search", e.currentTarget)}
            className={`hidden h-11 w-11 items-center justify-center rounded-full hover:bg-white/40 xl:flex ${focus}`}
          >
            <HeaderIcon src="/images/search.png" fallback={Search} />
          </button>
          <a
            href="tel:+2348089570493"
            aria-label="Call NewJersey"
            className={`flex h-11 w-10 items-center justify-center rounded-full hover:bg-white/40 sm:w-11 ${focus}`}
          >
            <HeaderIcon src="/images/phone-call (1).png" fallback={Phone} />
          </a>
          <a
            href="https://wa.me/2348089570493"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp support (opens in a new tab)"
            className={`flex h-11 w-10 items-center justify-center rounded-full hover:bg-white/40 sm:w-11 ${focus}`}
          >
            <HeaderIcon
              src="/images/whatsapp.png"
              size={26}
              fallback={MessageCircle}
            />
          </a>
          <Link
            href="/shop/cart"
            aria-label={count ? `Cart with ${count} items` : "Cart"}
            className={`relative flex h-[72px] w-11 items-center justify-center bg-[#E7EFC5] transition-colors hover:bg-[#FF6B00] sm:ml-3 sm:w-[72px] ${focus}`}
          >
            <HeaderIcon
              src="/images/shopping-cart.png"
              size={22}
              fallback={ShoppingCart}
            />
            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1 top-3 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#FFDD00] px-1 text-[9px] font-black sm:right-3"
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Account options"
            aria-expanded={panel === "account"}
            aria-controls={`${id}-account`}
            onClick={(e) => toggle("account", e.currentTarget)}
            className={`hidden h-[72px] items-center gap-2 border-l border-black/10 px-5 hover:bg-white/40 xl:flex ${focus}`}
          >
            <HeaderIcon src="/images/user.png" size={22} fallback={UserRound} />
            <ChevronDown size={12} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={panel === "mobile" ? "Close menu" : "Open menu"}
            aria-expanded={panel === "mobile"}
            aria-controls={`${id}-mobile`}
            onClick={(e) => toggle("mobile", e.currentTarget)}
            className={`flex h-[72px] w-11 items-center justify-center border-l border-black/10 hover:bg-white/40 xl:hidden ${focus}`}
          >
            {panel === "mobile" ? (
              <X size={21} aria-hidden="true" />
            ) : (
              <Menu size={21} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {panel === "search" && (
        <div
          id={`${id}-search`}
          className="absolute right-4 top-full z-[120] mt-2 hidden w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-4 shadow-xl xl:block"
        >
          {searchForm()}
        </div>
      )}
      {panel === "account" && (
        <div
          id={`${id}-account`}
          className="absolute right-4 top-full z-[120] mt-2 hidden w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-2 shadow-xl xl:block"
        >
          {accountLinks()}
        </div>
      )}
      {panel === "mobile" && (
        <div
          id={`${id}-mobile`}
          className="absolute right-3 top-full z-[120] mt-2 max-h-[70dvh] w-80 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-black/10 bg-white p-3 shadow-xl xl:hidden"
        >
          <div className="p-2">{searchForm()}</div>
          <div className="mt-3 border-t border-black/10 pt-2">
            {accountLinks()}
          </div>
        </div>
      )}
    </header>
  );
}

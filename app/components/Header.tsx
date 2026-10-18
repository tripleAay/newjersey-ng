"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import {
  Search,
  Phone,
  MessageCircle,
  ShoppingCart,
  UserRound,
  X,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/app/contexts/cartContext";
import { useShopIdentity } from "@/app/components/newjersey/experience/useShopIdentity";
const links = [
  { label: "All products", href: "/shop" },
  { label: "Apparel", href: "/shop/apparel" },
  { label: "Hire a designer", href: "/hire-a-designer" },
  { label: "Training", href: "/training" },
  { label: "About", href: "/about" },
];
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2";
export default function Header() {
  const { itemCount, hydrated } = useCart();
  const identity = useShopIdentity();
  const [whatsAppFailed, setWhatsAppFailed] = useState(false);
  const [panel, setPanel] = useState<"search" | "account" | "menu" | null>(
    null,
  );
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  useEffect(() => {
    if (!panel) return;
    function outside(e: PointerEvent) {
      if (e.target instanceof Node && !root.current?.contains(e.target))
        setPanel(null);
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
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
  function toggle(name: typeof panel, button: HTMLButtonElement) {
    trigger.current = button;
    setPanel((current) => (current === name ? null : name));
  }
  const iconClass = ` h-10 w-9 shrink-0 sm:w-10 items-center justify-center rounded-full hover:bg-black/5 ${focus}`;
  return (
    <header
      ref={root}
      className="relative w-full border-b border-black/10 bg-[#EBEBD3] text-[#181818]"
    >
      <div className="flex h-[72px] items-center justify-between gap-2 pl-4 sm:pl-8 xl:pl-10">
        <Link
          href="/"
          aria-label="NewJersey.ng home"
          className={`shrink-0 rounded-sm text-[18px] sm:text-[26px] font-black tracking-tight ${focus}`}
        >
          New<span className="text-[#FF6B00]">Jersey</span>
          <span className="text-[15px] font-bold">.ng</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 2xl:gap-9 xl:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-h-11 items-center rounded-sm text-[15px] font-semibold text-black/75 hover:text-[#FF6B00] ${focus}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex h-full items-center gap-0 sm:gap-1">
          {identity !== undefined && (
            <Link
              href={identity ? "/shop/account" : "/login"}
              className={`mr-3 hidden h-11 min-w-[120px] items-center justify-center rounded-full border-2 border-black px-6 text-sm font-semibold transition-colors hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white 2xl:inline-flex ${focus}`}
            >
              {identity ? "My account" : "Login"}
            </Link>
          )}
          <button
            type="button"
            aria-label="Search products"
            aria-expanded={panel === "search"}
            aria-controls={`${id}-search`}
            onClick={(e) => toggle("search", e.currentTarget)}
            className={`inline-flex ${iconClass}`}
          >
            <Search size={19} />
          </button>
          <a
            href="tel:+2348089570493"
            aria-label="Call NewJersey"
            className={`hidden sm:inline-flex ${iconClass}`}
          >
            <Phone size={18} />
          </a>
          <a
            href="https://wa.me/2348089570493"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp support (opens in a new tab)"
            className={`hidden sm:inline-flex ${iconClass}`}
          >
            {whatsAppFailed ? (
              <MessageCircle size={20} aria-hidden="true" />
            ) : (
              <Image
                src="/images/whatsapp.png"
                alt=""
                width={26}
                height={26}
                onError={() => setWhatsAppFailed(true)}
              />
            )}
          </a>
          <Link
            href="/shop/cart"
            aria-label={`Cart${hydrated ? `, ${itemCount} items` : ""}`}
            className={`relative ml-0 flex h-[72px] w-10 shrink-0 items-center justify-center bg-[#E7EFC5] transition-colors hover:bg-[#FF6B00] sm:ml-4 sm:w-[72px] ${focus}`}
          >
            <ShoppingCart size={20} />
            {hydrated && itemCount > 0 && (
              <span className="absolute right-2 top-3 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#FFDD00] px-1 text-[10px] font-bold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Your account"
            aria-expanded={panel === "account"}
            aria-controls={`${id}-account`}
            onClick={(e) => toggle("account", e.currentTarget)}
            className={`flex h-[72px] items-center gap-1 border-l border-black/10 px-2 transition-colors hover:bg-white/40 sm:px-5 ${focus}`}
          >
            <UserRound size={22} />
            <ChevronDown
              size={12}
              aria-hidden="true"
              className="hidden sm:block"
            />
          </button>
          <button
            type="button"
            aria-label="Main menu"
            aria-expanded={panel === "menu"}
            aria-controls={`${id}-menu`}
            onClick={(e) => toggle("menu", e.currentTarget)}
            className={`inline-flex ${iconClass} xl:hidden`}
          >
            {panel === "menu" ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {panel === "search" && (
        <div
          id={`${id}-search`}
          className="absolute right-4 top-full z-[120] mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-4 shadow-xl"
        >
          <form
            action="/shop/search"
            method="get"
            onSubmit={() => setPanel(null)}
          >
            <label htmlFor={`${id}-q`} className="text-xs font-semibold">
              Find something for your next order
            </label>
            <input
              id={`${id}-q`}
              name="q"
              type="search"
              required
              maxLength={120}
              autoFocus
              placeholder="Printing, apparel, jerseys…"
              className={`mt-3 min-h-12 w-full rounded-xl border border-black/15 px-3 text-base ${focus}`}
            />
            <button
              className={`mt-3 min-h-11 w-full rounded-xl bg-[#FF6B00] text-sm font-semibold ${focus}`}
            >
              Search products
            </button>
          </form>
        </div>
      )}
      {panel === "account" && (
        <div
          id={`${id}-account`}
          className="absolute right-4 top-full z-[120] mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-4 shadow-xl"
        >
          {identity === undefined ? (
            <p role="status" className="text-sm">
              Loading account…
            </p>
          ) : identity ? (
            <>
              <p className="mb-2 text-sm font-semibold">Your NewJersey</p>
              {[
                { label: "Your account", href: "/shop/account" },
                { label: "Your orders", href: "/shop/order" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setPanel(null)}
                  className={`flex min-h-11 items-center rounded-lg px-2 text-sm hover:bg-[#F0EFEB] ${focus}`}
                >
                  {link.label}
                </Link>
              ))}
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">Make yourself at home.</p>
              <p className="mt-2 text-xs leading-6 text-[#625D55]">
                Browse and build your cart first. Sign in when you’re ready to
                order.
              </p>
              <Link
                href="/register?next=%2Fshop%2Fcart"
                onClick={() => setPanel(null)}
                className={`mt-3 flex min-h-11 items-center justify-center rounded-xl bg-[#FF6B00] text-sm font-semibold ${focus}`}
              >
                Create account
              </Link>
              <Link
                href="/login?next=%2Fshop%2Fcart"
                onClick={() => setPanel(null)}
                className={`mt-2 flex min-h-11 items-center justify-center rounded-xl text-sm underline ${focus}`}
              >
                Already registered? Sign in
              </Link>
            </>
          )}
        </div>
      )}
      {panel === "menu" && (
        <nav
          id={`${id}-menu`}
          aria-label="Mobile main navigation"
          className="border-t border-black/10 px-4 py-3 xl:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setPanel(null)}
              className={`flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold ${focus}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { useCart } from "@/app/contexts/cartContext";
import { createClient } from "@/app/lib/newjersey/supabase/client";

type Panel = "account" | "help";

const customerLinks = [
  { label: "My account", href: "/shop/account" },
  { label: "My orders", href: "/shop/order" },
  { label: "Wishlist", href: "/shop/wish-list" },
];

const guestLinks = [
  { label: "Sign in", href: "/login" },
  { label: "Create an account", href: "/register" },
];

const helpLinks = [
  { label: "How to order", href: "/shop/help/place-order" },
  { label: "Track an order", href: "/shop/help/track-order" },
  { label: "Cancellation help", href: "/shop/help/cancel-order" },
  { label: "Returns & refunds", href: "/shop/help/returns-refunds" },
];

function getDisplayName(user: User | null) {
  if (!user) return "";

  const name = user.user_metadata?.full_name;

  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  return user.email?.split("@")[0] || "Customer";
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();
}

export default function MainHeader() {
  const { itemCount, hydrated } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [openPanel, setOpenPanel] = useState<Panel | null>(null);

  const controlsRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const signOutBusyRef = useRef(false);

  const pathname = usePathname();
  const panelId = useId();

  const name = getDisplayName(user);
  const firstName = name.split(/\s+/)[0];
  const initials = getInitials(name);

  const count = hydrated ? itemCount : 0;
  const cartLabel =
    count > 0
      ? `Cart with ${count} ${count === 1 ? "item" : "items"}`
      : "Cart";

  useEffect(() => {
    let mounted = true;
    let authVersion = 0;

    const supabase = createClient();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        authVersion += 1;

        if (!mounted) return;

        setUser(session?.user ?? null);
        setAuthReady(true);
        setAuthError("");
      });

    const versionAtRequest = authVersion;

    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        // Don't overwrite a more recent sign-in or sign-out event.
        if (!mounted || authVersion !== versionAtRequest) return;

        if (error) {
          setUser(null);

          if (error.name !== "AuthSessionMissingError") {
            setAuthError("Unable to check your account. Please reload.");
          }
        } else {
          setUser(data.user);
        }

        setAuthReady(true);
      } catch {
        if (!mounted || authVersion !== versionAtRequest) return;

        setAuthReady(true);
        setAuthError("Unable to check your account. Please reload.");
      }
    }

    void loadUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !controlsRef.current?.contains(event.target)
      ) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !openPanel) return;

      const button =
        openPanel === "account"
          ? accountButtonRef.current
          : helpButtonRef.current;

      setOpenPanel(null);
      button?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

  useEffect(() => {
    setOpenPanel(null);
  }, [pathname]);

  function togglePanel(panel: Panel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  async function handleSignOut() {
    if (signOutBusyRef.current) return;

    signOutBusyRef.current = true;
    setSigningOut(true);
    setAuthError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        throw error;
      }

      setUser(null);
      setOpenPanel(null);

      // Reload server-rendered content with the signed-out cookies.
      window.location.replace("/shop");
    } catch {
      setAuthError("Unable to sign out. Please try again.");
    } finally {
      signOutBusyRef.current = false;
      setSigningOut(false);
    }
  }

  return (
    <div className="border-b border-black/10 bg-[#FCFBF8] text-[#181818]">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-3 gap-y-4 px-5 py-4 sm:px-8 lg:gap-x-6 lg:px-12">
        <Link
          href="/shop"
          aria-label="NewJersey.ng shop home"
          className="shrink-0 text-xl font-bold tracking-[-0.06em] sm:text-2xl"
        >
          <span>newjersey</span>
          <span className="text-[#F58220]">.ng</span>
        </Link>

        <form
          action="/print"
          method="get"
          role="search"
          aria-label="Search print products"
          className="order-last flex w-full min-w-0 items-center rounded-full border border-black/15 bg-white lg:order-none lg:w-auto lg:flex-1"
        >
          <Search
            size={18}
            aria-hidden="true"
            className="ml-4 shrink-0 text-[#625D55]"
          />

          <input
            type="search"
            name="q"
            aria-label="Search print products"
            placeholder="Search print products"
            required
            maxLength={120}
            className="min-h-12 min-w-0 flex-1 rounded-full bg-transparent px-3 text-base placeholder:text-[#625D55]"
          />

          <button
            type="submit"
            className="mr-1 min-h-11 shrink-0 rounded-full bg-[#181818] px-4 text-sm font-semibold text-white hover:bg-[#363636]"
          >
            Search
          </button>
        </form>

        <div
          ref={controlsRef}
          className="relative ml-auto flex shrink-0 items-center gap-1"
          onBlur={(event) => {
            if (
              !event.relatedTarget ||
              !event.currentTarget.contains(event.relatedTarget as Node)
            ) {
              setOpenPanel(null);
            }
          }}
        >
          <button
            ref={accountButtonRef}
            type="button"
            aria-label={
              user ? `Account options for ${name}` : "Account options"
            }
            aria-expanded={openPanel === "account"}
            aria-controls={`${panelId}-account`}
            onClick={() => togglePanel("account")}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 hover:bg-black/5"
          >
            {authReady && user ? (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#181818] text-xs font-semibold text-white"
              >
                {initials}
              </span>
            ) : (
              <UserRound size={20} aria-hidden="true" />
            )}

            <span className="hidden max-w-24 truncate text-sm font-medium xl:inline">
              {authReady && user ? firstName : "Account"}
            </span>

            <ChevronDown
              size={14}
              aria-hidden="true"
              className="hidden xl:block"
            />
          </button>

          <button
            ref={helpButtonRef}
            type="button"
            aria-label="Help options"
            aria-expanded={openPanel === "help"}
            aria-controls={`${panelId}-help`}
            onClick={() => togglePanel("help")}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 hover:bg-black/5"
          >
            <CircleHelp size={20} aria-hidden="true" />

            <span className="hidden text-sm font-medium xl:inline">
              Help
            </span>

            <ChevronDown
              size={14}
              aria-hidden="true"
              className="hidden xl:block"
            />
          </button>

          <Link
            href="/shop/cart"
            aria-label={cartLabel}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 hover:bg-black/5"
          >
            <span className="relative">
              <ShoppingCart size={21} aria-hidden="true" />

              {count > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 rounded-full bg-[#181818] px-1.5 text-[10px] font-semibold leading-4 text-white"
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </span>

            <span className="hidden text-sm font-medium xl:inline">
              Cart
            </span>
          </Link>

          <div
            id={`${panelId}-account`}
            hidden={openPanel !== "account"}
            className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2.5rem)] rounded-xl border border-black/10 bg-white p-2 shadow-lg"
          >
            {!authReady ? (
              <p role="status" className="px-3 py-4 text-sm text-[#625D55]">
                Checking your account…
              </p>
            ) : (
              <>
                <div className="mb-2 border-b border-black/10 px-3 py-3">
                  <p className="break-words text-sm font-semibold">
                    {user ? name : "Welcome to NewJersey"}
                  </p>

                  <p className="mt-1 break-words text-xs leading-5 text-[#625D55]">
                    {user
                      ? user.email
                      : "Sign in or create your account."}
                  </p>
                </div>

                {(user ? customerLinks : guestLinks).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenPanel(null)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-[#F4F1E9]"
                  >
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="mt-2 flex min-h-11 w-full items-center rounded-lg border-t border-black/10 px-3 text-left text-sm font-medium hover:bg-[#F4F1E9] disabled:cursor-wait disabled:opacity-60"
                  >
                    {signingOut ? "Signing out…" : "Sign out"}
                  </button>
                )}

                {authError && (
                  <p
                    role="alert"
                    className="px-3 py-3 text-xs leading-5 text-red-700"
                  >
                    {authError}
                  </p>
                )}
              </>
            )}
          </div>

          <div
            id={`${panelId}-help`}
            hidden={openPanel !== "help"}
            className="absolute right-0 top-full z-50 mt-2 w-60 max-w-[calc(100vw-2.5rem)] rounded-xl border border-black/10 bg-white p-2 shadow-lg"
          >
            <p className="px-3 py-2 text-xs font-semibold text-[#625D55]">
              Order support
            </p>

            {helpLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenPanel(null)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-[#F4F1E9]"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://wa.me/2348089570493"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpenPanel(null)}
              className="mt-2 flex min-h-11 items-center justify-between rounded-lg border-t border-black/10 px-3 text-sm font-semibold hover:bg-[#F4F1E9]"
            >
              WhatsApp support
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> — opens in a new tab</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
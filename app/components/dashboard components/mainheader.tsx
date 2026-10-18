"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  LogOut,
  Mail,
  MapPin,
  Search,
  Settings,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { useCart } from "@/app/contexts/cartContext";
import { createClient } from "@/app/lib/newjersey/supabase/client";
import { helpTopics } from "@/app/lib/newjersey/help/navigation";
import CustomerNotifications from "@/app/components/newjersey/CustomerNotifications";

type Panel = "account" | "help" | "notifications";

const customerLinks = [
  {
    label: "My orders",
    href: "/shop/order",
    icon: ClipboardList,
  },
  {
    label: "Account settings",
    href: "/shop/account",
    icon: Settings,
  },
  {
    label: "Delivery address",
    href: "/shop/account/address",
    icon: MapPin,
  },
];

const guestLinks = [
  { label: "Sign in", href: "/login" },
  { label: "Create an account", href: "/register" },
];

const controlClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 transition-colors hover:bg-[#FF6B00]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]";

const linkClass =
  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]";

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
    .map((part) => Array.from(part)[0] || "")
    .join("")
    .toUpperCase();
}

export default function MainHeader() {
  const { itemCount, hydrated } = useCart();

  const pathname = usePathname();
  const panelId = useId();

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [openPanel, setOpenPanel] = useState<Panel | null>(null);

  const controlsRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const signOutBusyRef = useRef(false);

  const name = getDisplayName(user);
  const firstName = name.split(/\s+/)[0];
  const initials = getInitials(name);

  const count = hydrated ? itemCount : 0;

  const cartLabel =
    count > 0 ? `Cart with ${count} ${count === 1 ? "item" : "items"}` : "Cart";

  useEffect(() => {
    let mounted = true;
    let authVersion = 0;

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authVersion += 1;

      if (!mounted) return;

      setUser(session?.user ?? null);
      setAuthReady(true);
      setAuthError("");
      setOpenPanel(null);
    });

    const versionAtRequest = authVersion;

    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!mounted || authVersion !== versionAtRequest) {
          return;
        }

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
        if (!mounted || authVersion !== versionAtRequest) {
          return;
        }

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
    if (!openPanel) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !controlsRef.current?.contains(event.target)
      ) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const focusInside = controlsRef.current?.contains(document.activeElement);

      const button =
        openPanel === "account"
          ? accountButtonRef.current
          : openPanel === "help"
            ? helpButtonRef.current
            : controlsRef.current?.querySelector<HTMLButtonElement>(
                "[data-notification-toggle]",
              );

      setOpenPanel(null);

      if (focusInside) {
        button?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setOpenPanel(null);
    });
    return () => {
      active = false;
    };
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

      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) throw error;

      setUser(null);
      setOpenPanel(null);
      window.location.replace("/login");
    } catch {
      setAuthError("Unable to sign out. Please try again.");
    } finally {
      signOutBusyRef.current = false;
      setSigningOut(false);
    }
  }

  return (
    <div className="border-b border-black/10 bg-[#FCFBF8] text-[#181818]">
      <div className="mx-auto flex max-w-[1344px] flex-wrap items-center gap-x-2 gap-y-2 px-4 py-2 sm:px-8 sm:py-2 lg:gap-x-5 lg:px-12">
        <Link
          href="/shop"
          aria-label="NewJersey.ng shop home"
          className="shrink-0 rounded-sm text-xl font-bold tracking-[-0.045em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] sm:text-xl"
        >
          newjersey
          <span className="text-[#FF6B00]">.ng</span>
        </Link>

        <form
          action="/shop/search"
          method="get"
          role="search"
          aria-label="Search NewJersey products and services"
          onSubmit={(event) => {
            const input = searchInputRef.current;

            if (!input) return;

            const query = input.value.trim();

            if (!query) {
              event.preventDefault();
              input.value = "";
              input.focus();
              return;
            }

            input.value = query;
            setOpenPanel(null);
          }}
          className="order-last flex w-full min-w-0 items-center rounded-xl border border-[#FF6B00]/15 bg-white transition-shadow focus-within:border-[#FF6B00] focus-within:ring-1 focus-within:ring-[#FF6B00] lg:order-none lg:w-auto lg:flex-1"
        >
          <Search
            size={18}
            aria-hidden="true"
            className="ml-4 shrink-0 text-[#625D55]"
          />

          <input
            ref={searchInputRef}
            type="search"
            name="q"
            aria-label="Search products and services"
            placeholder="Search printing, jerseys, apparel…"
            required
            maxLength={120}
            enterKeyHint="search"
            autoComplete="off"
            className="min-h-11 min-w-0 flex-1 rounded-xl bg-transparent px-3 text-base text-[#181818] placeholder:text-[#7A7368] focus:outline-none"
          />

          <button
            type="submit"
            className="mr-1 inline-flex min-h-9 min-w-11 shrink-0 items-center justify-center rounded-lg bg-[#FF6B00]/[.07] px-3 text-xs font-semibold text-[#FF6B00] transition-colors duration-500 hover:bg-[#FF6B00]/[.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
          >
            Search
          </button>
        </form>

        <div
          ref={controlsRef}
          className="relative ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1"
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;

            if (
              !(nextTarget instanceof Node) ||
              !event.currentTarget.contains(nextTarget)
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
            className={controlClass}
          >
            {authReady && user ? (
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF6B00]/10 text-xs font-semibold text-[#FF6B00]"
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
              className={[
                "hidden transition-transform xl:block",
                openPanel === "account" ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          {authReady && user && (
            <CustomerNotifications
              key={user.id}
              open={openPanel === "notifications"}
              onToggle={() => togglePanel("notifications")}
              onClose={() => setOpenPanel(null)}
            />
          )}

          <button
            ref={helpButtonRef}
            type="button"
            aria-label="Help options"
            aria-expanded={openPanel === "help"}
            aria-controls={`${panelId}-help`}
            onClick={() => togglePanel("help")}
            className={controlClass}
          >
            <CircleHelp size={20} aria-hidden="true" />

            <span className="hidden text-sm font-medium xl:inline">Help</span>

            <ChevronDown
              size={14}
              aria-hidden="true"
              className={[
                "hidden transition-transform xl:block",
                openPanel === "help" ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          <Link
            href="/shop/cart"
            aria-label={cartLabel}
            className={controlClass}
          >
            <span className="relative">
              <ShoppingCart size={21} aria-hidden="true" />

              {count > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6B00] px-1 text-[10px] font-semibold tabular-nums leading-4 text-[#181818]"
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </span>

            <span className="hidden text-sm font-medium xl:inline">Cart</span>
          </Link>

          <div
            id={`${panelId}-account`}
            hidden={openPanel !== "account"}
            className="absolute right-0 top-full z-50 mt-3 max-h-[65dvh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-black/10 bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
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
                    {user ? user.email : "Sign in to manage your orders."}
                  </p>
                </div>

                {user
                  ? customerLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpenPanel(null)}
                          className={linkClass}
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.7}
                            aria-hidden="true"
                            className="shrink-0 text-[#625D55]"
                          />
                          {link.label}
                        </Link>
                      );
                    })
                  : guestLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpenPanel(null)}
                        className={linkClass}
                      >
                        {link.label}
                      </Link>
                    ))}

                {user && (
                  <div className="mt-2 border-t border-black/10 pt-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className={`${linkClass} w-full text-left disabled:cursor-wait disabled:opacity-60`}
                    >
                      <LogOut
                        size={17}
                        strokeWidth={1.7}
                        aria-hidden="true"
                        className="shrink-0 text-[#625D55]"
                      />
                      {signingOut ? "Signing out…" : "Sign out"}
                    </button>
                  </div>
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
            className="absolute right-0 top-full z-50 mt-3 max-h-[65dvh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-black/10 bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
          >
            <div className="mb-2 border-b border-black/10 px-3 py-3">
              <p className="text-sm font-semibold">How can we help?</p>

              <p className="mt-1 text-xs leading-5 text-[#625D55]">
                Check your order or speak with us.
              </p>
            </div>

            <nav
              aria-label="Help topics"
              className="border-b border-black/10 pb-2 mb-2"
            >
              <Link
                href="/shop/help"
                onClick={() => setOpenPanel(null)}
                className={`${linkClass} font-semibold`}
              >
                Help centre
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="ml-auto"
                />
              </Link>
              {helpTopics
                .filter((topic) =>
                  ["place-order", "track-order", "payments"].includes(
                    topic.slug,
                  ),
                )
                .map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/shop/help/${topic.slug}`}
                    onClick={() => setOpenPanel(null)}
                    className={linkClass}
                  >
                    {topic.title}
                  </Link>
                ))}
            </nav>

            <Link
              href="/shop/order"
              onClick={() => setOpenPanel(null)}
              className={linkClass}
            >
              <ClipboardList
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
                className="shrink-0 text-[#625D55]"
              />
              View my orders
            </Link>

            <a
              href="mailto:hello@newjersey.ng"
              onClick={() => setOpenPanel(null)}
              className={linkClass}
            >
              <Mail
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
                className="shrink-0 text-[#625D55]"
              />
              Email support
            </a>

            <div className="mt-2 border-t border-black/10 pt-2">
              <a
                href="https://wa.me/2348089570493"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpenPanel(null)}
                className={`${linkClass} justify-between font-semibold`}
              >
                WhatsApp support
                <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only">Opens in a new tab</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

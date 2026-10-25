"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ClipboardList,
  PenTool,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "@/app/contexts/cartContext";
import { useShopIdentity } from "./useShopIdentity";

type ActivityOrder = {
  id: string;
  order_number: string;
  project_name: string | null;
  status: string;
  updated_at: string;
};

type Activity = {
  signedIn: boolean;
  orders: ActivityOrder[];
  designs: ActivityOrder[];
  enquiries: {
    id: string;
    product_name: string;
    status: string;
    updated_at: string;
  }[];
};

const human = (value: string) => value.split(/[-_]/).join(" ");

export default function ShopActivity() {
  const { itemCount, hydrated } = useCart();
  const identity = useShopIdentity();

  const section = useRef<HTMLElement>(null);

  const [near, setNear] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const element = section.current;

    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActivity(null);
    setError(false);

    if (!near || !identity) return;

    const controller = new AbortController();

    void fetch("/api/shop/activity", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load activity");

        const value = (await response.json()) as Activity;

        if (!controller.signal.aborted) {
          setActivity(value);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(true);
        }
      });

    return () => controller.abort();
  }, [near, identity, retry]);

  const hasCartItems = hydrated && itemCount > 0;

  return (
    <section
      ref={section}
      aria-labelledby="shop-activity"
      className="mb-3 mt-6 min-w-0 scroll-mt-40 border-t border-black/10 pt-4 sm:mt-10 sm:pt-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[.18em] text-[#8A8379] sm:text-[10px]">
            Your NewJersey
          </p>

          <h2
            id="shop-activity"
            className="mt-1 text-lg font-semibold leading-6 tracking-tight sm:text-2xl sm:leading-8"
          >
            Pick up where you left off.
          </h2>
        </div>

        <Link
          href={identity ? "/shop/account" : "/login?next=%2Fshop"}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] sm:gap-2 sm:text-xs"
        >
          {identity === undefined
            ? "Account"
            : identity
              ? "Account"
              : "Sign in"}
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-1 text-[11px] leading-5 text-[#746E65] sm:text-xs">
        Your cart, orders and design updates.
      </p>

      <div className="mt-3 grid min-w-0 gap-2 md:grid-cols-3 sm:mt-4 sm:gap-3">
        {/* Cart */}
        <div className="min-w-0 rounded-xl border border-black/10 bg-white px-3 py-2.5 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ShoppingBag
                size={16}
                aria-hidden="true"
                className="shrink-0 text-[#B94700]"
              />

              <h3 className="text-xs font-semibold sm:text-sm">
                Your cart
              </h3>

              {hydrated && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#F5F4F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#625D55]">
                  {itemCount}
                </span>
              )}
            </div>

            <Link
              href="/shop/cart"
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
            >
              {hasCartItems ? "Review" : "Open cart"}
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>

          <p className="text-[11px] leading-5 text-[#746E65]">
            {!hydrated
              ? "Checking your cart…"
              : hasCartItems
                ? `${itemCount} ${
                    itemCount === 1 ? "item" : "items"
                  } saved. Ready when you are.`
                : "Items you add stay saved on this browser."}
          </p>
        </div>

        {/* Orders and designs */}
        {(
          [
            {
              title: "Recent orders",
              icon: ClipboardList,
              items: activity?.orders ?? [],
              base: "/shop/order",
              empty: "No orders yet. Your updates will appear here.",
            },
            {
              title: "Design requests",
              icon: PenTool,
              items: activity?.designs ?? [],
              base: "/shop/design",
              empty: "Need a designer? Brief INK or FORM.",
            },
          ] as const
        ).map(({ title, icon: Icon, items, base, empty }) => (
          <div
            key={title}
            className="min-w-0 rounded-xl border border-black/10 bg-white px-3 py-2.5 sm:p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Icon
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-[#B94700]"
                />

                <h3 className="text-xs font-semibold sm:text-sm">
                  {title}
                </h3>
              </div>

              <Link
                href={
                  identity
                    ? base
                    : `/login?next=${encodeURIComponent(base)}`
                }
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
              >
                View all
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>

            <div aria-live="polite">
              {identity === undefined ? (
                <p className="text-[11px] leading-5 text-[#746E65]">
                  Checking your session…
                </p>
              ) : !identity || activity?.signedIn === false ? (
                <p className="text-[11px] leading-5 text-[#746E65]">
                  Sign in to see your updates.
                </p>
              ) : error ? (
                <div className="flex flex-wrap items-center justify-between gap-x-2">
                  <p className="text-[11px] leading-5 text-[#746E65]">
                    Updates could not be loaded.
                  </p>

                  <button
                    type="button"
                    onClick={() => setRetry((value) => value + 1)}
                    className="inline-flex min-h-11 items-center rounded-md px-1 text-[11px] font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                  >
                    Retry
                  </button>
                </div>
              ) : !activity ? (
                <p className="text-[11px] leading-5 text-[#746E65]">
                  Loading your updates…
                </p>
              ) : items.length ? (
                <ul className="divide-y divide-black/[0.06]">
                  {items.map((item) => (
                    <li key={item.id} className="min-w-0">
                      <Link
                        href={`${base}/${item.id}`}
                        className="flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-md py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                      >
                        <span className="min-w-0 flex-1 break-words text-xs font-medium leading-4 [overflow-wrap:anywhere]">
                          {item.project_name || item.order_number}
                        </span>

                        <span className="max-w-[45%] shrink-0 rounded-md bg-[#F5F4F0] px-2 py-1 text-right text-[10px] capitalize leading-4 text-[#625D55]">
                          {human(item.status)}
                        </span>

                        <ArrowUpRight
                          size={12}
                          aria-hidden="true"
                          className="shrink-0 text-[#8A8379]"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] leading-5 text-[#746E65]">
                  {empty}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Enquiries */}
      {identity && activity?.enquiries?.length ? (
        <div className="mt-2 min-w-0 rounded-xl border border-black/10 bg-white px-3 py-2.5 sm:mt-3 sm:p-4">
          <h3 className="text-xs font-semibold">Recent enquiries</h3>

          <div className="mt-1 grid min-w-0 gap-x-5 md:grid-cols-3">
            {activity.enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex min-w-0 items-center justify-between gap-3 border-t border-black/[0.05] py-1.5"
              >
                <div className="min-w-0">
                  <p className="break-words text-xs font-medium leading-4 [overflow-wrap:anywhere]">
                    {enquiry.product_name}
                  </p>

                  <p className="mt-0.5 text-[10px] capitalize leading-4 text-[#746E65]">
                    {human(enquiry.status)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("newjersey-open-support", {
                        detail: {
                          message: `Hello, please update me on my ${enquiry.product_name} enquiry. Reference: ${enquiry.id}`,
                        },
                      })
                    )
                  }
                  className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                >
                  Ask us
                  <ArrowUpRight size={12} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
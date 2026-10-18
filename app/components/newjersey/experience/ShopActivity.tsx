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
    if (!section.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(section.current);
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
        if (!response.ok) throw new Error();
        const value = (await response.json()) as Activity;
        if (!controller.signal.aborted) setActivity(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [near, identity, retry]);
  return (
    <section
      ref={section}
      aria-labelledby="shop-activity"
      className="mb-3 mt-10 scroll-mt-40 border-t border-black/10 pt-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#8A8379]">
            Your NewJersey
          </p>
          <h2
            id="shop-activity"
            className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Pick up where you left off.
          </h2>
          <p className="mt-2 text-xs leading-6 text-[#746E65]">
            Your cart, recent orders and design requests. All in easy reach.
          </p>
        </div>
        <Link
          href={identity ? "/shop/account" : "/login?next=%2Fshop"}
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold"
        >
          {identity ? "Your account" : "Sign in to see your orders"}
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <ShoppingBag
            size={18}
            aria-hidden="true"
            className="text-[#B94700]"
          />
          <h3 className="mt-4 text-sm font-semibold">Your cart</h3>
          <p className="mt-2 text-xs leading-6 text-[#746E65]">
            {hydrated && itemCount > 0
              ? `${itemCount} ${itemCount === 1 ? "item" : "items"} saved on this browser. Review before checkout.`
              : "Found something you like? Your cart will keep it here on this browser."}
          </p>
          <Link
            href="/shop/cart"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold"
          >
            {hydrated && itemCount > 0 ? "Review your cart" : "Open cart"}
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
        {(
          [
            {
              title: "Recent orders",
              icon: ClipboardList,
              items: activity?.orders ?? [],
              base: "/shop/order",
              empty: "Your orders will appear here after you place one.",
            },
            {
              title: "Design requests",
              icon: PenTool,
              items: activity?.designs ?? [],
              base: "/shop/design",
              empty: "Brief INK or FORM when your idea needs a designer.",
            },
          ] as const
        ).map(({ title, icon: Icon, items, base, empty }) => (
          <div
            key={title}
            className="rounded-xl border border-black/10 bg-white p-5"
          >
            <Icon size={18} aria-hidden="true" className="text-[#B94700]" />
            <h3 className="mt-4 text-sm font-semibold">{title}</h3>
            {identity === undefined ? (
              <p className="mt-2 text-xs leading-6 text-[#746E65]">
                Checking your session…
              </p>
            ) : !identity ? (
              <p className="mt-2 text-xs leading-6 text-[#746E65]">
                Sign in to view your own updates.
              </p>
            ) : error ? (
              <p className="mt-2 text-xs leading-6 text-[#746E65]">
                Updates could not be loaded.{" "}
                <button
                  type="button"
                  onClick={() => setRetry((value) => value + 1)}
                  className="underline underline-offset-4"
                >
                  Retry
                </button>
              </p>
            ) : !activity ? (
              <p className="mt-2 text-xs leading-6 text-[#746E65]">
                Loading your updates…
              </p>
            ) : items.length ? (
              <ul className="mt-2 divide-y divide-black/5">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`${base}/${item.id}`}
                      className="block rounded py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                    >
                      <span className="block truncate text-xs font-medium">
                        {item.project_name || item.order_number}
                      </span>
                      <span className="mt-1 block text-[10px] capitalize text-[#746E65]">
                        {human(item.status)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs leading-6 text-[#746E65]">{empty}</p>
            )}
            <Link
              href={identity ? base : `/login?next=${encodeURIComponent(base)}`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold"
            >
              View all
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>
      {identity && activity?.enquiries?.length ? (
        <div className="mt-4 rounded-xl border border-black/10 bg-white px-5 py-4">
          <h3 className="text-xs font-semibold">Recent enquiries</h3>
          <div className="mt-2 grid gap-x-6 md:grid-cols-3">
            {activity.enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex min-w-0 items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">
                    {enquiry.product_name}
                  </p>
                  <p className="mt-1 text-[10px] capitalize text-[#746E65]">
                    {enquiry.status}
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
                      }),
                    )
                  }
                  className="min-h-10 shrink-0 text-[10px] font-semibold underline underline-offset-4"
                >
                  Ask us
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

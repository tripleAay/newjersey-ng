import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Package,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

const PAGE_SIZE = 12;

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Lagos",
});

function parseAmount(value: unknown): number | null {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && !value.trim())
  ) {
    return null;
  }

  const amount = Number(value);

  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function formatAmount(value: number | null) {
  return value === null ? "Unavailable" : currency.format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

function statusDetails(status: string) {
  switch (status) {
    case "submitted":
      return {
        label: "Received",
        className: "bg-[#F1F1EE] text-[#625D55]",
      };

    case "under-review":
      return {
        label: "Under review",
        className: "bg-[#F1F1EE] text-[#625D55]",
      };

    case "awaiting-artwork":
      return {
        label: "Artwork needed",
        className: "bg-[#F8F0E5] text-[#805323]",
      };

    case "awaiting-payment":
      return {
        label: "Awaiting payment",
        className: "bg-[#F8F0E5] text-[#805323]",
      };

    case "confirmed":
      return {
        label: "Confirmed",
        className: "bg-[#EDF3ED] text-[#426247]",
      };

    case "in-production":
      return {
        label: "In production",
        className: "bg-[#EDF1F5] text-[#435C73]",
      };

    case "ready":
      return {
        label: "Ready",
        className: "bg-[#EDF3ED] text-[#426247]",
      };

    case "dispatched":
      return {
        label: "Dispatched",
        className: "bg-[#EDF1F5] text-[#435C73]",
      };

    case "completed":
      return {
        label: "Completed",
        className: "bg-[#EDF3ED] text-[#426247]",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        className: "bg-[#F7ECEB] text-[#8A4B45]",
      };

    default:
      return {
        label: status.replaceAll("-", " "),
        className: "bg-[#F1F1EE] text-[#625D55]",
      };
  }
}

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;

  const rawPage = typeof params.page === "string" ? params.page : "1";
  const parsedPage = Number(rawPage);

  const page =
    Number.isSafeInteger(parsedPage) &&
    parsedPage >= 1 &&
    parsedPage <= 100000
      ? parsedPage
      : 1;

  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=/shop/order");
  }

  const supabase = getSupabaseAdmin();
  const from = (page - 1) * PAGE_SIZE;

  const { data, error, count } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        project_name,
        item_count,
        subtotal,
        design_fee,
        final_total,
        status,
        created_at
      `,
      { count: "exact" }
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error("[Customer orders]", error);
    throw new Error("Unable to load your orders.");
  }

  const orders = data ?? [];
  const totalOrders = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalOrders / PAGE_SIZE));

  if (page > totalPages) {
    redirect(`/shop/order?page=${totalPages}`);
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-3.5 pb-10 pt-3 sm:px-8 sm:pb-24 sm:pt-8">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to shop
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-3 pb-5 pt-3 sm:gap-5 sm:pb-10 sm:pt-10">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#7A7368] sm:text-xs">
              Your account
            </p>

            <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.05em] sm:mt-3 sm:text-5xl">
              My orders.
            </h1>

            <p className="mt-2 max-w-lg text-xs leading-5 text-[#625D55] sm:mt-4 sm:text-sm sm:leading-7">
              Track your orders, review artwork feedback, and check
              confirmed prices.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-4 text-[11px] font-semibold transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] sm:px-5 sm:text-xs"
          >
            Continue shopping
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <section aria-labelledby="orders-heading">
          <div className="flex items-center justify-between gap-4 border-t border-black/10 py-3 sm:py-5">
            <h2
              id="orders-heading"
              className="text-xs font-semibold sm:text-sm"
            >
              Order history
            </h2>

            <p className="text-[11px] text-[#7A7368] sm:text-xs">
              {totalOrders} {totalOrders === 1 ? "order" : "orders"}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-10 text-center sm:rounded-[24px] sm:px-6 sm:py-20">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F4F0] sm:h-14 sm:w-14">
                <Package
                  size={22}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-[#625D55]"
                />
              </div>

              <h3 className="mt-4 text-xl font-semibold tracking-tight sm:mt-6 sm:text-2xl">
                Your first order starts here.
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#625D55] sm:mt-3 sm:text-sm sm:leading-7">
                Once you place an order, its details and updates will
                appear here.
              </p>

              <Link
                href="/shop"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#181818] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4 sm:mt-7 sm:min-h-12 sm:px-6 sm:text-sm"
              >
                Explore the shop
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,1fr)_140px_170px_130px] gap-5 px-6 pb-4 pt-2 text-xs text-[#7A7368] lg:grid">
                <p>Order</p>
                <p>Status</p>
                <p className="text-right">Total</p>
                <p className="text-right">Details</p>
              </div>

              <div className="space-y-2 lg:space-y-0 lg:overflow-hidden lg:rounded-[20px] lg:border lg:border-black/10 lg:bg-white">
                {orders.map((order) => {
                  const status = statusDetails(order.status);

                  const confirmed =
                    order.final_total !== null &&
                    order.final_total !== undefined;

                  const production = parseAmount(order.subtotal);
                  const design = parseAmount(order.design_fee);

                  const estimate =
                    production !== null && design !== null
                      ? Math.round((production + design) * 100) / 100
                      : null;

                  const total = confirmed
                    ? parseAmount(order.final_total)
                    : estimate;

                  const orderHref = `/shop/order/${order.id}`;

                  return (
                    <article
                      key={order.id}
                      className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-3 gap-y-2.5 rounded-xl border border-black/10 bg-white p-3.5 sm:p-5 lg:grid-cols-[minmax(0,1fr)_140px_170px_130px] lg:items-center lg:gap-5 lg:rounded-none lg:border-0 lg:border-b lg:p-6 lg:last:border-b-0"
                    >
                      <div className="col-span-2 min-w-0 lg:col-span-1">
                        <p className="break-all text-[10px] font-medium leading-4 text-[#7A7368] sm:text-[11px]">
                          {order.order_number}
                        </p>

                        <h3 className="mt-1 break-words text-sm font-semibold leading-5 tracking-tight sm:text-base">
                          <Link
                            href={orderHref}
                            className="rounded-sm transition-colors hover:text-[#625D55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                          >
                            {order.project_name || "Your order"}
                          </Link>
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] leading-5 text-[#7A7368]">
                          <time dateTime={order.created_at}>
                            {formatDate(order.created_at)}
                          </time>

                          <span
                            aria-hidden="true"
                            className="text-black/25"
                          >
                            ·
                          </span>

                          <span>
                            {order.item_count}{" "}
                            {order.item_count === 1
                              ? "configured job"
                              : "configured jobs"}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0 self-center">
                        <span
                          className={`inline-flex max-w-full rounded-full px-2.5 py-1 text-[11px] font-medium capitalize leading-4 ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="min-w-0 text-right">
                        <p className="break-words text-sm font-semibold leading-5 tracking-tight [overflow-wrap:anywhere] sm:text-base">
                          {formatAmount(total)}
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-[#7A7368] sm:text-[11px]">
                          {confirmed
                            ? "Confirmed total"
                            : "Before delivery"}
                        </p>
                      </div>

                      <div className="col-span-2 border-t border-black/[0.07] lg:col-span-1 lg:border-0">
                        <Link
                          href={orderHref}
                          aria-label={`View order ${order.order_number}`}
                          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md text-[11px] font-semibold transition-colors hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] lg:justify-center lg:rounded-full lg:border lg:border-black/15 lg:px-4 lg:text-xs"
                        >
                          View order
                          <ArrowUpRight
                            size={14}
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              <nav
                aria-label="Order history pages"
                className="mt-5 flex flex-wrap items-center justify-between gap-3 sm:mt-7"
              >
                <p className="text-[11px] text-[#7A7368] sm:text-xs">
                  Showing {from + 1}–
                  {Math.min(from + orders.length, totalOrders)} of{" "}
                  {totalOrders}
                </p>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {page > 1 ? (
                      <Link
                        href={`/shop/order?page=${page - 1}`}
                        aria-label="Previous page of orders"
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-black/15 px-3 text-[11px] font-semibold hover:bg-black/[0.03] sm:px-4 sm:text-xs"
                      >
                        <ArrowLeft size={13} aria-hidden="true" />
                        Previous
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 px-3 text-[11px] text-[#9B958C] sm:px-4 sm:text-xs"
                      >
                        <ArrowLeft size={13} aria-hidden="true" />
                        Previous
                      </span>
                    )}

                    <span
                      aria-label={`Page ${page} of ${totalPages}`}
                      className="text-[11px] text-[#625D55] sm:text-xs"
                    >
                      {page} / {totalPages}
                    </span>

                    {page < totalPages ? (
                      <Link
                        href={`/shop/order?page=${page + 1}`}
                        aria-label="Next page of orders"
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-black/15 px-3 text-[11px] font-semibold hover:bg-black/[0.03] sm:px-4 sm:text-xs"
                      >
                        Next
                        <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 px-3 text-[11px] text-[#9B958C] sm:px-4 sm:text-xs"
                      >
                        Next
                        <ArrowRight size={13} aria-hidden="true" />
                      </span>
                    )}
                  </div>
                )}
              </nav>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
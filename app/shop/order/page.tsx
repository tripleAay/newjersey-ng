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
    (typeof value !== "number" &&
      typeof value !== "string") ||
    (typeof value === "string" && !value.trim())
  ) {
    return null;
  }

  const amount = Number(value);

  return Number.isFinite(amount) && amount >= 0
    ? amount
    : null;
}

function formatAmount(value: number | null) {
  return value === null
    ? "Unavailable"
    : currency.format(value);
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

export default async function OrdersPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const rawPage =
    typeof params.page === "string" ? params.page : "1";

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

  const {
    data,
    error,
    count,
  } = await supabase
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
  const totalPages = Math.max(
    1,
    Math.ceil(totalOrders / PAGE_SIZE)
  );

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

      <main className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-8">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to shop
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-5 pb-8 pt-7 sm:pb-10 sm:pt-10">
          <div>
            <p className="text-xs font-medium text-[#7A7368]">
              Your account
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              My orders.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#625D55]">
              Track your orders, review artwork feedback,
              and check confirmed prices.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-5 text-xs font-semibold transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
          >
            Continue shopping
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <section aria-labelledby="orders-heading">
          <div className="flex items-center justify-between gap-4 border-t border-black/10 py-5">
            <h2
              id="orders-heading"
              className="text-sm font-semibold"
            >
              Order history
            </h2>

            <p className="text-xs text-[#7A7368]">
              {totalOrders}{" "}
              {totalOrders === 1 ? "order" : "orders"}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-[24px] border border-black/10 bg-white px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F4F0]">
                <Package
                  size={24}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-[#625D55]"
                />
              </div>

              <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                Your first order starts here.
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#625D55]">
                Once you place an order, its details and
                updates will appear here.
              </p>

              <Link
                href="/shop"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4"
              >
                Explore the shop
                <ArrowRight size={16} aria-hidden="true" />
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

              <div className="space-y-3 lg:space-y-0 lg:overflow-hidden lg:rounded-[20px] lg:border lg:border-black/10 lg:bg-white">
                {orders.map((order) => {
                  const status = statusDetails(
                    order.status
                  );

                  const confirmed =
                    order.final_total !== null;

                  const production = parseAmount(
                    order.subtotal
                  );

                  const design = parseAmount(
                    order.design_fee
                  );

                  const estimate =
                    production !== null &&
                    design !== null
                      ? Math.round(
                          (production + design) * 100
                        ) / 100
                      : null;

                  const total = confirmed
                    ? parseAmount(order.final_total)
                    : estimate;

                  return (
                    <article
                      key={order.id}
                      className="rounded-[20px] border border-black/10 bg-white p-5 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_140px_170px_130px] lg:items-center lg:gap-5 lg:rounded-none lg:border-0 lg:border-b lg:last:border-b-0"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#7A7368]">
                          <p className="break-all font-medium">
                            {order.order_number}
                          </p>

                          <span
                            aria-hidden="true"
                            className="h-1 w-1 rounded-full bg-black/20"
                          />

                          <p>
                            {formatDate(order.created_at)}
                          </p>
                        </div>

                        <h3 className="mt-2 break-words text-base font-semibold tracking-tight">
                          <Link
                            href={`/shop/order/${order.id}`}
                            className="rounded-sm transition-colors hover:text-[#625D55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                          >
                            {order.project_name ||
                              "Your order"}
                          </Link>
                        </h3>

                        <p className="mt-2 text-xs text-[#7A7368]">
                          {order.item_count}{" "}
                          {order.item_count === 1
                            ? "configured job"
                            : "configured jobs"}
                        </p>
                      </div>

                      <div className="mt-4 lg:mt-0">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-medium capitalize ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-5 flex items-start justify-between gap-4 border-t border-black/[0.07] pt-4 lg:mt-0 lg:block lg:border-0 lg:pt-0 lg:text-right">
                        <p className="text-xs text-[#7A7368] lg:hidden">
                          {confirmed
                            ? "Confirmed total"
                            : "Before delivery"}
                        </p>

                        <div>
                          <p className="text-right text-base font-semibold tracking-tight">
                            {formatAmount(total)}
                          </p>

                          <p className="mt-1 hidden text-[11px] text-[#7A7368] lg:block">
                            {confirmed
                              ? "Confirmed total"
                              : "Before delivery"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex justify-end lg:mt-0">
                        <Link
                          href={`/shop/order/${order.id}`}
                          aria-label={`View order ${order.order_number}`}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/15 px-4 text-xs font-semibold transition-colors hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
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
                className="mt-7 flex flex-wrap items-center justify-between gap-4"
              >
                <p className="text-xs text-[#7A7368]">
                  Showing {from + 1}–
                  {Math.min(
                    from + orders.length,
                    totalOrders
                  )}{" "}
                  of {totalOrders}
                </p>

                {totalPages > 1 && (
                  <div className="flex items-center gap-3">
                    {page > 1 ? (
                      <Link
                        href={`/shop/order?page=${page - 1}`}
                        className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-4 text-xs font-semibold hover:bg-black/[0.03]"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center px-4 text-xs text-[#9B958C]">
                        Previous
                      </span>
                    )}

                    <span className="text-xs text-[#625D55]">
                      {page} / {totalPages}
                    </span>

                    {page < totalPages ? (
                      <Link
                        href={`/shop/order?page=${page + 1}`}
                        className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-4 text-xs font-semibold hover:bg-black/[0.03]"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center px-4 text-xs text-[#9B958C]">
                        Next
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
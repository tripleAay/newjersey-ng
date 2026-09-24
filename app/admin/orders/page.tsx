import Link from "next/link";

import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Clock3,
  FileImage,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { getSupabaseAdmin } from "@/app/lib/supabase/admin";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

type AdminOrdersPageProps = {
  searchParams: SearchParams;
};

type OrderRow = {
  id: string;
  order_number: string;

  customer_full_name: string;
  customer_email: string;
  customer_phone: string;

  project_name: string;

  item_count: number;

  subtotal: number | string;
  design_fee: number | string;
  delivery_fee: number | string;
  final_total: number | string | null;

  status: string;

  created_at: string;
  updated_at: string;
};

const ORDER_STATUSES = [
  {
    value: "all",
    label: "All Orders",
  },
  {
    value: "under-review",
    label: "Under Review",
  },
  {
    value: "awaiting-artwork",
    label: "Awaiting Artwork",
  },
  {
    value: "awaiting-payment",
    label: "Awaiting Payment",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "in-production",
    label: "In Production",
  },
  {
    value: "ready",
    label: "Ready",
  },
  {
    value: "dispatched",
    label: "Dispatched",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

function money(
  value:
    | number
    | string
    | null
    | undefined
) {
  const amount =
    Number(value ?? 0);

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(
    Number.isFinite(amount)
      ? amount
      : 0
  );
}

function formatDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
}

function statusLabel(
  status: string
) {
  return status
    .split("-")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function statusStyle(
  status: string
) {
  switch (status) {
    case "submitted":
      return "bg-slate-100 text-slate-700";

    case "under-review":
      return "bg-neutral-100 text-neutral-700";

    case "awaiting-artwork":
      return "bg-orange-50 text-orange-700";

    case "awaiting-payment":
      return "bg-amber-50 text-amber-700";

    case "confirmed":
      return "bg-cyan-50 text-cyan-700";

    case "in-production":
      return "bg-blue-50 text-blue-700";

    case "ready":
      return "bg-violet-50 text-violet-700";

    case "dispatched":
      return "bg-indigo-50 text-indigo-700";

    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-neutral-100 text-neutral-600";
  }
}

function buildFilterHref(
  status: string,
  query: string
) {
  const params =
    new URLSearchParams();

  if (
    status &&
    status !== "all"
  ) {
    params.set(
      "status",
      status
    );
  }

  if (query) {
    params.set(
      "q",
      query
    );
  }

  const string =
    params.toString();

  return string
    ? `/admin/orders?${string}`
    : "/admin/orders";
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params =
    await searchParams;

  const query =
    params.q
      ?.trim()
      .slice(0, 100) ??
    "";

  const selectedStatus =
    params.status?.trim() ||
    "all";

  const supabase =
    getSupabaseAdmin();

  /*
   * Main query
   */

  let ordersQuery =
    supabase
      .from("orders")
      .select(
        `
          id,
          order_number,
          customer_full_name,
          customer_email,
          customer_phone,
          project_name,
          item_count,
          subtotal,
          design_fee,
          delivery_fee,
          final_total,
          status,
          created_at,
          updated_at
        `
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (
    selectedStatus !==
    "all"
  ) {
    ordersQuery =
      ordersQuery.eq(
        "status",
        selectedStatus
      );
  }

  /*
   * Search several useful
   * customer/order fields.
   */

  if (query) {
    const escapedQuery =
      query
        .replaceAll(
          "%",
          "\\%"
        )
        .replaceAll(
          "_",
          "\\_"
        );

    ordersQuery =
      ordersQuery.or(
        [
          `order_number.ilike.%${escapedQuery}%`,
          `customer_full_name.ilike.%${escapedQuery}%`,
          `customer_email.ilike.%${escapedQuery}%`,
          `customer_phone.ilike.%${escapedQuery}%`,
          `project_name.ilike.%${escapedQuery}%`,
        ].join(",")
      );
  }

  const {
    data,
    error,
  } =
    await ordersQuery.limit(
      100
    );

  if (error) {
    console.error(
      "[NewJersey Admin] orders:",
      error
    );
  }

  const orders =
    (data ??
      []) as OrderRow[];

  /*
   * Dashboard counts
   */

  const [
    totalResult,
    reviewResult,
    paymentResult,
    productionResult,
    readyResult,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .in(
        "status",
        [
          "submitted",
          "under-review",
          "awaiting-artwork",
        ]
      ),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "awaiting-payment"
      ),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "in-production"
      ),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .in(
        "status",
        [
          "ready",
          "dispatched",
        ]
      ),
  ]);

  const stats = [
    {
      label:
        "Total Orders",
      value:
        totalResult.count ??
        0,
      icon: ShoppingBag,
    },
    {
      label:
        "Needs Review",
      value:
        reviewResult.count ??
        0,
      icon: Clock3,
    },
    {
      label:
        "Awaiting Payment",
      value:
        paymentResult.count ??
        0,
      icon:
        CircleDollarSign,
    },
    {
      label:
        "In Production",
      value:
        productionResult.count ??
        0,
      icon: Boxes,
    },
    {
      label:
        "Ready / Dispatch",
      value:
        readyResult.count ??
        0,
      icon: Truck,
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">
              Operations
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#222] sm:text-3xl">
              Orders
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#888]">
              Review incoming
              requests, artwork,
              pricing, production
              and fulfillment.
            </p>
          </div>

          <Link
            href="/shop"
            target="_blank"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-bold text-[#333] transition hover:border-[#FF6B00]/40 hover:text-[#FF6B00]"
          >
            Open storefront

            <ArrowRight
              size={14}
            />
          </Link>
        </div>

        {/* STATS */}

        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {stats.map(
            (stat) => {
              const Icon =
                stat.icon;

              return (
                <article
                  key={
                    stat.label
                  }
                  className="rounded-[20px] border border-black/[0.06] bg-white p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff2e9] text-[#FF6B00]">
                      <Icon
                        size={16}
                      />
                    </div>

                    <p className="text-2xl font-black tracking-tight">
                      {
                        stat.value
                      }
                    </p>
                  </div>

                  <p className="mt-4 text-[9px] font-black uppercase tracking-[0.12em] text-[#999]">
                    {
                      stat.label
                    }
                  </p>
                </article>
              );
            }
          )}
        </section>

        {/* SEARCH */}

        <section className="mt-6 rounded-[24px] border border-black/[0.06] bg-white p-4 sm:p-5">
          <form
            action="/admin/orders"
            method="GET"
            className="flex flex-col gap-3 sm:flex-row"
          >
            {selectedStatus !==
              "all" && (
              <input
                type="hidden"
                name="status"
                value={
                  selectedStatus
                }
              />
            )}

            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]"
              />

              <input
                type="search"
                name="q"
                defaultValue={
                  query
                }
                placeholder="Search order number, customer, phone, email or project..."
                className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#fafaf8] pl-11 pr-4 text-xs font-medium outline-none transition placeholder:text-[#aaa] focus:border-[#FF6B00]"
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-xl bg-[#222] px-6 text-xs font-black text-white transition hover:bg-[#FF6B00]"
            >
              Search
            </button>

            {(query ||
              selectedStatus !==
                "all") && (
              <Link
                href="/admin/orders"
                className="flex h-12 items-center justify-center rounded-xl border border-black/10 px-5 text-xs font-bold text-[#777] transition hover:text-[#222]"
              >
                Clear
              </Link>
            )}
          </form>

          {/* STATUS FILTERS */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ORDER_STATUSES.map(
              (status) => {
                const active =
                  selectedStatus ===
                  status.value;

                return (
                  <Link
                    key={
                      status.value
                    }
                    href={buildFilterHref(
                      status.value,
                      query
                    )}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-[9px] font-black transition ${
                      active
                        ? "bg-[#FF6B00] text-white"
                        : "bg-[#f5f5f2] text-[#777] hover:text-[#222]"
                    }`}
                  >
                    {
                      status.label
                    }
                  </Link>
                );
              }
            )}
          </div>
        </section>

        {/* ORDERS */}

        <section className="mt-5 overflow-hidden rounded-[26px] border border-black/[0.06] bg-white">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-black">
                {selectedStatus ===
                "all"
                  ? "All Orders"
                  : statusLabel(
                      selectedStatus
                    )}
              </h2>

              <p className="mt-1 text-[10px] text-[#999]">
                {
                  orders.length
                }{" "}
                {orders.length ===
                1
                  ? "order"
                  : "orders"}{" "}
                shown
              </p>
            </div>

            <PackageCheck
              size={18}
              className="text-[#FF6B00]"
            />
          </div>

          {error ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-bold text-red-600">
                Unable to load
                orders.
              </p>

              <p className="mt-2 text-xs text-[#999]">
                Check the server
                console for the
                Supabase error.
              </p>
            </div>
          ) : orders.length ===
            0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f2] text-[#aaa]">
                <ShoppingBag
                  size={21}
                />
              </div>

              <h3 className="mt-4 text-sm font-black">
                No matching
                orders
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-[#999]">
                There are no
                production
                requests matching
                the current search
                and status filter.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-black/[0.05] bg-[#fafaf8]">
                      <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.12em] text-[#999]">
                        Order
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.12em] text-[#999]">
                        Customer
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.12em] text-[#999]">
                        Project
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.12em] text-[#999]">
                        Value
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.12em] text-[#999]">
                        Status
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.12em] text-[#999]">
                        Date
                      </th>

                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-black/[0.05]">
                    {orders.map(
                      (
                        order
                      ) => (
                        <tr
                          key={
                            order.id
                          }
                          className="group transition hover:bg-[#fafaf8]"
                        >
                          <td className="px-6 py-5">
                            <p className="whitespace-nowrap text-xs font-black text-[#333]">
                              {
                                order.order_number
                              }
                            </p>

                            <p className="mt-1 text-[9px] text-[#aaa]">
                              {
                                order.item_count
                              }{" "}
                              {order.item_count ===
                              1
                                ? "item"
                                : "items"}
                            </p>
                          </td>

                          <td className="px-4 py-5">
                            <p className="max-w-[180px] truncate text-xs font-bold text-[#444]">
                              {
                                order.customer_full_name
                              }
                            </p>

                            <p className="mt-1 max-w-[180px] truncate text-[9px] text-[#aaa]">
                              {
                                order.customer_phone
                              }
                            </p>
                          </td>

                          <td className="px-4 py-5">
                            <p className="max-w-[210px] truncate text-xs font-medium text-[#555]">
                              {
                                order.project_name
                              }
                            </p>
                          </td>

                          <td className="px-4 py-5">
                            <p className="whitespace-nowrap text-xs font-black">
                              {money(
                                order.final_total ??
                                  order.subtotal
                              )}
                            </p>

                            {order.final_total ===
                              null && (
                              <p className="mt-1 text-[8px] font-bold uppercase tracking-wide text-[#aaa]">
                                Subtotal
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-5">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wide ${statusStyle(
                                order.status
                              )}`}
                            >
                              {statusLabel(
                                order.status
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-5">
                            <p className="whitespace-nowrap text-[10px] text-[#777]">
                              {formatDate(
                                order.created_at
                              )}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <Link
                              href={`/admin/orders/${encodeURIComponent(
                                order.order_number
                              )}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-[#888] transition group-hover:border-[#FF6B00]/30 group-hover:bg-[#FF6B00] group-hover:text-white"
                              aria-label={`Open ${order.order_number}`}
                            >
                              <ArrowRight
                                size={
                                  14
                                }
                              />
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-black/[0.05] md:hidden">
                {orders.map(
                  (
                    order
                  ) => (
                    <Link
                      key={
                        order.id
                      }
                      href={`/admin/orders/${encodeURIComponent(
                        order.order_number
                      )}`}
                      className="block p-5 transition active:bg-[#fafaf8]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-black">
                            {
                              order.order_number
                            }
                          </p>

                          <p className="mt-1 truncate text-[11px] font-medium text-[#777]">
                            {
                              order.project_name
                            }
                          </p>
                        </div>

                        <ArrowRight
                          size={
                            15
                          }
                          className="shrink-0 text-[#bbb]"
                        />
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-bold">
                            {
                              order.customer_full_name
                            }
                          </p>

                          <p className="mt-1 text-[9px] text-[#aaa]">
                            {formatDate(
                              order.created_at
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black">
                            {money(
                              order.final_total ??
                                order.subtotal
                            )}
                          </p>

                          <span
                            className={`mt-2 inline-flex rounded-full px-2 py-1 text-[7px] font-black uppercase tracking-wide ${statusStyle(
                              order.status
                            )}`}
                          >
                            {statusLabel(
                              order.status
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
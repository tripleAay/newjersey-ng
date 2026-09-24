import Link from "next/link";

import {
  ArrowRight,
  Boxes,
  Clock3,
  FileImage,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  getSupabaseAdmin,
} from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type OrderSummary = {
  id: string;
  order_number: string;
  customer_full_name: string;
  project_name: string;
  item_count: number;
  subtotal: number | string;
  final_total: number | string | null;
  status: string;
  created_at: string;
};

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
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
}

function statusLabel(
  status: string
) {
  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function statusStyle(
  status: string
) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "in-production":
      return "bg-blue-50 text-blue-700";

    case "ready":
      return "bg-violet-50 text-violet-700";

    case "dispatched":
      return "bg-indigo-50 text-indigo-700";

    case "awaiting-payment":
      return "bg-amber-50 text-amber-700";

    case "awaiting-artwork":
      return "bg-orange-50 text-orange-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-neutral-100 text-neutral-600";
  }
}

export default async function AdminPage() {
  const supabase =
    getSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        customer_full_name,
        project_name,
        item_count,
        subtotal,
        final_total,
        status,
        created_at
      `
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(8);

  if (error) {
    console.error(
      "[NewJersey Admin] dashboard orders:",
      error
    );
  }

  const orders =
    (data ??
      []) as OrderSummary[];

  const {
    count: totalOrders,
  } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    });

  const {
    count: productionOrders,
  } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "status",
      "in-production"
    );

  const {
    count: awaitingArtwork,
  } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "status",
      "awaiting-artwork"
    );

  const {
    count: readyOrders,
  } = await supabase
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
    );

  const stats = [
    {
      title: "Total Orders",
      value:
        totalOrders ?? 0,
      description:
        "Production requests",
      icon: ShoppingBag,
    },
    {
      title: "Awaiting Artwork",
      value:
        awaitingArtwork ?? 0,
      description:
        "Files still required",
      icon: FileImage,
    },
    {
      title: "In Production",
      value:
        productionOrders ?? 0,
      description:
        "Jobs being produced",
      icon: Boxes,
    },
    {
      title: "Ready / Delivery",
      value:
        readyOrders ?? 0,
      description:
        "Orders leaving production",
      icon: Truck,
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* PAGE HEADING */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              Operations Dashboard
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#222] sm:text-3xl">
              NewJersey Control Room
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">
              Orders, artwork,
              production and delivery
              from one workspace.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#e66000]"
          >
            View all orders

            <ArrowRight
              size={14}
            />
          </Link>
        </div>

        {/* STATS */}
        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(
            (stat) => {
              const Icon =
                stat.icon;

              return (
                <article
                  key={
                    stat.title
                  }
                  className="rounded-[22px] border border-black/[0.06] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#999]">
                        {
                          stat.title
                        }
                      </p>

                      <p className="mt-3 text-3xl font-black tracking-tight text-[#222]">
                        {
                          stat.value
                        }
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1e7] text-[#FF6B00]">
                      <Icon
                        size={
                          18
                        }
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-[#999]">
                    {
                      stat.description
                    }
                  </p>
                </article>
              );
            }
          )}
        </section>

        {/* MAIN AREA */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_0.7fr]">
          {/* RECENT ORDERS */}
          <div className="overflow-hidden rounded-[26px] border border-black/[0.06] bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-black">
                  Recent Orders
                </h2>

                <p className="mt-1 text-[10px] text-[#999]">
                  Latest production
                  requests.
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-[11px] font-bold text-[#FF6B00]"
              >
                View all
              </Link>
            </div>

            {orders.length ===
            0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f2] text-[#aaa]">
                  <PackageCheck
                    size={20}
                  />
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  No orders yet
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-[#999]">
                  Customer
                  production
                  requests will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.05]">
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
                      className="group grid gap-4 px-5 py-4 transition hover:bg-[#fafaf8] sm:px-6 md:grid-cols-[1fr_0.8fr_0.55fr_auto] md:items-center"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#333]">
                          {
                            order.order_number
                          }
                        </p>

                        <p className="mt-1 truncate text-[11px] text-[#888]">
                          {
                            order.project_name
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-[#444]">
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

                      <div>
                        <p className="text-xs font-black">
                          {money(
                            order.final_total ??
                              order.subtotal
                          )}
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
                      </div>

                      <div className="flex items-center justify-between gap-3 md:justify-end">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-wide ${statusStyle(
                            order.status
                          )}`}
                        >
                          {statusLabel(
                            order.status
                          )}
                        </span>

                        <ArrowRight
                          size={
                            14
                          }
                          className="text-[#bbb] transition group-hover:translate-x-1 group-hover:text-[#FF6B00]"
                        />
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* WORKFLOW */}
          <aside className="rounded-[26px] bg-[#222] p-6 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              Production Flow
            </p>

            <h2 className="mt-2 text-lg font-black">
              From request to
              delivery.
            </h2>

            <div className="mt-7 space-y-5">
              {[
                {
                  number:
                    "01",
                  title:
                    "Review",
                  text:
                    "Check the order, specification and artwork.",
                  icon: Clock3,
                },
                {
                  number:
                    "02",
                  title:
                    "Confirm",
                  text:
                    "Set final pricing and confirm payment.",
                  icon: PackageCheck,
                },
                {
                  number:
                    "03",
                  title:
                    "Produce",
                  text:
                    "Move the approved job into production.",
                  icon: Boxes,
                },
                {
                  number:
                    "04",
                  title:
                    "Deliver",
                  text:
                    "Complete pickup or dispatch.",
                  icon: Truck,
                },
              ].map(
                (
                  step
                ) => {
                  const Icon =
                    step.icon;

                  return (
                    <div
                      key={
                        step.number
                      }
                      className="flex gap-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#FF6B00]">
                        <Icon
                          size={
                            15
                          }
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-white/25">
                            {
                              step.number
                            }
                          </span>

                          <p className="text-xs font-bold">
                            {
                              step.title
                            }
                          </p>
                        </div>

                        <p className="mt-1 text-[10px] leading-5 text-white/40">
                          {
                            step.text
                          }
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
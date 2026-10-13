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

import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type OrderSummary = {
  id: string;
  order_number: string;
  customer_full_name: string | null;
  project_name: string | null;
  item_count: number | null;
  subtotal: number | string | null;
  final_total: number | string | null;
  status: string | null;
  created_at: string;
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Lagos",
});

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

function statusLabel(status: string | null) {
  if (!status) return "Pending";

  return status
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function statusStyle(status: string | null) {
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
      return "bg-amber-50 text-amber-800";
    case "awaiting-artwork":
      return "bg-orange-50 text-orange-800";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-600";
  }
}

const workflow = [
  {
    number: "01",
    title: "Review",
    text: "Check the order, specifications and customer artwork.",
    icon: Clock3,
  },
  {
    number: "02",
    title: "Confirm",
    text: "Agree on final pricing and confirm payment.",
    icon: PackageCheck,
  },
  {
    number: "03",
    title: "Produce",
    text: "Move the approved job into production.",
    icon: Boxes,
  },
  {
    number: "04",
    title: "Deliver",
    text: "Arrange pickup or dispatch and complete the order.",
    icon: Truck,
  },
];

export default async function AdminPage() {
  const supabase = getSupabaseAdmin();

  const [
    recentResult,
    totalResult,
    productionResult,
    artworkResult,
    deliveryResult,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_full_name,
        project_name,
        item_count,
        subtotal,
        final_total,
        status,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(8),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "in-production"),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "awaiting-artwork"),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["ready", "dispatched"]),
  ]);

  const results = [
    { name: "recent orders", result: recentResult },
    { name: "total orders", result: totalResult },
    { name: "production orders", result: productionResult },
    { name: "artwork orders", result: artworkResult },
    { name: "delivery orders", result: deliveryResult },
  ];

  for (const { name, result } of results) {
    if (result.error) {
      console.error(
        `[NewJersey Admin] Failed to load ${name}:`,
        result.error,
      );
    }
  }

  const orders = (recentResult.data ?? []) as OrderSummary[];
  const hasError = results.some(({ result }) => Boolean(result.error));

  const stats = [
    {
      title: "Total orders",
      value: totalResult.error ? "—" : (totalResult.count ?? 0),
      description: "All production requests",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Awaiting artwork",
      value: artworkResult.error ? "—" : (artworkResult.count ?? 0),
      description: "Customer files required",
      href: "/admin/artwork",
      icon: FileImage,
    },
    {
      title: "In production",
      value: productionResult.error ? "—" : (productionResult.count ?? 0),
      description: "Jobs currently being produced",
      href: "/admin/production",
      icon: Boxes,
    },
    {
      title: "Ready / delivery",
      value: deliveryResult.error ? "—" : (deliveryResult.count ?? 0),
      description: "Ready or dispatched orders",
      href: "/admin/delivery",
      icon: Truck,
    },
  ];

  return (
    <main className="min-w-0 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1440px] space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-[#181818] sm:text-3xl">
              Store overview
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
              Keep track of orders, customer artwork, production and delivery.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-lg bg-[#181818] px-4 text-sm font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
          >
            Manage orders
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {hasError && (
          <div
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
          >
            Some dashboard information could not be loaded. Refresh the page
            to try again.
          </div>
        )}

        {/* Summary cards */}
        <section
          aria-label="Order summary"
          className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group min-w-0 rounded-xl border border-black/[0.08] bg-white p-5 transition-colors hover:border-[#F58220]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-neutral-600">
                    {stat.title}
                  </p>

                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="shrink-0 text-neutral-400 transition-colors group-hover:text-[#F58220]"
                  />
                </div>

                <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums text-[#181818]">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  {stat.description}
                </p>
              </Link>
            );
          })}
        </section>

        {/* Orders and workflow */}
        <div className="grid min-w-0 items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_300px]">
          <section
            aria-labelledby="recent-orders-heading"
            className="min-w-0 overflow-hidden rounded-xl border border-black/[0.08] bg-white"
          >
            <div className="flex items-center justify-between gap-4 border-b border-black/[0.08] px-5 py-5 sm:px-6">
              <div>
                <h2
                  id="recent-orders-heading"
                  className="text-base font-semibold text-[#181818]"
                >
                  Recent orders
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Your latest production requests.
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-[#181818] transition-colors hover:text-[#B8540A]"
              >
                View all
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            {recentResult.error ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
                <h3 className="text-base font-semibold">
                  Orders could not be loaded
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                  Refresh the page to try again.
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                  <PackageCheck size={22} aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-base font-semibold">
                  No orders yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                  Customer production requests will appear here when they
                  are submitted.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.06]">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${encodeURIComponent(
                      order.order_number,
                    )}`}
                    className="group block px-5 py-5 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220] sm:px-6"
                  >
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="break-all text-sm font-semibold text-[#181818]">
                            {order.order_number}
                          </p>

                          <span
                            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${statusStyle(
                              order.status,
                            )}`}
                          >
                            {statusLabel(order.status)}
                          </span>
                        </div>

                        <p className="mt-2 break-words text-sm text-neutral-700">
                          {order.project_name || "Untitled project"}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs leading-5 text-neutral-500">
                          <span className="break-words">
                            {order.customer_full_name || "Customer"}
                          </span>
                          <span>{formatDate(order.created_at)}</span>
                          <span>
                            {order.item_count ?? 0}{" "}
                            {order.item_count === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-4 sm:pt-1">
                        <p className="text-sm font-semibold tabular-nums text-[#181818]">
                          {money(order.final_total ?? order.subtotal)}
                        </p>

                        <ArrowRight
                          size={17}
                          aria-hidden="true"
                          className="shrink-0 text-neutral-400 transition-colors group-hover:text-[#B8540A]"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Workflow reference */}
          <aside
            aria-labelledby="production-workflow-heading"
            className="min-w-0 rounded-xl border border-black/[0.08] bg-white p-5 sm:p-6"
          >
            <h2
              id="production-workflow-heading"
              className="text-base font-semibold text-[#181818]"
            >
              Production workflow
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              From approved request to delivery.
            </p>

            <ol className="mt-6 grid gap-6 sm:grid-cols-2 2xl:grid-cols-1">
              {workflow.map((step) => {
                const Icon = step.icon;

                return (
                  <li key={step.number} className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF2E8] text-[#B8540A]">
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-neutral-400">
                          {step.number}
                        </span>

                        <h3 className="text-sm font-semibold text-[#181818]">
                          {step.title}
                        </h3>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        {step.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </div>
    </main>
  );
}
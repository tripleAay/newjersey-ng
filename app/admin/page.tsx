import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import Link from "next/link";
import { ArrowRight, Boxes, FileImage, ShoppingBag, Truck } from "lucide-react";

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

export default async function AdminPage() {
  const current = await requireAdmin();
  const canManageStore = current.profile.role !== "production";
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
      `,
      )
      .order("created_at", { ascending: false })
      .limit(8),

    supabase.from("orders").select("*", { count: "exact", head: true }),

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
      console.error(`[NewJersey Admin] Failed to load ${name}:`, result.error);
    }
  }

  const orders = (recentResult.data ?? []) as OrderSummary[];
  const hasError = results.some(({ result }) => Boolean(result.error));

  const stats = [
    {
      title: "Total orders",
      value: totalResult.error ? "—" : (totalResult.count ?? 0),
      description: "Across the store",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Awaiting artwork",
      value: artworkResult.error ? "—" : (artworkResult.count ?? 0),
      description: "Orders awaiting artwork",
      href: "/admin/artworks",
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
    <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#8A6D57]">
            NewJersey.ng / Workspace
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">
            Store overview.
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#706B63]">
            A clear view of the work moving through your store.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex min-h-11 items-center gap-4 rounded-lg bg-[#FF6B00] px-4 text-xs font-semibold"
        >
          Manage orders
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      {hasError && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          Some information could not be loaded. Counts marked — are unavailable;
          refresh before relying on them.
        </p>
      )}
      <section
        aria-label="Order summary"
        className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="rounded-xl border border-black/[.08] bg-white p-4 transition-colors hover:border-[#FF6B00]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs text-[#706B63]">{stat.title}</span>
                <Icon
                  size={17}
                  aria-hidden="true"
                  className="shrink-0 text-[#8A8379]"
                />
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] leading-5 text-[#8A8379]">
                {stat.description}
              </p>
            </Link>
          );
        })}
      </section>
      <section
        aria-labelledby="recent-orders"
        className="mt-7 overflow-hidden rounded-xl border border-black/[.08] bg-white"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/[.07] px-5 py-5">
          <div>
            <h2 id="recent-orders" className="text-sm font-semibold">
              Recent orders
            </h2>
            <p className="mt-1 text-xs text-[#8A8379]">
              Your eight latest orders, across departments.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold"
          >
            View all
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {recentResult.error ? (
          <p className="p-6 text-sm text-[#706B63]">
            Recent orders could not be loaded.
          </p>
        ) : !orders.length ? (
          <div className="px-5 py-12">
            <h3 className="font-semibold">Your next order starts here.</h3>
            <p className="mt-2 text-sm text-[#706B63]">
              New orders will appear here when customers submit them.
            </p>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${encodeURIComponent(order.order_number)}`}
                className="grid gap-3 border-b border-black/[.06] px-5 py-4 last:border-0 hover:bg-[#FCFBF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6B00] sm:grid-cols-[minmax(0,1fr)_140px_135px] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-medium tracking-wide text-[#8A8379]">
                    {order.order_number} · {formatDate(order.created_at)}
                  </p>
                  <h3 className="mt-1 truncate text-sm font-semibold">
                    {order.project_name || "Customer order"}
                  </h3>
                  <p className="mt-1 truncate text-xs text-[#706B63]">
                    {order.customer_full_name || "Customer"}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-md px-2.5 py-1.5 text-[10px] font-medium ${statusStyle(order.status)}`}
                >
                  {statusLabel(order.status)}
                </span>
                <div className="sm:text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {money(order.final_total ?? order.subtotal)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#8A8379]">
                    {order.final_total == null
                      ? "Estimated total"
                      : "Confirmed total"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <section aria-label="Workspace shortcuts" className="mt-7">
        <h2 className="text-xs font-semibold text-[#706B63]">
          Go to your next task
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(canManageStore
            ? [
                {
                  title: "Catalogue",
                  text: "Products, apparel, jerseys and print.",
                  href: "/admin/products",
                },
                {
                  title: "Creative work",
                  text: "Design requests and customer artwork.",
                  href: "/admin/design",
                },
                {
                  title: "Fulfilment",
                  text: "Move confirmed jobs into production.",
                  href: "/admin/production",
                },
              ]
            : [
                {
                  title: "Order details",
                  text: "Review the jobs you are preparing.",
                  href: "/admin/orders",
                },
                {
                  title: "Customer artwork",
                  text: "Check the approved production files.",
                  href: "/admin/artworks",
                },
                {
                  title: "Production",
                  text: "Manage confirmed and active jobs.",
                  href: "/admin/production",
                },
              ]
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-black/[.08] bg-white px-5 py-4 hover:border-[#FF6B00]/50"
            >
              <div>
                <h3 className="text-xs font-semibold">{item.title}</h3>
                <p className="mt-1 text-[11px] leading-5 text-[#8A8379]">
                  {item.text}
                </p>
              </div>
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="shrink-0 text-[#8A8379]"
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

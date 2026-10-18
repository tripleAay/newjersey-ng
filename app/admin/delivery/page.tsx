import Link from "next/link";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import { updateFulfillment } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    status?: string | string[];
    page?: string | string[];
    error?: string | string[];
    saved?: string | string[];
  }>;
};

const PAGE_SIZE = 20;

const filters = [
  { value: "ready", label: "Ready for handover" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" },
];

const field =
  "mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black/10";

function date(value: string | null) {
  if (!value) return "—";

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
      }).format(parsed);
}

export default async function DeliveryPage({
  searchParams,
}: Props) {
  await requireAdmin();

  const params = await searchParams;

  const status =
    typeof params.status === "string" &&
    filters.some((filter) => filter.value === params.status)
      ? params.status
      : "ready";

  const rawPage =
    typeof params.page === "string" ? Number(params.page) : 1;

  const page =
    Number.isSafeInteger(rawPage) &&
    rawPage >= 1 &&
    rawPage <= 100000
      ? rawPage
      : 1;

  const error =
    typeof params.error === "string" ? params.error : "";

  const supabase = getSupabaseAdmin();

  const { data, error: ordersError, count } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        project_name,
        customer_full_name,
        customer_phone,
        delivery_method,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_landmark,
        delivery_carrier,
        delivery_tracking_reference,
        dispatched_at,
        completed_at,
        status,
        updated_at
      `,
      { count: "exact" }
    )
    .eq("status", status)
    .eq("design_service", false)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (ordersError) {
    console.error("[Delivery orders]", ordersError);
    throw new Error("Unable to load delivery orders.");
  }

  const orders = data ?? [];
  const orderIds = orders.map((order) => order.id);

  const historyResult = orderIds.length
    ? await supabase
        .from("order_fulfillment_history")
        .select(
          "id, order_id, admin_name, previous_status, new_status, carrier, tracking_reference, notes, created_at"
        )
        .in("order_id", orderIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (historyResult.error) {
    console.error("[Fulfillment history]", historyResult.error);
    throw new Error("Unable to load fulfillment history.");
  }

  const history = historyResult.data ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Delivery &amp; pickup.
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
        Record dispatch, confirm customer collection, and
        complete delivered orders.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800"
        >
          {error}
        </p>
      )}

      {params.saved === "1" && (
        <p
          role="status"
          className="mt-6 rounded-xl bg-[#EDF3ED] p-4 text-sm text-[#426247]"
        >
          Order updated. The customer has been notified.
        </p>
      )}

      <nav
        aria-label="Fulfillment filters"
        className="mt-8 flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={`/admin/delivery?status=${filter.value}&page=1`}
            aria-current={
              status === filter.value ? "page" : undefined
            }
            className={[
              "inline-flex min-h-11 items-center rounded-full px-4 text-xs font-medium",
              status === filter.value
                ? "bg-[#181818] text-white"
                : "border border-black/10 bg-white text-[#625D55] hover:bg-[#F5F4F0]",
            ].join(" ")}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      <p className="mt-6 text-xs text-[#7A7368]">
        {total} {total === 1 ? "order" : "orders"}
      </p>

      <div className="mt-4 space-y-5">
        {orders.length === 0 ? (
          <section className="rounded-2xl border border-black/10 bg-white p-8">
            <h2 className="text-lg font-semibold">
              No orders in this view.
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#625D55]">
              Orders appear here after production is marked ready.
            </p>
          </section>
        ) : (
          orders.map((order) => {
            const pickup = order.delivery_method === "pickup";
            const dispatching =
              order.status === "ready" && !pickup;

            const nextStatus = dispatching
              ? "dispatched"
              : order.status === "ready" && pickup
                ? "completed"
                : order.status === "dispatched" && !pickup
                  ? "completed"
                  : null;

            const orderHistory = history.filter(
              (entry) => entry.order_id === order.id
            );

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="break-all text-xs text-[#7A7368]">
                      {order.order_number}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight">
                      {order.project_name || "Order"}
                    </h2>
                    <p className="mt-2 text-sm text-[#625D55]">
                      {order.customer_full_name}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F1F1EE] px-3 py-1.5 text-xs font-medium capitalize text-[#625D55]">
                    {order.status} · {pickup ? "Pickup" : "Delivery"}
                  </span>
                </div>

                <dl className="mt-6 grid gap-5 border-t border-black/10 pt-5 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Customer phone
                    </dt>
                    <dd className="mt-2">{order.customer_phone}</dd>
                  </div>

                  {!pickup && (
                    <div>
                      <dt className="text-xs text-[#7A7368]">
                        Delivery address
                      </dt>
                      <dd className="mt-2 whitespace-pre-wrap leading-7">
                        {[
                          order.delivery_address,
                          order.delivery_city,
                          order.delivery_state,
                          order.delivery_landmark,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </dd>
                    </div>
                  )}

                  {order.delivery_carrier && (
                    <div>
                      <dt className="text-xs text-[#7A7368]">
                        Courier / delivery provider
                      </dt>
                      <dd className="mt-2">
                        {order.delivery_carrier}
                      </dd>
                    </div>
                  )}

                  {order.delivery_tracking_reference && (
                    <div>
                      <dt className="text-xs text-[#7A7368]">
                        Tracking reference
                      </dt>
                      <dd className="mt-2 break-all">
                        {order.delivery_tracking_reference}
                      </dd>
                    </div>
                  )}

                  {order.dispatched_at && (
                    <div>
                      <dt className="text-xs text-[#7A7368]">
                        Dispatched
                      </dt>
                      <dd className="mt-2">{date(order.dispatched_at)}</dd>
                    </div>
                  )}

                  {order.completed_at && (
                    <div>
                      <dt className="text-xs text-[#7A7368]">
                        {pickup ? "Collection confirmed" : "Delivery confirmed"}
                      </dt>
                      <dd className="mt-2">{date(order.completed_at)}</dd>
                    </div>
                  )}
                </dl>

                <Link
                  href={`/admin/orders/${encodeURIComponent(
                    order.order_number
                  )}`}
                  className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4"
                >
                  View full order
                </Link>

                {nextStatus && (
                  <form
                    action={updateFulfillment}
                    className="mt-5 space-y-5 border-t border-black/10 pt-5"
                  >
                    <input
                      type="hidden"
                      name="orderId"
                      value={order.id}
                    />
                    <input
                      type="hidden"
                      name="expectedUpdatedAt"
                      value={order.updated_at}
                    />
                    <input
                      type="hidden"
                      name="nextStatus"
                      value={nextStatus}
                    />

                    {dispatching && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-medium">
                          Courier / delivery provider
                          <input
                            name="carrier"
                            required
                            maxLength={160}
                            className={field}
                            placeholder="Courier company or rider service"
                          />
                        </label>

                        <label className="block text-sm font-medium">
                          Tracking reference (optional)
                          <input
                            name="trackingReference"
                            maxLength={160}
                            className={field}
                          />
                        </label>
                      </div>
                    )}

                    <label className="block text-sm font-medium">
                      Internal handover note
                      <textarea
                        name="notes"
                        rows={3}
                        maxLength={2000}
                        className={field}
                        placeholder="Optional internal record"
                      />
                    </label>

                    <label className="flex items-start gap-3 text-sm leading-7">
                      <input
                        name="handoverConfirmed"
                        type="checkbox"
                        required
                        className="mt-1 h-5 w-5 shrink-0 accent-[#181818]"
                      />
                      {dispatching
                        ? "The order has been handed to the courier."
                        : pickup
                          ? "The customer or authorized representative has collected the order."
                          : "Delivery to the customer has been confirmed."}
                    </label>

                    <p className="text-xs leading-6 text-[#7A7368]">
                      Internal notes stay in admin. Courier and
                      tracking details are included in the dispatch
                      notification.
                    </p>

                    <button
                      type="submit"
                      className="min-h-12 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
                    >
                      {dispatching
                        ? "Mark as dispatched"
                        : pickup
                          ? "Confirm collection"
                          : "Confirm delivery"}
                    </button>
                  </form>
                )}

                {orderHistory.length > 0 && (
                  <details className="mt-6 border-t border-black/10 pt-5">
                    <summary className="cursor-pointer text-xs font-semibold">
                      Handover history
                    </summary>

                    <ol className="mt-4 space-y-4">
                      {orderHistory.map((entry) => (
                        <li
                          key={entry.id}
                          className="rounded-xl bg-[#F7F7F4] p-4"
                        >
                          <p className="text-xs font-semibold capitalize">
                            {entry.previous_status} → {entry.new_status}
                          </p>
                          <p className="mt-2 text-xs text-[#625D55]">
                            {entry.admin_name} · {date(entry.created_at)}
                          </p>

                          {entry.carrier && (
                            <p className="mt-2 text-xs leading-6 text-[#625D55]">
                              {entry.carrier}
                              {entry.tracking_reference
                                ? ` · ${entry.tracking_reference}`
                                : ""}
                            </p>
                          )}

                          {entry.notes && (
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#625D55]">
                              {entry.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </details>
                )}
              </article>
            );
          })
        )}
      </div>

      <nav
        aria-label="Fulfillment pages"
        className="mt-7 flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <p className="text-[#7A7368]">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-5">
          {page > 1 && (
            <Link
              href={`/admin/delivery?status=${status}&page=${page - 1}`}
              className="inline-flex min-h-11 items-center font-semibold"
            >
              Previous
            </Link>
          )}

          {page < totalPages && (
            <Link
              href={`/admin/delivery?status=${status}&page=${page + 1}`}
              className="inline-flex min-h-11 items-center font-semibold"
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
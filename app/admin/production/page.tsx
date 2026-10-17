import Link from "next/link";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import { updateProduction } from "./actions";

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
  { value: "confirmed", label: "Ready to start" },
  { value: "in-production", label: "In production" },
  { value: "ready", label: "Ready" },
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Lagos",
});

function date(value: string | null) {
  if (!value) return "Not provided";

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? "Not provided"
    : dateFormatter.format(parsed);
}

function statusLabel(value: string) {
  return value.replaceAll("-", " ");
}

function selections(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry: unknown) => {
    if (typeof entry !== "object" || entry === null) {
      return [];
    }

    const selection = entry as Record<string, unknown>;

    if (
      typeof selection.optionLabel !== "string" ||
      typeof selection.choiceLabel !== "string"
    ) {
      return [];
    }

    return [`${selection.optionLabel}: ${selection.choiceLabel}`];
  });
}

export default async function ProductionPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;

  const status =
    typeof params.status === "string" &&
    filters.some((filter) => filter.value === params.status)
      ? params.status
      : "confirmed";

  const rawPage = typeof params.page === "string" ? Number(params.page) : 1;

  const page =
    Number.isSafeInteger(rawPage) && rawPage >= 1 && rawPage <= 100000
      ? rawPage
      : 1;

  const error = typeof params.error === "string" ? params.error : "";

  const supabase = getSupabaseAdmin();

  const {
    data,
    error: ordersError,
    count,
  } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        project_name,
        customer_full_name,
        delivery_method,
        preferred_deadline,
        production_instructions,
        status,
        updated_at
      `,
      { count: "exact" },
    )
    .eq("status", status)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (ordersError) {
    console.error("[Production orders]", ordersError);
    throw new Error("Unable to load production orders.");
  }

  const orders = data ?? [];
  const orderIds = orders.map((order) => order.id);

  const [itemsResult, historyResult] = orderIds.length
    ? await Promise.all([
        supabase
          .from("order_items")
          .select(
            `
              id,
              order_id,
              product_name,
              quantity,
              selections,
              review_mode,
              specifications_approved_at,
              specifications_approved_by
            `,
          )
          .in("order_id", orderIds)
          .order("created_at", { ascending: true }),

        supabase
          .from("order_production_history")
          .select(
            `
              id,
              order_id,
              admin_name,
              previous_status,
              new_status,
              notes,
              created_at
            `,
          )
          .in("order_id", orderIds)
          .order("created_at", { ascending: false }),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
      ];

  if (itemsResult.error || historyResult.error) {
    console.error("[Production details]", {
      items: itemsResult.error,
      history: historyResult.error,
    });

    throw new Error("Unable to load production details.");
  }

  const items = itemsResult.data ?? [];
  const history = historyResult.data ?? [];

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">Production.</h1>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#625D55]">
        Manage confirmed orders through production to readiness. Jersey orders
        use approved specifications. Print orders use approved artwork. A
        matching verified payment is required for production updates.
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
          Production updated. The customer has been notified.
        </p>
      )}

      <nav
        aria-label="Production filters"
        className="mt-8 flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={`/admin/production?status=${filter.value}&page=1`}
            aria-current={status === filter.value ? "page" : undefined}
            className={[
              "inline-flex min-h-11 items-center rounded-full px-4 text-xs font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2",
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
            <h2 className="text-lg font-semibold">No orders in this view.</h2>

            <p className="mt-2 text-sm leading-7 text-[#625D55]">
              Orders appear under Ready to start after payment has been
              verified.
            </p>
          </section>
        ) : (
          orders.map((order) => {
            const orderItems = items.filter(
              (item) => item.order_id === order.id,
            );

            const orderHistory = history.filter(
              (entry) => entry.order_id === order.id,
            );

            const unapprovedJerseys = orderItems.some(
              (item) =>
                item.review_mode === "jersey" &&
                (!item.specifications_approved_at ||
                  !item.specifications_approved_by),
            );

            const nextStatus =
              order.status === "confirmed"
                ? "in-production"
                : order.status === "in-production"
                  ? "ready"
                  : null;

            const productionBlocked =
              orderItems.length === 0 || unapprovedJerseys;

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
                      {order.project_name || "Production order"}
                    </h2>

                    <p className="mt-2 text-sm text-[#625D55]">
                      {order.customer_full_name}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F1F1EE] px-3 py-1.5 text-xs font-medium capitalize text-[#625D55]">
                    {statusLabel(order.status)}
                  </span>
                </div>

                <dl className="mt-6 grid gap-5 border-t border-black/10 pt-5 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Preferred deadline
                    </dt>
                    <dd className="mt-2">{date(order.preferred_deadline)}</dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#7A7368]">Fulfillment</dt>
                    <dd className="mt-2">
                      {order.delivery_method === "pickup"
                        ? "Customer pickup"
                        : "Delivery"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 space-y-4">
                  {orderItems.map((item) => {
                    const isJersey = item.review_mode === "jersey";

                    const specificationsApproved = Boolean(
                      item.specifications_approved_at &&
                      item.specifications_approved_by,
                    );

                    const itemSelections = selections(item.selections);

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#F7F7F4] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold">
                              {item.product_name}
                            </h3>

                            <p className="mt-1 text-xs leading-6 text-[#625D55]">
                              Quantity: {item.quantity}{" "}
                              {isJersey
                                ? item.quantity === 1
                                  ? "jersey"
                                  : "jerseys"
                                : item.quantity === 1
                                  ? "unit"
                                  : "units"}
                            </p>
                          </div>

                          {item.review_mode === "retail" && (
                            <p className="mt-3 text-xs text-[#625D55]">
                              Ready-designed apparel. No artwork required.
                            </p>
                          )}
                          {isJersey && (
                            <span
                              className={[
                                "rounded-full px-3 py-1.5 text-xs font-medium",
                                specificationsApproved
                                  ? "bg-[#EDF3ED] text-[#426247]"
                                  : "bg-amber-50 text-amber-800",
                              ].join(" ")}
                            >
                              {specificationsApproved
                                ? "Specifications approved"
                                : "Specifications need approval"}
                            </span>
                          )}
                        </div>

                        {itemSelections.length > 0 && (
                          <ul className="mt-3 space-y-1 text-sm leading-6 text-[#494540]">
                            {itemSelections.map((selection, index) => (
                              <li
                                key={`${item.id}-${index}`}
                                className="whitespace-pre-wrap break-words"
                              >
                                {selection}
                              </li>
                            ))}
                          </ul>
                        )}

                        {isJersey && (
                          <p className="mt-3 text-xs leading-6 text-[#625D55]">
                            Print names and numbers exactly as shown. Preserve
                            capitalisation and leading zeros.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {order.production_instructions && (
                  <div className="mt-5">
                    <h3 className="text-xs font-semibold">
                      Customer instructions
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#625D55]">
                      {order.production_instructions}
                    </p>
                  </div>
                )}

                <Link
                  href={`/admin/orders/${encodeURIComponent(
                    order.order_number,
                  )}`}
                  className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4"
                >
                  View full order
                </Link>

                {nextStatus ? (
                  <form
                    action={updateProduction}
                    className="mt-5 border-t border-black/10 pt-5"
                  >
                    <input type="hidden" name="orderId" value={order.id} />

                    <input
                      type="hidden"
                      name="expectedUpdatedAt"
                      value={order.updated_at}
                    />

                    <input type="hidden" name="nextStatus" value={nextStatus} />

                    {productionBlocked && (
                      <p
                        role="status"
                        className="mb-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800"
                      >
                        {orderItems.length === 0
                          ? "This order has no production items. Review the full order before continuing."
                          : "Jersey specifications need approval. Review the full order before continuing."}
                      </p>
                    )}

                    <label
                      htmlFor={`production-notes-${order.id}`}
                      className="block text-sm font-medium"
                    >
                      Internal production note
                    </label>

                    <textarea
                      id={`production-notes-${order.id}`}
                      name="notes"
                      maxLength={2000}
                      rows={3}
                      placeholder="Optional handover or production notes"
                      className="mt-2 block w-full rounded-xl border border-black/15 px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                    />

                    <p className="mt-2 text-xs leading-6 text-[#7A7368]">
                      Internal notes stay in the admin history. The customer
                      receives a status update.
                    </p>

                    <button
                      type="submit"
                      disabled={productionBlocked}
                      className="mt-5 min-h-12 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {nextStatus === "in-production"
                        ? "Start production"
                        : "Mark as ready"}
                    </button>
                  </form>
                ) : (
                  <p className="mt-5 border-t border-black/10 pt-5 text-sm leading-7 text-[#625D55]">
                    Production is complete. This order is ready for collection
                    or delivery arrangements.
                  </p>
                )}

                {orderHistory.length > 0 && (
                  <details className="mt-6 border-t border-black/10 pt-5">
                    <summary className="cursor-pointer text-xs font-semibold">
                      Production history
                    </summary>

                    <ol className="mt-4 space-y-4">
                      {orderHistory.map((entry) => (
                        <li
                          key={entry.id}
                          className="rounded-xl bg-[#F7F7F4] p-4"
                        >
                          <p className="text-xs font-semibold capitalize">
                            {statusLabel(entry.previous_status)}
                            {" → "}
                            {statusLabel(entry.new_status)}
                          </p>

                          <p className="mt-2 text-xs text-[#625D55]">
                            {entry.admin_name} · {date(entry.created_at)}
                          </p>

                          {entry.notes && (
                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#625D55]">
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
        aria-label="Production pages"
        className="mt-7 flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <p className="text-[#7A7368]">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-5">
          {page > 1 && (
            <Link
              href={`/admin/production?status=${status}&page=${page - 1}`}
              className="inline-flex min-h-11 items-center font-semibold"
            >
              Previous
            </Link>
          )}

          {page < totalPages && (
            <Link
              href={`/admin/production?status=${status}&page=${page + 1}`}
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { confirmOrderPricing } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{
    error?: string | string[];
    saved?: string | string[];
  }>;
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
});

const sectionClass =
  "rounded-xl border border-black/10 bg-white p-5 sm:p-6";

function money(value: unknown) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? currency.format(amount)
    : "Unavailable";
}

function dateLabel(value: string) {
  const date = new Date(value);

  return Number.isFinite(date.getTime())
    ? dateFormatter.format(date)
    : "Date unavailable";
}

function label(value: string) {
  return value.replaceAll("-", " ");
}

function selectionsLabel(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((selection) => {
    if (
      typeof selection !== "object" ||
      selection === null ||
      typeof selection.optionLabel !== "string" ||
      typeof selection.choiceLabel !== "string"
    ) {
      return [];
    }

    return [
      `${selection.optionLabel}: ${selection.choiceLabel}`,
    ];
  });
}

export default async function AdminOrderDetailsPage({
  params,
  searchParams,
}: Props) {
  const current = await requireAdmin();

  const { orderNumber } = await params;
  const query = await searchParams;

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_id, customer_full_name, customer_email, customer_phone, customer_organization, project_name, preferred_deadline, production_instructions, delivery_method, delivery_state, delivery_city, delivery_address, delivery_landmark, subtotal, design_fee, delivery_fee, final_total, status, created_at, updated_at"
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderError) {
    console.error("[Admin order details]", orderError);
    throw new Error("Unable to load this order.");
  }

  if (!order) notFound();

  const [itemsResult, artworkResult, historyResult] =
    await Promise.all([
      supabase
        .from("order_items")
        .select(
          "id, product_name, quantity, unit_price, total_price, design_fee, selections, artwork_type"
        )
        .eq("order_id", order.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("order_artworks")
        .select("id, order_item_id, status")
        .eq("order_id", order.id),

      supabase
        .from("order_pricing_history")
        .select(
          "id, admin_name, production_total, design_fee, delivery_fee, final_total, notes, created_at"
        )
        .eq("order_id", order.id)
        .order("created_at", { ascending: false }),
    ]);

  if (
    itemsResult.error ||
    artworkResult.error ||
    historyResult.error
  ) {
    console.error("[Order supporting details]", {
      items: itemsResult.error,
      artwork: artworkResult.error,
      history: historyResult.error,
    });

    throw new Error("Unable to load order details.");
  }

  const items = itemsResult.data ?? [];
  const artworks = artworkResult.data ?? [];
  const history = historyResult.data ?? [];

  const artworkReady =
    items.length > 0 &&
    items.every((item) =>
      artworks.some(
        (artwork) =>
          artwork.order_item_id === item.id &&
          artwork.status === "approved"
      )
    ) &&
    artworks.every(
      (artwork) => artwork.status === "approved"
    );

  const canManagePricing = ["owner", "admin"].includes(
    current.profile.role
  );

  const pricingOpen =
    order.final_total === null &&
    ["submitted", "under-review", "awaiting-artwork"].includes(
      order.status
    );

  const totalsMatch =
    Math.round(
      items.reduce(
        (sum, item) => sum + Number(item.total_price),
        0
      ) * 100
    ) === Math.round(Number(order.subtotal) * 100) &&
    Math.round(
      items.reduce(
        (sum, item) => sum + Number(item.design_fee),
        0
      ) * 100
    ) === Math.round(Number(order.design_fee) * 100);

  const canConfirm =
    canManagePricing &&
    pricingOpen &&
    artworkReady &&
    totalsMatch &&
    Boolean(order.customer_id);

  const errorMessage =
    typeof query.error === "string"
      ? query.error.slice(0, 500)
      : "";

  return (
    <main className="min-w-0 p-4 text-[#181818] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px]">
        <Link
          href="/admin/orders"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Orders
        </Link>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="break-all text-2xl font-semibold tracking-tight sm:text-3xl">
              {order.order_number}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Created {dateLabel(order.created_at)}
            </p>
          </div>

          <span className="rounded-full bg-[#F58220]/10 px-3 py-1.5 text-xs font-medium capitalize">
            {label(order.status)}
          </span>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800"
          >
            {errorMessage}
          </p>
        )}

        {query.saved === "1" && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-[#F58220]/25 bg-[#F58220]/10 p-4 text-sm leading-7"
          >
            Final pricing confirmed. This order is now
            awaiting payment. No payment has been collected.
          </p>
        )}

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold">
                Customer
              </h2>

              <p className="mt-4 font-medium">
                {order.customer_full_name}
              </p>
              <p className="mt-2 break-all text-sm text-neutral-600">
                {order.customer_email}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                {order.customer_phone}
              </p>

              {order.customer_organization && (
                <p className="mt-2 text-sm text-neutral-600">
                  {order.customer_organization}
                </p>
              )}
            </section>

            <section className={sectionClass}>
              <h2 className="text-lg font-semibold">
                Production brief
              </h2>

              <p className="mt-4 font-medium">
                {order.project_name}
              </p>

              {order.preferred_deadline && (
                <p className="mt-2 text-sm text-neutral-600">
                  Preferred deadline: {order.preferred_deadline}
                </p>
              )}

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-600">
                {order.production_instructions ||
                  "No additional instructions."}
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className="text-lg font-semibold">
                Configured products
              </h2>

              <div className="mt-5 divide-y divide-black/10">
                {items.map((item) => {
                  const itemArtworks = artworks.filter(
                    (artwork) =>
                      artwork.order_item_id === item.id
                  );

                  return (
                    <article
                      key={item.id}
                      className="py-5 first:pt-0 last:pb-0"
                    >
                      <h3 className="font-semibold">
                        {item.product_name}
                      </h3>

                      <p className="mt-2 text-sm text-neutral-600">
                        {item.quantity} identical{" "}
                        {item.quantity === 1 ? "job" : "jobs"} ·{" "}
                        {money(item.unit_price)} production per job
                      </p>

                      {selectionsLabel(item.selections).map(
                        (selection, index) => (
                          <p
                            key={`${index}:${selection}`}
                            className="mt-1 text-xs leading-6 text-neutral-500"
                          >
                            {selection}
                          </p>
                        )
                      )}

                      <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-neutral-600">
                            Production
                          </dt>
                          <dd>{money(item.total_price)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-neutral-600">
                            Design assistance · once
                          </dt>
                          <dd>{money(item.design_fee)}</dd>
                        </div>
                      </dl>

                      <p className="mt-3 text-xs capitalize text-neutral-600">
                        Artwork:{" "}
                        {itemArtworks.length > 0
                          ? itemArtworks
                              .map((artwork) =>
                                label(artwork.status)
                              )
                              .join(", ")
                          : "No artwork record available"}
                      </p>
                    </article>
                  );
                })}
              </div>

              <Link
                href="/admin/artworks"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium underline decoration-[#F58220] underline-offset-4"
              >
                Review customer artwork
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </section>

            <section className={sectionClass}>
              <h2 className="text-lg font-semibold">
                Delivery
              </h2>

              <p className="mt-4 text-sm font-medium capitalize">
                {order.delivery_method}
              </p>

              {order.delivery_method === "delivery" && (
                <div className="mt-3 space-y-2 text-sm leading-7 text-neutral-600">
                  <p className="whitespace-pre-wrap">
                    {order.delivery_address}
                  </p>
                  <p>
                    {[order.delivery_city, order.delivery_state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {order.delivery_landmark && (
                    <p>Landmark: {order.delivery_landmark}</p>
                  )}
                </div>
              )}
            </section>

            <section className={sectionClass}>
              <h2 className="text-lg font-semibold">
                Pricing record
              </h2>

              {history.length === 0 ? (
                <p className="mt-3 text-sm leading-7 text-neutral-500">
                  Final pricing has not been recorded yet.
                </p>
              ) : (
                <ol className="mt-4 space-y-4">
                  {history.map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-xl bg-[#F6F6F3] p-4"
                    >
                      <p className="text-sm font-semibold">
                        {money(entry.final_total)} confirmed
                      </p>
                      <p className="mt-2 text-xs leading-6 text-neutral-500">
                        {entry.admin_name} ·{" "}
                        {dateLabel(entry.created_at)}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-neutral-600">
                        Production {money(entry.production_total)}
                        {" · "}Design {money(entry.design_fee)}
                        {" · "}Delivery {money(entry.delivery_fee)}
                      </p>
                      {entry.notes && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-600">
                          {entry.notes}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          <aside className={`${sectionClass} xl:sticky xl:top-24`}>
            <h2 className="text-lg font-semibold">
              Final pricing
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-600">Production</dt>
                <dd className="font-medium">
                  {money(order.subtotal)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-neutral-600">
                  Design assistance
                </dt>
                <dd className="font-medium">
                  {money(order.design_fee)}
                </dd>
              </div>

              {order.final_total !== null && (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-600">Delivery</dt>
                    <dd>{money(order.delivery_fee)}</dd>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-black/10 pt-4">
                    <dt className="font-semibold">
                      Confirmed total
                    </dt>
                    <dd className="text-xl font-semibold">
                      {money(order.final_total)}
                    </dd>
                  </div>
                </>
              )}
            </dl>

            {pricingOpen && (
              <>
                <p className="mt-5 rounded-xl bg-[#F6F6F3] p-4 text-sm leading-7">
                  {artworkReady
                    ? "All required artwork is approved."
                    : "Every item needs approved artwork before pricing can be confirmed."}
                </p>

                {!totalsMatch && (
                  <p className="mt-3 text-sm leading-7 text-red-700">
                    Order totals differ from the saved item totals.
                    Resolve this before confirming.
                  </p>
                )}

                {!order.customer_id && (
                  <p className="mt-3 text-sm leading-7 text-red-700">
                    This order is not linked to a customer account.
                  </p>
                )}

                {canManagePricing ? (
                  <form
                    action={confirmOrderPricing}
                    className="mt-5 space-y-4"
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

                    <label className="block text-sm font-medium">
                      Delivery fee in NGN
                      <input
                        name="deliveryFee"
                        type="number"
                        min="0"
                        max="9999999999"
                        step="0.01"
                        required
                        readOnly={order.delivery_method === "pickup"}
                        defaultValue={
                          order.delivery_method === "pickup"
                            ? "0"
                            : String(order.delivery_fee ?? 0)
                        }
                        className="mt-2 block min-h-12 w-full rounded-xl border border-black/15 px-4 text-base outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 read-only:bg-neutral-50"
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Internal pricing notes
                      <textarea
                        name="notes"
                        rows={3}
                        maxLength={3000}
                        className="mt-2 block w-full rounded-xl border border-black/15 px-4 py-3 text-base outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                      />
                    </label>

                    <p className="text-xs leading-6 text-neutral-500">
                      Confirmation adds the delivery fee to
                      production and design charges, then changes
                      the order to awaiting payment.
                    </p>

                    <button
                      type="submit"
                      disabled={!canConfirm}
                      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#F58220] px-5 text-sm font-semibold transition-colors hover:bg-[#D96B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Confirm final pricing
                    </button>
                  </form>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-neutral-500">
                    An owner or admin must confirm final pricing.
                  </p>
                )}
              </>
            )}

            {!pricingOpen && (
              <p className="mt-5 text-sm leading-7 text-neutral-500">
                Final-pricing confirmation is closed for this
                order. Payment verification is a separate step.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
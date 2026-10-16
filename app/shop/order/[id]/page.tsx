import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileCheck2,
  Package,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ Id: string }>;
};

type MoneyValue = number | string | null | undefined;

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

const buttonClass =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-4";

function parseMoney(value: MoneyValue): number | null {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && !value.trim())
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : null;
}

function money(value: MoneyValue) {
  const parsed = parseMoney(value);

  return parsed === null
    ? "Unavailable"
    : currency.format(parsed);
}

function date(
  value: string | null | undefined,
  includeTime = false
) {
  if (!value) return "Not provided";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Not provided";
  }

  return includeTime
    ? dateTimeFormatter.format(parsed)
    : dateFormatter.format(parsed);
}

function label(value: string) {
  return value.replaceAll("-", " ");
}

function getOrderState(status: string) {
  switch (status) {
    case "submitted":
      return {
        title: "We have your order.",
        description:
          "We’ll check the details and confirm what happens next.",
        stage: 0,
      };

    case "under-review":
      return {
        title: "We’re checking the details.",
        description:
          "Your specifications and artwork are being reviewed before production.",
        stage: 0,
      };

    case "awaiting-artwork":
      return {
        title: "Your artwork is the next step.",
        description:
          "Open your artwork page to upload a file or respond to feedback.",
        stage: 0,
      };

    case "awaiting-payment":
      return {
        title: "Your final price is ready.",
        description:
          "Review the confirmed total below. Payment instructions will be provided separately.",
        stage: 1,
      };

    case "confirmed":
      return {
        title: "Your order is confirmed.",
        description:
          "Everything is being prepared for production.",
        stage: 1,
      };

    case "in-production":
      return {
        title: "Your order is taking shape.",
        description:
          "Production is underway. We’ll update your order when it is ready.",
        stage: 2,
      };

    case "ready":
      return {
        title: "Your order is ready.",
        description:
          "Collection or delivery arrangements will be confirmed.",
        stage: 3,
      };

    case "dispatched":
      return {
        title: "Your order is on its way.",
        description:
          "Your finished order has been dispatched.",
        stage: 3,
      };

    case "completed":
      return {
        title: "All done.",
        description:
          "Your order is complete. Thank you for choosing NewJersey.ng.",
        stage: 4,
      };

    case "cancelled":
      return {
        title: "This order is cancelled.",
        description:
          "Contact us with your order reference if you need help.",
        stage: -1,
      };

    default:
      return {
        title: "Your order update.",
        description:
          "You’ll find the latest order details here.",
        stage: -1,
      };
  }
}

function selections(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof entry.optionLabel !== "string" ||
      typeof entry.choiceLabel !== "string"
    ) {
      return [];
    }

    return [`${entry.optionLabel}: ${entry.choiceLabel}`];
  });
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-black/10 py-8 sm:py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs font-medium text-[#948D82]">
          {number}
        </span>

        <h2 className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function Detail({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-[#7A7368]">
        {title}
      </dt>

      <dd className="mt-2 break-words whitespace-pre-wrap text-sm leading-7">
        {children || "Not provided"}
      </dd>
    </div>
  );
}

function PriceRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 text-sm">
      <dt className="text-[#625D55]">{title}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export default async function OrderDetailsPage({
  params,
}: Props) {
  const { Id: id } = await params;

  if (typeof id !== "string" || !UUID.test(id)) {
    notFound();
  }

  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    redirect(
      `/login?next=${encodeURIComponent(`/shop/order/${id}`)}`
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      project_name,
      status,
      customer_full_name,
      customer_phone,
      customer_email,
      customer_organization,
      delivery_method,
      delivery_state,
      delivery_city,
      delivery_address,
      delivery_landmark,
      preferred_deadline,
      production_instructions,
      item_count,
      subtotal,
      design_fee,
      delivery_fee,
      final_total,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error("[Customer order]", orderError);
    throw new Error("Unable to load your order.");
  }

  if (!order) notFound();

  const [itemsResult, artworksResult] = await Promise.all([
    supabase
      .from("order_items")
      .select(`
        id,
        product_name,
        quantity,
        unit_price,
        total_price,
        design_fee,
        artwork_type,
        selections
      `)
      .eq("order_id", order.id)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }),

    supabase
      .from("order_artworks")
      .select(`
        id,
        order_item_id,
        status,
        file_name,
        notes,
        updated_at
      `)
      .eq("order_id", order.id)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }),
  ]);

  if (itemsResult.error || artworksResult.error) {
    console.error("[Customer order details]", {
      itemsError: itemsResult.error,
      artworksError: artworksResult.error,
    });

    throw new Error("Unable to load your order details.");
  }

  const items = itemsResult.data ?? [];
  const artworks = artworksResult.data ?? [];

  const pickup = order.delivery_method === "pickup";
  const pricingConfirmed = order.final_total !== null;
  const state = getOrderState(order.status);

  const production = parseMoney(order.subtotal);
  const designFee = parseMoney(order.design_fee);

  const estimate =
    production !== null && designFee !== null
      ? Math.round((production + designFee) * 100) / 100
      : null;

  const hasCustomerArtwork = items.some(
    (item) => item.artwork_type === "customer-supplied"
  );

  const steps = [
    "Review",
    "Confirmation",
    "Production",
    pickup ? "Collection" : "Delivery",
  ];

  return (
    <div className="min-h-screen bg-[#F4F1E9] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#F4F1E9]/95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 pb-16 pt-6 sm:px-8 sm:pb-24 lg:px-12">
        <Link
          href="/shop/order"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          All orders
        </Link>

        <div className="pb-9 pt-7 sm:pb-12 sm:pt-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#625D55]">
            <p className="break-all font-medium">
              {order.order_number}
            </p>

            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-[#B3AC9F] sm:block"
            />

            <p>Placed {date(order.created_at)}</p>
          </div>

          <h1 className="mt-4 max-w-3xl break-words text-4xl font-semibold leading-[1.1] tracking-[-0.055em] sm:text-5xl">
            {order.project_name || "Your order"}
          </h1>
        </div>

        <div className="grid items-start gap-x-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-20">
          <div className="min-w-0">
            <section className="border-t border-black/10 pb-9 pt-7 sm:pb-12 sm:pt-8">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F58220]" />

                <p className="text-xs font-semibold capitalize text-[#625D55]">
                  {label(order.status)}
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                {state.title}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
                {state.description}
              </p>

              {order.status === "awaiting-artwork" &&
                hasCustomerArtwork && (
                  <Link
                    href={`/shop/artwork/${order.id}`}
                    className={`${buttonClass} mt-5`}
                  >
                    Open your artwork
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                )}

              {state.stage >= 0 && (
                <ol className="mt-8 grid grid-cols-4 gap-2 sm:gap-4">
                  {steps.map((step, index) => {
                    const completed = state.stage > index;
                    const active = state.stage === index;

                    return (
                      <li
                        key={step}
                        aria-current={
                          active ? "step" : undefined
                        }
                      >
                        <div
                          className={[
                            "h-1 rounded-full",
                            completed
                              ? "bg-[#181818]"
                              : active
                                ? "bg-[#F58220]"
                                : "bg-black/10",
                          ].join(" ")}
                        />

                        <p
                          className={[
                            "mt-3 flex min-h-8 items-start gap-1 text-[10px] leading-4 sm:text-xs",
                            active || completed
                              ? "font-semibold text-[#181818]"
                              : "text-[#7A7368]",
                          ].join(" ")}
                        >
                          {completed && (
                            <Check
                              size={12}
                              aria-hidden="true"
                              className="mt-0.5 hidden shrink-0 sm:block"
                            />
                          )}

                          {step}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            <Section number="01" title="What you ordered">
              {items.length === 0 ? (
                <p className="text-sm leading-7 text-[#625D55]">
                  Product details are unavailable. Contact
                  us with your order reference.
                </p>
              ) : (
                <div className="space-y-8">
                  {items.map((item, index) => {
                    const options = selections(
                      item.selections
                    );

                    const itemArtworks = artworks.filter(
                      (artwork) =>
                        artwork.order_item_id === item.id
                    );

                    return (
                      <article
                        key={item.id}
                        className={
                          index > 0
                            ? "border-t border-black/10 pt-8"
                            : ""
                        }
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10">
                            <Package
                              size={21}
                              strokeWidth={1.5}
                              aria-hidden="true"
                              className="text-[#625D55]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
                              <div>
                                <h3 className="break-words text-lg font-semibold tracking-tight">
                                  {item.product_name}
                                </h3>

                                <p className="mt-1 text-xs text-[#625D55]">
                                  {item.quantity}{" "}
                                  {item.quantity === 1
                                    ? "configured job"
                                    : "configured jobs"}
                                </p>
                              </div>

                              <p className="text-base font-semibold">
                                {money(item.total_price)}
                              </p>
                            </div>

                            {options.length > 0 && (
                              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs leading-6 text-[#625D55]">
                                {options.map(
                                  (option, optionIndex) => (
                                    <li
                                      key={`${item.id}-${optionIndex}`}
                                    >
                                      {option}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}

                            <p className="mt-3 text-xs leading-6 text-[#625D55]">
                              {money(item.unit_price)} per
                              job
                            </p>

                            {item.artwork_type && (
                              <p className="mt-1 text-xs leading-6 text-[#625D55]">
                                {item.artwork_type ===
                                "customer-supplied"
                                  ? "Your own artwork"
                                  : "Design assistance"}
                                {" · "}
                                {money(item.design_fee)}{" "}
                                design fee
                              </p>
                            )}
                          </div>
                        </div>

                        {itemArtworks.length > 0 && (
                          <div className="mt-5 space-y-3 sm:ml-16">
                            {itemArtworks.map((artwork) => (
                              <div
                                key={artwork.id}
                                className="rounded-2xl bg-white/70 p-4 sm:p-5"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <p className="inline-flex items-center gap-2 text-xs font-semibold capitalize">
                                    <FileCheck2
                                      size={15}
                                      aria-hidden="true"
                                      className="text-[#625D55]"
                                    />
                                    Artwork{" "}
                                    {label(artwork.status)}
                                  </p>

                                  {item.artwork_type ===
                                    "customer-supplied" && (
                                    <Link
                                      href={`/shop/artwork/${order.id}`}
                                      className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold underline decoration-black/20 underline-offset-4 hover:decoration-black"
                                    >
                                      View
                                      <ArrowUpRight
                                        size={13}
                                        aria-hidden="true"
                                      />
                                    </Link>
                                  )}
                                </div>

                                {artwork.file_name && (
                                  <p className="mt-2 break-all text-xs leading-6 text-[#625D55]">
                                    {artwork.file_name}
                                  </p>
                                )}

                                {artwork.notes && (
                                  <div className="mt-4 border-t border-black/10 pt-4">
                                    <p className="text-xs font-semibold">
                                      {artwork.status ===
                                      "revision-required"
                                        ? "What needs changing"
                                        : "Feedback from our team"}
                                    </p>

                                    <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-7 text-[#625D55]">
                                      {artwork.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}

              {hasCustomerArtwork && (
                <Link
                  href={`/shop/artwork/${order.id}`}
                  className="mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-semibold underline decoration-black/20 underline-offset-4 hover:decoration-black"
                >
                  Artwork, uploads and feedback
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                  />
                </Link>
              )}
            </Section>

            <Section
              number="02"
              title={pickup ? "Collection details" : "Delivery details"}
            >
              {pickup ? (
                <p className="max-w-xl text-sm leading-7 text-[#625D55]">
                  You selected pickup. We’ll confirm where
                  and when to collect your order once it
                  is ready.
                </p>
              ) : (
                <dl className="grid gap-6 sm:grid-cols-2">
                  <Detail title="Delivery address">
                    {order.delivery_address}
                  </Detail>

                  <Detail title="City and state">
                    {[
                      order.delivery_city,
                      order.delivery_state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Detail>

                  {order.delivery_landmark && (
                    <Detail title="Landmark">
                      {order.delivery_landmark}
                    </Detail>
                  )}
                </dl>
              )}
            </Section>

            <Section number="03" title="Your details">
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <Detail title="Full name">
                  {order.customer_full_name}
                </Detail>

                <Detail title="Phone">
                  {order.customer_phone}
                </Detail>

                <Detail title="Email">
                  {order.customer_email}
                </Detail>

                {order.customer_organization && (
                  <Detail title="Organization">
                    {order.customer_organization}
                  </Detail>
                )}
              </dl>
            </Section>

            <Section number="04" title="Production brief">
              <dl className="grid gap-6 sm:grid-cols-2">
                <Detail title="Project">
                  {order.project_name}
                </Detail>

                <Detail title="Preferred deadline">
                  {date(order.preferred_deadline)}
                </Detail>

                <div className="sm:col-span-2">
                  <Detail title="Instructions">
                    {order.production_instructions}
                  </Detail>
                </div>
              </dl>

              <p className="mt-5 text-xs leading-6 text-[#7A7368]">
                Preferred dates are subject to production
                confirmation.
              </p>
            </Section>
          </div>

          <aside className="min-w-0 pb-8 lg:sticky lg:top-44">
            <div className="rounded-[24px] bg-white p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7A7368]">
                Order summary
              </p>

              <p className="mt-6 text-xs text-[#625D55]">
                {pricingConfirmed
                  ? "Confirmed total"
                  : "Total before delivery"}
              </p>

              <p className="mt-2 break-words text-4xl font-semibold tracking-[-0.05em]">
                {pricingConfirmed
                  ? money(order.final_total)
                  : money(estimate)}
              </p>

              <p className="mt-3 text-xs leading-6 text-[#7A7368]">
                {pricingConfirmed
                  ? "Your final order price has been confirmed."
                  : "Final pricing will be confirmed after review."}
              </p>

              <dl className="mt-7 space-y-4 border-t border-black/10 pt-6">
                <PriceRow
                  title="Production"
                  value={money(order.subtotal)}
                />

                <PriceRow
                  title="Design assistance"
                  value={money(order.design_fee)}
                />

                <PriceRow
                  title={pickup ? "Pickup" : "Delivery"}
                  value={
                    pickup
                      ? money(0)
                      : pricingConfirmed
                        ? money(order.delivery_fee)
                        : "To be confirmed"
                  }
                />

                <PriceRow
                  title="Configured jobs"
                  value={String(order.item_count)}
                />
              </dl>

              {order.status === "awaiting-payment" && (
                <div className="mt-6 border-t border-black/10 pt-5">
                  <p className="text-sm font-semibold">
                    Ready for payment
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[#625D55]">
                    Payment instructions will be provided
                    separately.
                  </p>
                </div>
              )}

              {hasCustomerArtwork &&
                order.status === "awaiting-artwork" && (
                  <Link
                    href={`/shop/artwork/${order.id}`}
                    className={`${buttonClass} mt-6 w-full`}
                  >
                    Manage artwork
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                )}

              {!pricingConfirmed && !pickup && (
                <p className="mt-6 text-xs leading-6 text-[#7A7368]">
                  Delivery is excluded from the total
                  shown above.
                </p>
              )}
            </div>

            <div className="px-1 pt-6">
              <p className="text-xs font-semibold">
                Need help with this order?
              </p>

              <a
                href={`mailto:hello@newjersey.ng?subject=${encodeURIComponent(
                  `Order ${order.order_number}`
                )}`}
                className="mt-2 inline-flex min-h-9 items-center gap-2 text-xs text-[#625D55] underline decoration-black/20 underline-offset-4 hover:text-[#181818]"
              >
                Contact our team
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                />
              </a>

              <p className="mt-4 text-[11px] leading-6 text-[#7A7368]">
                Last updated {date(order.updated_at, true)}
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
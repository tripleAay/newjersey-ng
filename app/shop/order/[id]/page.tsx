import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  Palette,
  Phone,
  ReceiptText,
  Store,
  Truck,
  UserRound,
} from "lucide-react";

import { getSupabaseAdmin } from "@/app/lib/supabase/admin";
import ArtworkUploader from "@/app/components/newjersey/order/ArtworkUploader";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type OrderStatus =
  | "submitted"
  | "under-review"
  | "awaiting-artwork"
  | "awaiting-payment"
  | "confirmed"
  | "in-production"
  | "ready"
  | "dispatched"
  | "completed"
  | "cancelled";

type ArtworkStatus =
  | "pending"
  | "uploaded"
  | "reviewing"
  | "approved"
  | "revision-required"
  | "rejected";

type ProductSelection = {
  optionId?: string;
  optionLabel?: string;
  choiceId?: string;
  choiceLabel?: string;
  priceModifier?: number;
};

type ArtworkRecord = {
  id: string;

  file_name: string | null;
  storage_path: string | null;

  mime_type: string | null;
  file_size: number | null;

  status: ArtworkStatus;

  notes: string | null;

  created_at: string;
  updated_at: string;
};

type OrderItem = {
  id: string;

  cart_item_id: string;

  product_id: string;
  product_slug: string;
  product_name: string;
  product_image: string | null;

  quantity: number;

  base_price: number | string;
  options_total: number | string;
  unit_price: number | string;
  total_price: number | string;

  selections: ProductSelection[] | null;

  artwork_type:
    | "customer-supplied"
    | "design-needed"
    | null;

  design_fee: number | string;

  created_at: string;

  order_artworks:
    | ArtworkRecord[]
    | null;
};

type Order = {
  id: string;

  order_number: string;

  customer_full_name: string;
  customer_phone: string;
  customer_email: string;

  customer_organization:
    | string
    | null;

  delivery_method:
    | "delivery"
    | "pickup";

  delivery_state:
    | string
    | null;

  delivery_city:
    | string
    | null;

  delivery_address:
    | string
    | null;

  delivery_landmark:
    | string
    | null;

  project_name: string;

  preferred_deadline:
    | string
    | null;

  production_instructions:
    | string
    | null;

  item_count: number;

  subtotal:
    | number
    | string;

  design_fee:
    | number
    | string;

  delivery_fee:
    | number
    | string;

  final_total:
    | number
    | string
    | null;

  status: OrderStatus;

  created_at: string;
  updated_at: string;

  order_items:
    | OrderItem[]
    | null;
};

const STATUS_ORDER: OrderStatus[] = [
  "submitted",
  "under-review",
  "awaiting-artwork",
  "awaiting-payment",
  "confirmed",
  "in-production",
  "ready",
  "dispatched",
  "completed",
];

function numberValue(
  value:
    | number
    | string
    | null
    | undefined
) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function formatNGN(
  value:
    | number
    | string
    | null
    | undefined
) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(
    numberValue(value)
  );
}

function formatDate(
  value:
    | string
    | null
    | undefined
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(
  value:
    | string
    | null
    | undefined
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatStatus(
  status: string
) {
  return status
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function getStatusDescription(
  status: OrderStatus
) {
  switch (status) {
    case "submitted":
      return "Your production request has been received.";

    case "under-review":
      return "NewJersey is reviewing the specifications, artwork requirements and pricing.";

    case "awaiting-artwork":
      return "Artwork is required before this job can move forward.";

    case "awaiting-payment":
      return "The job has been reviewed and is waiting for payment.";

    case "confirmed":
      return "The order has been confirmed and is ready for production.";

    case "in-production":
      return "Your job is currently being produced.";

    case "ready":
      return "Production is complete and your order is ready.";

    case "dispatched":
      return "Your finished order has been dispatched.";

    case "completed":
      return "This order has been completed.";

    case "cancelled":
      return "This production request has been cancelled.";

    default:
      return "Order status updated.";
  }
}

function getStatusIndex(
  status: OrderStatus
) {
  return STATUS_ORDER.indexOf(
    status
  );
}

function artworkIsComplete(
  artwork: ArtworkRecord
) {
  return [
    "uploaded",
    "reviewing",
    "approved",
  ].includes(
    artwork.status
  );
}

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  const { id } =
    await params;

  const rawId =
    decodeURIComponent(
      id
    ).trim();

  const supabase =
    getSupabaseAdmin();

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      rawId
    );

  let query = supabase
    .from("orders")
    .select(
      `
        id,
        order_number,

        customer_full_name,
        customer_phone,
        customer_email,
        customer_organization,

        delivery_method,
        delivery_state,
        delivery_city,
        delivery_address,
        delivery_landmark,

        project_name,
        preferred_deadline,
        production_instructions,

        item_count,

        subtotal,
        design_fee,
        delivery_fee,
        final_total,

        status,

        created_at,
        updated_at,

        order_items (
          id,
          cart_item_id,
          product_id,
          product_slug,
          product_name,
          product_image,

          quantity,

          base_price,
          options_total,
          unit_price,
          total_price,

          selections,

          artwork_type,
          design_fee,

          created_at,

          order_artworks (
            id,
            file_name,
            storage_path,
            mime_type,
            file_size,
            status,
            notes,
            created_at,
            updated_at
          )
        )
      `
    );

  if (isUuid) {
    query =
      query.eq(
        "id",
        rawId
      );
  } else {
    query =
      query.eq(
        "order_number",
        rawId.toUpperCase()
      );
  }

  const {
    data,
    error,
  } =
    await query.maybeSingle();

  const order =
    data as Order | null;

  if (
    error ||
    !order
  ) {
    if (error) {
      console.error(
        "[NewJersey] order page error",
        error
      );
    }

    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 text-[#222] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#FF6B00]"
          >
            <ArrowLeft
              size={15}
            />

            Back to shop
          </Link>

          <div className="mt-16 max-w-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Package
                size={23}
                className="text-[#FF6B00]"
              />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.17em] text-[#FF6B00]">
              NewJersey Order
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
              Order not found.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#777]">
              We couldn&apos;t
              find an order
              matching{" "}
              <span className="font-semibold text-[#444]">
                {rawId}
              </span>
              .
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#222] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#FF6B00]"
            >
              Return to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const orderItems =
    order.order_items ??
    [];

  const subtotal =
    numberValue(
      order.subtotal
    );

  const designFee =
    numberValue(
      order.design_fee
    );

  const deliveryFee =
    numberValue(
      order.delivery_fee
    );

  const finalTotal =
    order.final_total ===
    null
      ? null
      : numberValue(
          order.final_total
        );

  const estimatedTotal =
    subtotal +
    designFee +
    deliveryFee;

  const currentStatusIndex =
    getStatusIndex(
      order.status
    );

  const customerSuppliedArtwork =
    orderItems.filter(
      (item) =>
        item.artwork_type ===
        "customer-supplied"
    );

  const designNeeded =
    orderItems.filter(
      (item) =>
        item.artwork_type ===
        "design-needed"
    );

  const artworkRecords =
    customerSuppliedArtwork.flatMap(
      (item) =>
        item.order_artworks ??
        []
    );

  const completedArtworkCount =
    artworkRecords.filter(
      artworkIsComplete
    ).length;

  const pendingArtworkCount =
    Math.max(
      artworkRecords.length -
        completedArtworkCount,
      0
    );

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#222]">
      <div className="mx-auto w-[92%] max-w-[1440px] py-8 sm:py-12">
        {/* TOP */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#FF6B00]"
          >
            <ArrowLeft
              size={15}
            />

            Back to shop
          </Link>

          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa]">
            NewJersey.ng
          </span>
        </div>

        {/* HERO */}

        <section className="mt-8 rounded-[30px] bg-[#222] p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FF6B00]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
                  {formatStatus(
                    order.status
                  )}
                </span>
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF8A33]">
                Production order
              </p>

              <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                {
                  order.project_name
                }
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                {getStatusDescription(
                  order.status
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">
                Order reference
              </p>

              <p className="mt-1 font-mono text-lg font-bold">
                {
                  order.order_number
                }
              </p>
            </div>
          </div>
        </section>

        {/* MAIN */}

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_370px]">
          <div className="space-y-7">
            {/* PROGRESS */}

            <SectionCard>
              <SectionHeading
                eyebrow="Production"
                title="Order progress"
                description="Follow this job from review through production and delivery."
              />

              {order.status ===
              "cancelled" ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="text-sm font-bold text-red-700">
                    Order
                    cancelled
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600/70">
                    This production
                    request is no
                    longer active.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <TimelineCard
                    number="01"
                    title="Review"
                    description="Specifications and artwork are checked."
                    complete={
                      currentStatusIndex >
                      1
                    }
                    active={[
                      "submitted",
                      "under-review",
                      "awaiting-artwork",
                    ].includes(
                      order.status
                    )}
                  />

                  <TimelineCard
                    number="02"
                    title="Confirmation"
                    description="Pricing and production are confirmed."
                    complete={
                      currentStatusIndex >
                      4
                    }
                    active={[
                      "awaiting-payment",
                      "confirmed",
                    ].includes(
                      order.status
                    )}
                  />

                  <TimelineCard
                    number="03"
                    title="Production"
                    description="Your approved job is produced."
                    complete={
                      currentStatusIndex >
                      5
                    }
                    active={
                      order.status ===
                      "in-production"
                    }
                  />

                  <TimelineCard
                    number="04"
                    title={
                      order.delivery_method ===
                      "pickup"
                        ? "Ready"
                        : "Delivery"
                    }
                    description={
                      order.delivery_method ===
                      "pickup"
                        ? "Your finished job is ready for collection."
                        : "Your finished order moves to delivery."
                    }
                    complete={
                      order.status ===
                      "completed"
                    }
                    active={[
                      "ready",
                      "dispatched",
                    ].includes(
                      order.status
                    )}
                  />
                </div>
              )}
            </SectionCard>

            {/* JOBS */}

            <SectionCard>
              <SectionHeading
                eyebrow="Production jobs"
                title={`${orderItems.length} configured ${
                  orderItems.length ===
                  1
                    ? "job"
                    : "jobs"
                }`}
                description="These are the product configurations attached to this production order."
              />

              <div className="mt-7 space-y-4">
                {orderItems.map(
                  (item) => {
                    const selections =
                      Array.isArray(
                        item.selections
                      )
                        ? item.selections
                        : [];

                    const artworks =
                      item.order_artworks ??
                      [];

                    return (
                      <article
                        key={
                          item.id
                        }
                        className="rounded-2xl border border-black/[0.07] p-4 sm:p-5"
                      >
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f3]">
                            {item.product_image ? (
                              <Image
                                src={
                                  item.product_image
                                }
                                alt={
                                  item.product_name
                                }
                                fill
                                sizes="80px"
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package
                                  size={
                                    22
                                  }
                                  className="text-[#bbb]"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-bold">
                                  {
                                    item.product_name
                                  }
                                </h3>

                                <p className="mt-1 text-[10px] text-[#999]">
                                  Job
                                  quantity:{" "}
                                  {
                                    item.quantity
                                  }
                                </p>
                              </div>

                              <p className="text-sm font-bold">
                                {formatNGN(
                                  item.total_price
                                )}
                              </p>
                            </div>

                            {selections.length >
                              0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {selections.map(
                                  (
                                    selection,
                                    index
                                  ) => (
                                    <span
                                      key={`${selection.optionId ?? index}-${selection.choiceId ?? index}`}
                                      className="rounded-full bg-[#f5f5f3] px-3 py-1.5 text-[9px] font-semibold text-[#666]"
                                    >
                                      {selection.optionLabel &&
                                        `${selection.optionLabel}: `}

                                      {selection.choiceLabel ??
                                        "Option"}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ARTWORK PER JOB */}

                        <div className="mt-5 border-t border-black/[0.06] pt-5">
                          {item.artwork_type ===
                          "customer-supplied" ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff5ed] text-[#FF6B00]">
                                  <FileCheck2
                                    size={
                                      16
                                    }
                                  />
                                </div>

                                <div>
                                  <p className="text-xs font-bold">
                                    Customer
                                    artwork
                                  </p>

                                  <p className="mt-0.5 text-[9px] text-[#999]">
                                    Upload
                                    the
                                    production
                                    artwork
                                    for
                                    this
                                    job.
                                  </p>
                                </div>
                              </div>

                              {artworks.length >
                              0 ? (
                                <div className="space-y-3">
                                  {artworks.map(
                                    (
                                      artwork
                                    ) => (
                                      <ArtworkUploader
                                        key={
                                          artwork.id
                                        }
                                        orderNumber={
                                          order.order_number
                                        }
                                        artworkId={
                                          artwork.id
                                        }
                                        currentStatus={
                                          artwork.status
                                        }
                                        currentFileName={
                                          artwork.file_name
                                        }
                                      />
                                    )
                                  )}
                                </div>
                              ) : (
                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                                  <p className="text-[10px] font-semibold text-red-600">
                                    Artwork
                                    record
                                    missing
                                    for
                                    this
                                    job.
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff5ed] text-[#FF6B00]">
                                <Palette
                                  size={
                                    16
                                  }
                                />
                              </div>

                              <div>
                                <p className="text-xs font-bold">
                                  Design
                                  support
                                </p>

                                <p className="mt-0.5 text-[9px] text-[#999]">
                                  NewJersey
                                  will
                                  review
                                  the
                                  design
                                  requirements
                                  for
                                  this
                                  job.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </SectionCard>

            {/* ARTWORK OVERVIEW */}

            {(customerSuppliedArtwork.length >
              0 ||
              designNeeded.length >
                0) && (
              <SectionCard>
                <SectionHeading
                  eyebrow="Artwork"
                  title="Artwork requirements"
                  description="Artwork and design requirements are reviewed before production begins."
                />

                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {customerSuppliedArtwork.length >
                    0 && (
                    <InfoPanel
                      icon={
                        <FileCheck2
                          size={18}
                        />
                      }
                      title="Customer artwork"
                      value={`${customerSuppliedArtwork.length} ${
                        customerSuppliedArtwork.length ===
                        1
                          ? "job"
                          : "jobs"
                      }`}
                      description="These jobs require artwork supplied by the customer."
                    />
                  )}

                  {artworkRecords.length >
                    0 && (
                    <InfoPanel
                      icon={
                        <CheckCircle2
                          size={18}
                        />
                      }
                      title="Files received"
                      value={`${completedArtworkCount}/${artworkRecords.length}`}
                      description={
                        pendingArtworkCount >
                        0
                          ? `${pendingArtworkCount} artwork file${
                              pendingArtworkCount ===
                              1
                                ? ""
                                : "s"
                            } still pending.`
                          : "All required artwork files have been received."
                      }
                    />
                  )}

                  {designNeeded.length >
                    0 && (
                    <InfoPanel
                      icon={
                        <Palette
                          size={18}
                        />
                      }
                      title="Design support"
                      value={`${designNeeded.length} ${
                        designNeeded.length ===
                        1
                          ? "job"
                          : "jobs"
                      }`}
                      description="NewJersey design support was requested for these jobs."
                    />
                  )}
                </div>

                {order.status ===
                  "awaiting-artwork" &&
                  pendingArtworkCount >
                    0 && (
                    <div className="mt-5 rounded-2xl bg-[#fff7f0] p-5">
                      <div className="flex gap-3">
                        <FileText
                          size={18}
                          className="mt-0.5 shrink-0 text-[#FF6B00]"
                        />

                        <div>
                          <p className="text-xs font-bold">
                            Artwork
                            upload is
                            required.
                          </p>

                          <p className="mt-1 text-[10px] leading-5 text-[#777]">
                            Upload
                            the
                            remaining{" "}
                            {
                              pendingArtworkCount
                            }{" "}
                            artwork{" "}
                            {pendingArtworkCount ===
                            1
                              ? "file"
                              : "files"}{" "}
                            above.
                            Once all
                            required
                            artwork is
                            received,
                            the job can
                            move into
                            review.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {artworkRecords.length >
                  0 &&
                  pendingArtworkCount ===
                    0 && (
                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="flex gap-3">
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <div>
                          <p className="text-xs font-bold text-emerald-800">
                            Artwork
                            received.
                          </p>

                          <p className="mt-1 text-[10px] leading-5 text-emerald-700/70">
                            All
                            required
                            customer
                            artwork
                            files have
                            been
                            uploaded.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </SectionCard>
            )}

            {/* CUSTOMER + DELIVERY */}

            <div className="grid gap-7 xl:grid-cols-2">
              <SectionCard>
                <SectionHeading
                  eyebrow="Customer"
                  title="Contact details"
                />

                <div className="mt-6 space-y-4">
                  <DetailRow
                    icon={
                      <UserRound
                        size={15}
                      />
                    }
                    label="Name"
                    value={
                      order.customer_full_name
                    }
                  />

                  <DetailRow
                    icon={
                      <Mail
                        size={15}
                      />
                    }
                    label="Email"
                    value={
                      order.customer_email
                    }
                  />

                  <DetailRow
                    icon={
                      <Phone
                        size={15}
                      />
                    }
                    label="Phone"
                    value={
                      order.customer_phone
                    }
                  />

                  {order.customer_organization && (
                    <DetailRow
                      icon={
                        <Building2
                          size={15}
                        />
                      }
                      label="Organisation"
                      value={
                        order.customer_organization
                      }
                    />
                  )}
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeading
                  eyebrow="Fulfilment"
                  title={
                    order.delivery_method ===
                    "delivery"
                      ? "Delivery"
                      : "Pickup"
                  }
                />

                <div className="mt-6 space-y-4">
                  <DetailRow
                    icon={
                      order.delivery_method ===
                      "delivery" ? (
                        <Truck
                          size={15}
                        />
                      ) : (
                        <Store
                          size={15}
                        />
                      )
                    }
                    label="Method"
                    value={
                      order.delivery_method ===
                      "delivery"
                        ? "Delivery"
                        : "Pickup"
                    }
                  />

                  {order.delivery_method ===
                    "delivery" && (
                    <>
                      <DetailRow
                        icon={
                          <MapPin
                            size={15}
                          />
                        }
                        label="Location"
                        value={[
                          order.delivery_city,
                          order.delivery_state,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            ", "
                          )}
                      />

                      <DetailRow
                        icon={
                          <MapPin
                            size={15}
                          />
                        }
                        label="Address"
                        value={
                          order.delivery_address ??
                          "—"
                        }
                      />

                      {order.delivery_landmark && (
                        <DetailRow
                          icon={
                            <MapPin
                              size={
                                15
                              }
                            />
                          }
                          label="Landmark"
                          value={
                            order.delivery_landmark
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* BRIEF */}

            <SectionCard>
              <SectionHeading
                eyebrow="Brief"
                title="Production brief"
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <DetailRow
                  icon={
                    <ReceiptText
                      size={15}
                    />
                  }
                  label="Project"
                  value={
                    order.project_name
                  }
                />

                <DetailRow
                  icon={
                    <CalendarDays
                      size={15}
                    />
                  }
                  label="Preferred deadline"
                  value={formatDate(
                    order.preferred_deadline
                  )}
                />
              </div>

              {order.production_instructions && (
                <div className="mt-6 rounded-2xl bg-[#f7f7f5] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999]">
                    Production
                    notes
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-[#555]">
                    {
                      order.production_instructions
                    }
                  </p>
                </div>
              )}
            </SectionCard>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-4 lg:sticky lg:top-8">
            <div className="rounded-[26px] border border-black/[0.06] bg-white p-6">
              <div className="flex items-center gap-2">
                <CircleDollarSign
                  size={16}
                  className="text-[#FF6B00]"
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#999]">
                  Order summary
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <PriceRow
                  label="Production"
                  value={formatNGN(
                    subtotal
                  )}
                />

                <PriceRow
                  label="Design"
                  value={
                    designFee > 0
                      ? formatNGN(
                          designFee
                        )
                      : designNeeded.length >
                          0
                        ? "Pending"
                        : formatNGN(
                            0
                          )
                  }
                />

                <PriceRow
                  label="Delivery"
                  value={
                    order.delivery_method ===
                    "pickup"
                      ? formatNGN(
                          0
                        )
                      : deliveryFee >
                          0
                        ? formatNGN(
                            deliveryFee
                          )
                        : "Pending"
                  }
                />
              </div>

              <div className="mt-6 border-t border-black/[0.07] pt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999]">
                      {finalTotal !==
                      null
                        ? "Final total"
                        : "Current estimate"}
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-[-0.04em]">
                      {formatNGN(
                        finalTotal ??
                          estimatedTotal
                      )}
                    </p>
                  </div>

                  {finalTotal !==
                    null && (
                    <CheckCircle2
                      size={20}
                      className="text-[#FF6B00]"
                    />
                  )}
                </div>

                {finalTotal ===
                  null && (
                  <p className="mt-3 text-[9px] leading-4 text-[#999]">
                    Final
                    pricing has
                    not been
                    confirmed
                    yet.
                  </p>
                )}
              </div>
            </div>

            {/* ARTWORK SIDEBAR */}

            {customerSuppliedArtwork.length >
              0 && (
              <div className="rounded-[26px] border border-black/[0.06] bg-white p-6">
                <div className="flex items-center gap-3">
                  <FileCheck2
                    size={18}
                    className="text-[#FF6B00]"
                  />

                  <div>
                    <p className="text-xs font-bold">
                      Artwork
                    </p>

                    <p className="mt-1 text-[9px] text-[#999]">
                      {
                        completedArtworkCount
                      }
                      /
                      {
                        artworkRecords.length
                      }{" "}
                      received
                    </p>
                  </div>
                </div>

                {artworkRecords.length >
                  0 && (
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eee]">
                    <div
                      className="h-full rounded-full bg-[#FF6B00] transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (completedArtworkCount /
                              artworkRecords.length) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                )}

                <p className="mt-4 text-[9px] leading-4 text-[#999]">
                  {pendingArtworkCount >
                  0
                    ? `${pendingArtworkCount} artwork file${
                        pendingArtworkCount ===
                        1
                          ? ""
                          : "s"
                      } still required.`
                    : "All required artwork has been received."}
                </p>
              </div>
            )}

            {/* STATUS */}

            <div className="rounded-[26px] bg-[#222] p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF8A33]">
                Current status
              </p>

              <h2 className="mt-3 text-lg font-bold">
                {formatStatus(
                  order.status
                )}
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-white/60">
                {getStatusDescription(
                  order.status
                )}
              </p>

              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2 text-[9px] text-white/40">
                  <Clock3
                    size={13}
                  />

                  Last updated{" "}
                  {formatDateTime(
                    order.updated_at
                  )}
                </div>
              </div>
            </div>

            {/* REFERENCE */}

            <div className="rounded-[26px] border border-black/[0.06] bg-white p-6">
              <div className="flex items-center gap-3">
                <PackageCheck
                  size={18}
                  className="text-[#FF6B00]"
                />

                <div>
                  <p className="text-xs font-bold">
                    Order
                    reference
                  </p>

                  <p className="mt-1 font-mono text-[11px] text-[#777]">
                    {
                      order.order_number
                    }
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[9px] leading-4 text-[#999]">
                Keep this
                reference when
                contacting
                NewJersey about
                this production
                job.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SectionCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 sm:p-7">
      {children}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#888]">
          {description}
        </p>
      )}
    </div>
  );
}

function TimelineCard({
  number,
  title,
  description,
  active = false,
  complete = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
  complete?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? "border-[#FF6B00]/30 bg-[#fff7f0]"
          : complete
            ? "border-black/[0.07] bg-[#f7f7f5]"
            : "border-black/[0.06] bg-white"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-xl text-[9px] font-bold ${
          complete
            ? "bg-[#222] text-white"
            : active
              ? "bg-[#FF6B00] text-white"
              : "bg-[#f2f2f0] text-[#999]"
        }`}
      >
        {complete ? (
          <Check size={14} />
        ) : (
          number
        )}
      </div>

      <p className="mt-4 text-xs font-bold">
        {title}
      </p>

      <p className="mt-1.5 text-[9px] leading-4 text-[#999]">
        {description}
      </p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f3] text-[#777]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#aaa]">
          {label}
        </p>

        <p className="mt-1 break-words text-xs font-semibold text-[#444]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function InfoPanel({
  icon,
  title,
  value,
  description,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f7f7f5] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#FF6B00]">
        {icon}
      </div>

      <p className="mt-4 text-xs font-bold">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-2 text-[9px] leading-4 text-[#999]">
        {description}
      </p>
    </div>
  );
}

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-[#777]">
        {label}
      </span>

      <span className="text-xs font-bold">
        {value}
      </span>
    </div>
  );
}
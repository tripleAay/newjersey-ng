import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FileImage } from "lucide-react";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import { reviewArtwork } from "./actions";
import ArtworkReviewHistory from "./ArtworkReviewHistory";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    status?: string | string[];
    page?: string | string[];
    error?: string | string[];
    saved?: string | string[];
  }>;
};

type OrderDetails = {
  order_number: string;
  customer_full_name: string | null;
  project_name: string | null;
  status: string;
};

const ADMIN_PATH = "/admin/artworks";
const PAGE_SIZE = 20;

const filters = [
  { value: "queue", label: "To review" },
  { value: "approved", label: "Approved" },
  { value: "revision-required", label: "Revisions requested" },
  { value: "pending", label: "Awaiting upload" },
  { value: "all", label: "All" },
];

const editableStatuses = [
  "uploaded",
  "reviewing",
  "approved",
  "revision-required",
];

const reviewableOrderStatuses = [
  "submitted",
  "under-review",
  "awaiting-artwork",
];

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
});

const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2";

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isFinite(date.getTime())
    ? dateFormatter.format(date)
    : "Date unavailable";
}

function formatFileSize(value: number | string | null) {
  const bytes = Number(value);

  if (!Number.isFinite(bytes) || bytes <= 0) return "";

  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.ceil(bytes / 1024)} KB`;
}

function pageHref(status: string, page = 1) {
  return `${ADMIN_PATH}?${new URLSearchParams({
    status,
    page: String(page),
  }).toString()}`;
}

export default async function AdminArtworksPage({
  searchParams,
}: Props) {
  const current = await requireAdmin();

  if (
    !["owner", "admin", "production"].includes(current.profile.role)
  ) {
    throw new Error("Artwork review access denied.");
  }

  const params = await searchParams;

  const status =
    typeof params.status === "string" &&
    filters.some((filter) => filter.value === params.status)
      ? params.status
      : "queue";

  const rawPage =
    typeof params.page === "string" ? Number(params.page) : 1;

  const page =
    Number.isSafeInteger(rawPage) &&
    rawPage >= 1 &&
    rawPage <= 100000
      ? rawPage
      : 1;

  const errorMessage =
    typeof params.error === "string"
      ? params.error.slice(0, 500)
      : "";

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("order_artworks")
    .select(
      "id, order_id, order_item_id, status, file_name, file_size, storage_path, notes, updated_at",
      { count: "exact" }
    );

  if (status === "queue") {
    query = query.in("status", ["uploaded", "reviewing"]);
  } else if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (error) {
    console.error("[Admin artworks]", error);
    throw new Error("Unable to load customer artwork.");
  }

  const artworks = data ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (page > totalPages) {
    redirect(pageHref(status, totalPages));
  }

  const orderIds = [
    ...new Set(artworks.map((artwork) => artwork.order_id)),
  ];

  const itemIds = [
    ...new Set(
      artworks
        .map((artwork) => artwork.order_item_id)
        .filter((id): id is string => typeof id === "string")
    ),
  ];

  const orders = new Map<string, OrderDetails>();
  const itemNames = new Map<string, string>();

  if (orderIds.length > 0) {
    const { data: rows, error: lookupError } = await supabase
      .from("orders")
      .select(
        "id, order_number, customer_full_name, project_name, status"
      )
      .in("id", orderIds);

    if (lookupError) {
      console.error("[Artwork orders]", lookupError);
      throw new Error("Unable to load artwork orders.");
    }

    for (const row of rows ?? []) {
      orders.set(row.id, row);
    }
  }

  if (itemIds.length > 0) {
    const { data: rows, error: lookupError } = await supabase
      .from("order_items")
      .select("id, product_name")
      .in("id", itemIds);

    if (lookupError) {
      console.error("[Artwork products]", lookupError);
      throw new Error("Unable to load artwork products.");
    }

    for (const row of rows ?? []) {
      itemNames.set(row.id, row.product_name);
    }
  }

  return (
    <main className="min-w-0 p-4 text-[#181818] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Customer artwork
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
          Review customer files, update feedback and retain
          a record of every admin change.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800"
          >
            {errorMessage}
          </p>
        )}

        {params.saved === "1" && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-[#F58220]/25 bg-[#F58220]/10 p-4 text-sm"
          >
            Artwork update saved.
          </p>
        )}

        <nav
          aria-label="Artwork filters"
          className="mt-6 flex flex-wrap gap-2"
        >
          {filters.map((filter) => (
            <Link
              key={filter.value}
              href={pageHref(filter.value)}
              aria-current={
                status === filter.value ? "page" : undefined
              }
              className={`${buttonClass} border ${
                status === filter.value
                  ? "border-[#F58220] bg-[#F58220]/10"
                  : "border-black/10 bg-white hover:border-[#F58220]"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </nav>

        <p className="mt-5 text-sm text-neutral-500">
          {total} {total === 1 ? "record" : "records"}
        </p>

        <div className="mt-4 space-y-5">
          {artworks.length === 0 ? (
            <section className="rounded-xl border border-black/10 bg-white px-6 py-12 text-center">
              <FileImage
                size={28}
                aria-hidden="true"
                className="mx-auto text-[#F58220]"
              />
              <h2 className="mt-4 text-lg font-semibold">
                No artwork in this view.
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Select another filter to view other records.
              </p>
            </section>
          ) : (
            artworks.map((artwork) => {
              const order = orders.get(artwork.order_id);

              const productName =
                typeof artwork.order_item_id === "string"
                  ? itemNames.get(artwork.order_item_id)
                  : undefined;

              const canEdit =
                Boolean(order && artwork.storage_path) &&
                editableStatuses.includes(artwork.status);

              const canChangeStatus =
                canEdit &&
                Boolean(
                  order &&
                    reviewableOrderStatuses.includes(order.status)
                );

              const size = formatFileSize(artwork.file_size);

              return (
                <section
                  key={artwork.id}
                  className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="break-all text-xs font-medium text-neutral-500">
                        {order?.order_number || "Order unavailable"}
                      </p>

                      <h2 className="mt-2 text-lg font-semibold">
                        {productName || "Order artwork"}
                      </h2>

                      <p className="mt-2 text-sm text-neutral-600">
                        {order?.customer_full_name || "Customer"}
                      </p>

                      {order?.project_name && (
                        <p className="mt-1 text-sm text-neutral-500">
                          {order.project_name}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-[#F58220]/10 px-3 py-1.5 text-xs font-medium capitalize">
                      {artwork.status.replaceAll("-", " ")}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl bg-[#F6F6F3] p-4">
                    <p className="break-all text-sm font-medium">
                      {artwork.file_name || "No file uploaded yet"}
                    </p>

                    <p className="mt-1 text-xs leading-6 text-neutral-500">
                      {size ? `${size} · ` : ""}
                      Updated {formatDate(artwork.updated_at)}
                    </p>

                    {artwork.storage_path && (
                      <a
                        href={`/api/admin/artwork/${artwork.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${buttonClass} mt-3 border border-black/15 bg-white hover:border-[#F58220]`}
                      >
                        <Download size={16} aria-hidden="true" />
                        Download artwork
                      </a>
                    )}
                  </div>

                  {canEdit ? (
                    <form
                      key={`${artwork.id}:${artwork.updated_at}`}
                      action={reviewArtwork}
                      className="mt-5"
                    >
                      <input
                        type="hidden"
                        name="artworkId"
                        value={artwork.id}
                      />

                      <input
                        type="hidden"
                        name="expectedUpdatedAt"
                        value={artwork.updated_at}
                      />

                      <input
                        type="hidden"
                        name="returnStatus"
                        value={status}
                      />

                      <label className="block text-sm font-medium">
                        Customer feedback
                        <textarea
                          name="notes"
                          rows={4}
                          maxLength={3000}
                          defaultValue={artwork.notes ?? ""}
                          placeholder="Write clear feedback for the customer."
                          className="mt-2 block w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                        />
                      </label>

                      <p className="mt-2 text-xs leading-6 text-neutral-500">
                        Save feedback keeps the current status.
                        Previous feedback is retained in history.
                        Changes notify the customer.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          name="decision"
                          value="feedback"
                          className={`${buttonClass} border border-black/15 hover:border-[#F58220]`}
                        >
                          Save feedback
                        </button>

                        {canChangeStatus &&
                          artwork.status === "uploaded" && (
                            <button
                              type="submit"
                              name="decision"
                              value="reviewing"
                              className={`${buttonClass} border border-black/15 hover:bg-neutral-50`}
                            >
                              Start review
                            </button>
                          )}

                        {canChangeStatus &&
                          ["uploaded", "reviewing"].includes(
                            artwork.status
                          ) && (
                            <button
                              type="submit"
                              name="decision"
                              value="approved"
                              className={`${buttonClass} bg-[#F58220] hover:bg-[#D96B0D]`}
                            >
                              Approve artwork
                            </button>
                          )}

                        {canChangeStatus &&
                          ["uploaded", "reviewing", "approved"].includes(
                            artwork.status
                          ) && (
                            <button
                              type="submit"
                              name="decision"
                              value="revision-required"
                              className={`${buttonClass} border border-black/15 hover:border-[#F58220]`}
                            >
                              Request revision
                            </button>
                          )}
                      </div>

                      {artwork.status === "approved" &&
                        canChangeStatus && (
                          <p className="mt-3 text-xs leading-6 text-neutral-500">
                            Request revision withdraws this artwork’s
                            approval and allows a corrected upload.
                          </p>
                        )}

                      {!canChangeStatus && (
                        <p className="mt-3 text-xs leading-6 text-neutral-500">
                          Feedback can be updated, but status changes
                          are closed for this order.
                        </p>
                      )}
                    </form>
                  ) : (
                    artwork.notes && (
                      <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-600">
                        {artwork.notes}
                      </p>
                    )
                  )}

                  <ArtworkReviewHistory artworkId={artwork.id} />
                </section>
              );
            })
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={pageHref(status, page - 1)}
                className={`${buttonClass} border border-black/10 bg-white`}
              >
                Previous
              </Link>
            )}

            {page < totalPages && (
              <Link
                href={pageHref(status, page + 1)}
                className={`${buttonClass} border border-black/10 bg-white`}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
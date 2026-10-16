"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const ADMIN_PATH = "/admin/artworks";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const REVIEW_ROLES = ["owner", "admin", "production"];

const REVIEWABLE_ORDER_STATUSES = [
  "submitted",
  "under-review",
  "awaiting-artwork",
];

function fail(message: string): never {
  redirect(
    `${ADMIN_PATH}?error=${encodeURIComponent(message)}`
  );
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

export async function reviewArtwork(
  formData: FormData
): Promise<void> {
  const current = await requireAdmin();

  if (!REVIEW_ROLES.includes(current.profile.role)) {
    fail("You do not have permission to review artwork.");
  }

  const artworkId = readText(formData, "artworkId");
  const expectedUpdatedAt = readText(
    formData,
    "expectedUpdatedAt"
  );
  const decision = readText(formData, "decision");
  const notes = readText(formData, "notes");

  if (
    !UUID.test(artworkId) ||
    !expectedUpdatedAt ||
    !Number.isFinite(Date.parse(expectedUpdatedAt))
  ) {
    fail("Invalid artwork review request.");
  }

  if (
    !["reviewing", "approved", "revision-required"].includes(
      decision
    )
  ) {
    fail("Choose a valid review action.");
  }

  if (notes.length > 3000) {
    fail("Keep review notes within 3,000 characters.");
  }

  if (decision === "revision-required" && !notes) {
    fail("Explain what the customer needs to change.");
  }

  const supabase = getSupabaseAdmin();

  const {
    data: artwork,
    error: artworkError,
  } = await supabase
    .from("order_artworks")
    .select(
      "id, order_id, status, storage_path, updated_at"
    )
    .eq("id", artworkId)
    .maybeSingle();

  if (artworkError) {
    console.error(
      "[NewJersey artwork review lookup]",
      artworkError
    );

    fail("Unable to load this artwork. Please try again.");
  }

  if (!artwork) {
    fail("Artwork record not found.");
  }

  if (!artwork.storage_path) {
    fail("An uploaded file is required before review.");
  }

  if (!["uploaded", "reviewing"].includes(artwork.status)) {
    fail(
      "This artwork is no longer available for review. Refresh the page."
    );
  }

  if (artwork.updated_at !== expectedUpdatedAt) {
    fail(
      "This artwork changed after you opened the page. Refresh before reviewing."
    );
  }

  if (
    decision === "reviewing" &&
    artwork.status !== "uploaded"
  ) {
    fail("This artwork is already being reviewed.");
  }

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", artwork.order_id)
    .maybeSingle();

  if (orderError) {
    console.error(
      "[NewJersey artwork review order]",
      orderError
    );

    fail("Unable to check the order. Please try again.");
  }

  if (
    !order ||
    !REVIEWABLE_ORDER_STATUSES.includes(order.status)
  ) {
    fail("Artwork review is closed for this order.");
  }

  // Save only if the artwork has not changed since
  // the admin opened the review form.
  const {
    data: saved,
    error: saveError,
  } = await supabase
    .from("order_artworks")
    .update({
      status: decision,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", artwork.id)
    .eq("order_id", order.id)
    .eq("status", artwork.status)
    .eq("updated_at", expectedUpdatedAt)
    .select("id")
    .maybeSingle();

  if (saveError) {
    console.error(
      "[NewJersey artwork review save]",
      saveError
    );

    fail(
      "The review could not be confirmed. Refresh to check its status before trying again."
    );
  }

  if (!saved) {
    fail(
      "Another update changed this artwork. Refresh before reviewing."
    );
  }

  revalidatePath(ADMIN_PATH);
  revalidatePath(`/shop/artwork/${order.id}`);

  redirect(`${ADMIN_PATH}?saved=1`);
}
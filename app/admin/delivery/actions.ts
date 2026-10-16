"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const PATH = "/admin/delivery";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function read(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function fail(message: string): never {
  redirect(`${PATH}?error=${encodeURIComponent(message)}`);
}

export async function updateFulfillment(
  formData: FormData
): Promise<void> {
  const current = await requireAdmin();

  if (
    !["owner", "admin", "production"].includes(
      current.profile.role
    )
  ) {
    fail("Fulfillment access is not permitted.");
  }

  const orderId = read(formData, "orderId");
  const expectedUpdatedAt = read(formData, "expectedUpdatedAt");
  const nextStatus = read(formData, "nextStatus");
  const carrier = read(formData, "carrier");
  const tracking = read(formData, "trackingReference");
  const notes = read(formData, "notes");

  if (
    !UUID.test(orderId) ||
    !expectedUpdatedAt ||
    !Number.isFinite(Date.parse(expectedUpdatedAt)) ||
    !["dispatched", "completed"].includes(nextStatus)
  ) {
    fail("Invalid fulfillment update.");
  }

  if (
    carrier.length > 160 ||
    tracking.length > 160 ||
    notes.length > 2000
  ) {
    fail(
      "Keep carrier and reference within 160 characters and notes within 2,000."
    );
  }

  if (formData.get("handoverConfirmed") !== "on") {
    fail("Confirm that the handover or delivery has taken place.");
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.rpc(
    "update_order_fulfillment",
    {
      p_order_id: orderId,
      p_admin_id: current.user.id,
      p_expected_updated_at: expectedUpdatedAt,
      p_next_status: nextStatus,
      p_carrier: carrier,
      p_tracking_reference: tracking,
      p_notes: notes,
    }
  );

  if (error) {
    console.error("[Fulfillment update]", error);

    const messages = [
      "Fulfillment access is not permitted.",
      "Choose a valid fulfillment action.",
      "Keep carrier and reference within 160 characters and notes within 2,000.",
      "Order not found.",
      "This order changed. Refresh before continuing.",
      "This fulfillment action is no longer available.",
      "Enter the courier or delivery provider.",
      "A matching verified payment is required.",
    ];

    fail(
      messages.includes(error.message)
        ? error.message
        : "The update could not be confirmed. Refresh to check the order."
    );
  }

  revalidatePath(PATH);
  revalidatePath("/admin");
  revalidatePath("/admin/production");
  revalidatePath("/admin/orders", "layout");
  revalidatePath("/shop/order");
  revalidatePath(`/shop/order/${orderId}`);

  redirect(`${PATH}?status=${nextStatus}&saved=1`);
}
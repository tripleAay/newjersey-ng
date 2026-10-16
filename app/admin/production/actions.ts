"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const PATH = "/admin/production";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function read(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function fail(message: string): never {
  redirect(`${PATH}?error=${encodeURIComponent(message)}`);
}

export async function updateProduction(
  formData: FormData
): Promise<void> {
  const current = await requireAdmin();

  if (
    !["owner", "admin", "production"].includes(
      current.profile.role
    )
  ) {
    fail("Production access is not permitted.");
  }

  const orderId = read(formData, "orderId");
  const expectedUpdatedAt = read(formData, "expectedUpdatedAt");
  const nextStatus = read(formData, "nextStatus");
  const notes = read(formData, "notes");

  if (
    !UUID.test(orderId) ||
    !expectedUpdatedAt ||
    !Number.isFinite(Date.parse(expectedUpdatedAt)) ||
    !["in-production", "ready"].includes(nextStatus)
  ) {
    fail("Invalid production update.");
  }

  if (notes.length > 2000) {
    fail("Keep notes within 2,000 characters.");
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.rpc(
    "update_order_production",
    {
      p_order_id: orderId,
      p_admin_id: current.user.id,
      p_expected_updated_at: expectedUpdatedAt,
      p_next_status: nextStatus,
      p_notes: notes,
    }
  );

  if (error) {
    console.error("[Production update]", error);

    const messages = [
      "Production access is not permitted.",
      "Choose a valid production action.",
      "Keep notes within 2,000 characters.",
      "Order not found.",
      "This order changed. Refresh before continuing.",
      "This production action is no longer available.",
      "Confirmed pricing and a customer account are required.",
      "A matching verified payment is required.",
      "This order has no production items.",
      "All required artwork must be approved.",
    ];

    fail(
      messages.includes(error.message)
        ? error.message
        : "The update could not be confirmed. Refresh to check the order."
    );
  }

  revalidatePath(PATH);
  revalidatePath("/admin");
  revalidatePath("/admin/orders", "layout");
  revalidatePath("/shop/order");
  revalidatePath(`/shop/order/${orderId}`);
  revalidatePath(`/shop/artwork/${orderId}`);

  const status =
    nextStatus === "in-production" ? "in-production" : "ready";

  redirect(`${PATH}?status=${status}&saved=1`);
}
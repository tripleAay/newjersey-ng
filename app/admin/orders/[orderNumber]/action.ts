"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function confirmOrderPricing(
  formData: FormData
): Promise<void> {
  const current = await requireStoreAdmin();

  const orderId = text(formData, "orderId");

  if (!UUID.test(orderId)) {
    redirect("/admin/orders");
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: lookupError } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("id", orderId)
    .maybeSingle();

  if (lookupError || !order) {
    console.error("[Final pricing lookup]", lookupError);
    redirect("/admin/orders");
  }

  const path =
    `/admin/orders/${encodeURIComponent(order.order_number)}`;

  function fail(message: string): never {
    redirect(`${path}?error=${encodeURIComponent(message)}`);
  }

  const expectedUpdatedAt = text(
    formData,
    "expectedUpdatedAt"
  );

  const rawFee = text(formData, "deliveryFee");
  const deliveryFee = Number(rawFee);
  const notes = text(formData, "notes");

  if (
    !expectedUpdatedAt ||
    !Number.isFinite(Date.parse(expectedUpdatedAt))
  ) {
    fail("Invalid order version. Refresh the page.");
  }

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(rawFee) ||
    !Number.isFinite(deliveryFee) ||
    deliveryFee < 0 ||
    deliveryFee > 9999999999
  ) {
    fail("Enter a valid delivery fee, such as 2500 or 0.");
  }

  if (notes.length > 3000) {
    fail("Keep pricing notes within 3,000 characters.");
  }

  const { error } = await supabase.rpc(
    "confirm_order_pricing",
    {
      p_order_id: order.id,
      p_admin_id: current.user.id,
      p_expected_updated_at: expectedUpdatedAt,
      p_delivery_fee: deliveryFee,
      p_notes: notes || null,
    }
  );

  if (error) {
    console.error("[Confirm final pricing]", error);

    const messages = new Set([
      "Order changed. Refresh before confirming",
      "Pricing cannot be confirmed in this order status",
      "Final pricing has already been confirmed",
      "This order must be linked to a customer account",
      "Pickup orders must have a zero delivery fee",
      "This order has no items",
      "Every item needs approved artwork before final pricing",
      "Resolve all artwork requests before final pricing",
      "Order and item totals differ. Review pricing before continuing",
    ]);

    fail(
      messages.has(error.message)
        ? error.message
        : "Pricing could not be confirmed. Refresh to check the order before trying again."
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(path);
  revalidatePath(`/shop/artwork/${order.id}`);

  redirect(`${path}?saved=1`);
}
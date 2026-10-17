"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function read(form: FormData, name: string): string {
  const value = form.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function confirmOrderPricing(
  form: FormData
): Promise<void> {
  const current = await requireStoreAdmin();
  const orderId = read(form, "orderId");

  if (!UUID.test(orderId)) {
    fail("/admin/orders", "Invalid order reference.");
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) {
    console.error("[Pricing order lookup]", orderError);
    fail("/admin/orders", "Unable to load this order.");
  }

  if (!order) {
    fail("/admin/orders", "Order not found.");
  }

  const path =
    `/admin/orders/${encodeURIComponent(order.order_number)}`;

  const expectedUpdatedAt = read(form, "expectedUpdatedAt");
  const rawDeliveryFee = read(form, "deliveryFee");
  const notes = read(form, "notes");

  if (
    !expectedUpdatedAt ||
    !Number.isFinite(Date.parse(expectedUpdatedAt))
  ) {
    fail(path, "Refresh the order before confirming pricing.");
  }

  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(rawDeliveryFee)) {
    fail(
      path,
      "Enter a valid delivery fee, such as 2500 or 0."
    );
  }

  const deliveryFee = Number(rawDeliveryFee);

  if (
    !Number.isFinite(deliveryFee) ||
    deliveryFee < 0 ||
    deliveryFee > 9999999999
  ) {
    fail(path, "Enter a valid delivery fee.");
  }

  if (notes.length > 3000) {
    fail(path, "Keep pricing notes within 3,000 characters.");
  }

  const { error } = await supabase.rpc(
    "confirm_order_pricing_with_specs",
    {
      p_order_id: order.id,
      p_admin_id: current.user.id,
      p_expected_updated_at: expectedUpdatedAt,
      p_delivery_fee: deliveryFee,
      p_notes: notes,
      p_approve_jerseys:
        form.get("approveJerseys") === "on",
    }
  );

  if (error) {
    console.error("[Confirm order pricing]", error);

    const knownMessages = [
      "Order not found",
      "Order changed. Refresh before confirming",
      "Only owners and admins can confirm pricing",
      "Enter a valid delivery fee",
      "Pricing cannot be confirmed in this order status",
      "Final pricing has already been confirmed",
      "This order must be linked to a customer account",
      "Pickup orders must have a zero delivery fee",
      "This order has no items",
      "Approve jersey specifications before final pricing",
      "Confirm that you have reviewed the jersey specifications",
      "Every print item needs approved artwork before final pricing",
      "Resolve all artwork requests before final pricing",
      "Order and item totals differ. Review pricing before continuing",
      "The final total must be greater than zero",
    ];

    fail(
      path,
      knownMessages.includes(error.message)
        ? error.message
        : "Pricing could not be confirmed. Refresh the order and try again."
    );
  }

  for (const route of [
    "/admin",
    "/admin/orders",
    path,
    "/admin/artworks",
    "/shop/order",
    `/shop/order/${order.id}`,
    `/shop/order/${order.id}/payment`,
    `/shop/artwork/${order.id}`,
  ]) {
    revalidatePath(route);
  }

  redirect(`${path}?saved=1`);
}
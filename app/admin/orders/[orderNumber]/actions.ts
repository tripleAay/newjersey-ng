"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function read(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function confirmOrderPricing(
  formData: FormData
): Promise<void> {
  const current = await requireStoreAdmin();

  const orderId = read(formData, "orderId");

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

  const expectedUpdatedAt = read(
    formData,
    "expectedUpdatedAt"
  );

  const rawDeliveryFee = read(formData, "deliveryFee");
  const notes = read(formData, "notes");

  if (
    !expectedUpdatedAt ||
    !Number.isFinite(Date.parse(expectedUpdatedAt))
  ) {
    fail(path, "Refresh the order before confirming pricing.");
  }

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(rawDeliveryFee)
  ) {
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
    "confirm_order_pricing",
    {
      p_order_id: order.id,
      p_admin_id: current.user.id,
      p_expected_updated_at: expectedUpdatedAt,
      p_delivery_fee: deliveryFee,
      p_notes: notes,
    }
  );

  if (error) {
    console.error("[Confirm order pricing]", error);

    fail(
      path,
      "Pricing could not be confirmed. Refresh the order, check that all required artwork is approved, and try again."
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(path);
  revalidatePath("/admin/artworks");
  revalidatePath("/shop/order");
  revalidatePath(`/shop/order/${order.id}`);
  revalidatePath(`/shop/order/${order.id}/payment`);
  revalidatePath(`/shop/artwork/${order.id}`);

  redirect(`${path}?saved=1`);
}
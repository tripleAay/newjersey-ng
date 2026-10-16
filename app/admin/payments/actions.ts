"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const PATH = "/admin/payments";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(message: string): never {
  redirect(`${PATH}?error=${encodeURIComponent(message)}`);
}

function read(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

export async function reviewPayment(
  formData: FormData
): Promise<void> {
  const current = await requireStoreAdmin();

  const paymentId = read(formData, "paymentId");
  const decision = read(formData, "decision");
  const notes = read(formData, "notes");

  if (!UUID.test(paymentId)) {
    fail("Invalid payment reference.");
  }

  if (!["verified", "rejected"].includes(decision)) {
    fail("Choose a valid payment decision.");
  }

  if (notes.length > 2000) {
    fail("Keep review notes within 2,000 characters.");
  }

  if (decision === "rejected" && !notes) {
    fail("Explain why the payment was rejected.");
  }

  if (
    decision === "verified" &&
    formData.get("bankCreditChecked") !== "on"
  ) {
    fail(
      "Confirm that you checked the credit in your bank account."
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: orderId, error } = await supabase.rpc(
    "review_bank_transfer",
    {
      p_payment_id: paymentId,
      p_admin_id: current.user.id,
      p_decision: decision,
      p_notes: notes,
    }
  );

  if (error) {
    console.error("[Bank transfer review]", error);

    const knownMessages = [
      "Payment review is not permitted.",
      "Choose a valid payment decision.",
      "Keep review notes within 2,000 characters.",
      "Explain why the payment was rejected.",
      "Payment not found.",
      "Order not found.",
      "This payment is no longer awaiting review.",
      "The order status, customer or total no longer matches this payment.",
      "Payment evidence is required.",
    ];

    fail(
      knownMessages.includes(error.message)
        ? error.message
        : "The decision could not be confirmed. Refresh to check the payment status."
    );
  }

  revalidatePath(PATH);
  revalidatePath("/admin/orders", "layout");
  revalidatePath("/shop/order");

  if (typeof orderId === "string" && UUID.test(orderId)) {
    revalidatePath(`/shop/order/${orderId}`);
    revalidatePath(`/shop/order/${orderId}/payment`);
  }

  redirect(`${PATH}?saved=1`);
}
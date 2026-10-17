"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function startBankTransfer(
  formData: FormData
): Promise<void> {
  const orderId = formData.get("orderId");

  if (
    typeof orderId !== "string" ||
    !UUID.test(orderId)
  ) {
    redirect("/shop/order");
  }

  const path = `/shop/order/${orderId}/payment`;

  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    redirect(`/login?next=${encodeURIComponent(path)}`);
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.rpc(
    "start_bank_transfer",
    {
      p_order_id: orderId,
      p_customer_id: user.id,
    }
  );

  if (error) {
    console.error("[Start bank transfer]", error);

    const knownMessages = [
      "Order not found.",
      "This order is not available for payment.",
      "Bank transfer is currently unavailable.",
    ];

    const message = knownMessages.includes(error.message)
      ? error.message
      : "Payment instructions could not be created. Refresh the page before trying again.";

    redirect(
      `${path}?error=${encodeURIComponent(message)}`
    );
  }

  revalidatePath(path);

  redirect(path);
}
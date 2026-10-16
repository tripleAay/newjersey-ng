"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const PATH = "/admin/settings/payments";

function fail(message: string): never {
  redirect(`${PATH}?error=${encodeURIComponent(message)}`);
}

function read(form: FormData, name: string) {
  const value = form.get(name);

  return typeof value === "string" ? value.trim() : "";
}

export async function savePaymentSettings(
  formData: FormData
): Promise<void> {
  const current = await requireStoreAdmin();

  const bankName = read(formData, "bankName");
  const accountName = read(formData, "accountName");
  const accountNumber = read(formData, "accountNumber");
  const instructions = read(formData, "instructions");
  const expectedUpdatedAt = read(
    formData,
    "expectedUpdatedAt"
  );

  if (!bankName || bankName.length > 100) {
    fail("Enter a bank name of up to 100 characters.");
  }

  if (!accountName || accountName.length > 160) {
    fail("Enter an account name of up to 160 characters.");
  }

  if (!/^[0-9]{10}$/.test(accountNumber)) {
    fail("Enter a 10-digit account number.");
  }

  if (instructions.length > 2000) {
    fail("Keep payment instructions within 2,000 characters.");
  }

  if (
    !expectedUpdatedAt ||
    !Number.isFinite(Date.parse(expectedUpdatedAt))
  ) {
    fail("Refresh this page before saving.");
  }

  const supabase = getSupabaseAdmin();

  const { data: saved, error } = await supabase
    .from("store_payment_settings")
    .update({
      enabled: formData.get("enabled") === "on",
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNumber,
      instructions,
      updated_by: current.user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "bank-transfer")
    .eq("updated_at", expectedUpdatedAt)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[Payment settings save]", error);
    fail("Payment settings could not be saved.");
  }

  if (!saved) {
    fail(
      "These settings changed while you were editing. Refresh and try again."
    );
  }

  revalidatePath(PATH);
  revalidatePath("/shop/order", "layout");

  redirect(`${PATH}?saved=1`);
}
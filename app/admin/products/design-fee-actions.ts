"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export async function updateProductDesignFee(formData: FormData) {
  await requireStoreAdmin();

  const idValue = formData.get("product_id");
  const feeValue = formData.get("design_fee");

  if (
    typeof idValue !== "string" ||
    !/^[1-9]\d*$/.test(idValue) ||
    idValue.length > 19 ||
    BigInt(idValue) > 9223372036854775807n
  ) {
    throw new Error("Invalid product ID.");
  }

  const id = idValue;
  const productPath = `/admin/products/${id}`;

  function fail(message: string): never {
    redirect(
      `${productPath}?error=${encodeURIComponent(message)}`
    );
  }

  if (typeof feeValue !== "string") {
    fail("Enter a valid design fee.");
  }

  const rawFee = feeValue.trim();
  let designFee: number | null = null;

  if (rawFee !== "") {
    const amount = Number(rawFee);

    if (
      !/^\d+(?:\.\d{1,2})?$/.test(rawFee) ||
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount > 9999999999
    ) {
      fail(
        "Use an amount without commas or currency symbols, such as 10000."
      );
    }

    designFee = Math.round(amount * 100) / 100;
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("products")
    .update({
      design_fee: designFee,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[NewJersey Update Design Fee]", error);
    fail("Unable to save the design fee. Check the terminal.");
  }

  if (!data) {
    fail("This product could not be found.");
  }

  revalidatePath(productPath);
  revalidatePath("/admin/products");
  revalidatePath("/shop", "layout");

  redirect(`${productPath}?saved=design-fee`);
}
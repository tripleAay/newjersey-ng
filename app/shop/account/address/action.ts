"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/newjersey/supabase/server";

export async function saveAddress(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=%2Fshop%2Faccount%2Faddress");
  }

  const read = (key: string) =>
    String(formData.get(key) ?? "").trim();

  const address = {
    recipient_name: read("recipient_name"),
    phone: read("phone"),
    address_line_1: read("address_line_1"),
    address_line_2: read("address_line_2"),
    city: read("city"),
    region: read("region"),
    postal_code: read("postal_code"),
    country_code: read("country_code").toUpperCase(),
  };

  const required = [
    address.recipient_name,
    address.phone,
    address.address_line_1,
    address.city,
    address.region,
  ];

  if (
    required.some((value) => !value) ||
    Object.values(address).some(
      (value) =>
        value.length > 200 ||
        /[\u0000-\u001F\u007F]/.test(value)
    ) ||
    address.recipient_name.length > 120 ||
    address.postal_code.length > 20 ||
    !/^[A-Z]{2}$/.test(address.country_code)
  ) {
    redirect("/shop/account/address?error=details");
  }

  const phoneDigits = address.phone.replace(/\D/g, "");

  if (
    address.phone.length > 30 ||
    !/^\+?[0-9 ()-]+$/.test(address.phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    redirect("/shop/account/address?error=phone");
  }

  const { error } = await supabase
    .from("customer_delivery_addresses")
    .upsert(
      {
        user_id: user.id,
        ...address,
        address_line_2: address.address_line_2 || null,
        postal_code: address.postal_code || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("[NewJersey Save Address]", error);
    redirect("/shop/account/address?error=save");
  }

  revalidatePath("/shop/account/address");
  redirect("/shop/account/address?saved=1");
}

export async function deleteAddress() {
  const supabase = await createClient();
  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=%2Fshop%2Faccount%2Faddress");
  }

  const { error } = await supabase
    .from("customer_delivery_addresses")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("[NewJersey Delete Address]", error);
    redirect("/shop/account/address?error=delete");
  }

  revalidatePath("/shop/account/address");
  redirect("/shop/account/address?removed=1");
}
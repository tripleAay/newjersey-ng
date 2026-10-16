"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/newjersey/supabase/server";

const ADDRESS_PATH = "/shop/account/address";
const LOGIN_PATH = "/login?next=%2Fshop%2Faccount%2Faddress";

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveAddress(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(LOGIN_PATH);
  }

  const address = {
    recipient_name: readText(formData, "recipient_name"),
    phone: readText(formData, "phone"),
    address_line_1: readText(formData, "address_line_1"),
    address_line_2: readText(formData, "address_line_2"),
    city: readText(formData, "city"),
    region: readText(formData, "region"),
    postal_code: readText(formData, "postal_code"),
    country_code: readText(formData, "country_code").toUpperCase(),
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
    redirect(`${ADDRESS_PATH}?error=details`);
  }

  const phoneDigits = address.phone.replace(/\D/g, "");

  if (
    address.phone.length > 30 ||
    !/^\+?[0-9 ()-]+$/.test(address.phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    redirect(`${ADDRESS_PATH}?error=phone`);
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
    redirect(`${ADDRESS_PATH}?error=save`);
  }

  revalidatePath(ADDRESS_PATH);
  redirect(`${ADDRESS_PATH}?saved=1`);
}

export async function deleteAddress(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(LOGIN_PATH);
  }

  const { error } = await supabase
    .from("customer_delivery_addresses")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("[NewJersey Delete Address]", error);
    redirect(`${ADDRESS_PATH}?error=delete`);
  }

  revalidatePath(ADDRESS_PATH);
  redirect(`${ADDRESS_PATH}?removed=1`);
}
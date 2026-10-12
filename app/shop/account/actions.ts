"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/newjersey/supabase/server";

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    redirect("/shop/account?error=signout");
  }

  revalidatePath("/", "layout");
  redirect("/shop");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?next=%2Fshop%2Faccount%2Fedit");
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const contactPhone = String(formData.get("contact_phone") ?? "").trim();

  if (
    fullName.length < 2 ||
    fullName.length > 120 ||
    /[\u0000-\u001F\u007F]/.test(fullName)
  ) {
    redirect("/shop/account/edit?error=name");
  }

  if (
    contactPhone &&
    (
      contactPhone.length > 30 ||
      !/^\+?[0-9 ()-]+$/.test(contactPhone) ||
      contactPhone.replace(/\D/g, "").length < 7 ||
      contactPhone.replace(/\D/g, "").length > 15
    )
  ) {
    redirect("/shop/account/edit?error=phone");
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      contact_phone: contactPhone || null,
    },
  });

  if (error) {
    console.error("[NewJersey Update Profile]", error);
    redirect("/shop/account/edit?error=save");
  }

  revalidatePath("/shop/account");
  revalidatePath("/shop/account/edit");

  redirect("/shop/account/edit?saved=1");
}
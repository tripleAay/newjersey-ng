"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/newjersey/supabase/server";

export async function signOut(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    console.error("[NewJersey Sign Out]", error);
    redirect("/shop/account?error=signout");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
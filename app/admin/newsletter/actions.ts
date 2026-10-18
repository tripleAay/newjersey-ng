"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
export async function suppressSubscriber(form: FormData) {
  const current = await requireStoreAdmin();
  const id = form.get("id");
  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    redirect("/admin/newsletter?error=1");
  const { data, error } = await getSupabaseAdmin()
    .from("newsletter_subscribers")
    .update({
      status: "suppressed",
      suppressed_by: current.user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) redirect("/admin/newsletter?error=1");
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter?saved=1");
}

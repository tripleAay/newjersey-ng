"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { UUID } from "@/app/lib/newjersey/design/model";
export async function quoteDesign(form: FormData): Promise<void> {
  const admin = await requireStoreAdmin();
  const id = String(form.get("id") || "");
  if (!UUID.test(id)) redirect("/admin/design");
  const path = "/admin/design/" + id;
  const amount = String(form.get("amount") || "");
  const revisions = String(form.get("revisions") || "");
  if (!/^\d+(\.\d{1,2})?$/.test(amount) || !/^\d+$/.test(revisions))
    redirect(path + "?error=Check%20the%20price%20and%20revision%20allowance.");
  const { error } = await getSupabaseAdmin().rpc("quote_design_project", {
    p_order_id: id,
    p_admin_id: admin.user.id,
    p_expected: String(form.get("expected") || ""),
    p_amount: Number(amount),
    p_scope: String(form.get("scope") || ""),
    p_due: String(form.get("due") || ""),
    p_revisions: Number(revisions),
  });
  if (error) {
    console.error("[Design quote]", error);
    redirect(
      path +
        "?error=Quote%20not%20saved.%20Refresh%20and%20check%20all%20fields.",
    );
  }
  revalidatePath("/admin/design");
  revalidatePath(path);
  revalidatePath("/shop/design/" + id);
  redirect(path + "?saved=1");
}

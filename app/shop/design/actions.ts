"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { designCustomer } from "@/app/lib/newjersey/design/load";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { UUID } from "@/app/lib/newjersey/design/model";
export async function requestDesignRevision(form: FormData): Promise<void> {
  const id = String(form.get("id") || "");
  if (!UUID.test(id)) redirect("/shop/design");
  const path = "/shop/design/" + id;
  const user = await designCustomer(path);
  const { error } = await getSupabaseAdmin().rpc("revise_design_project", {
    p_order_id: id,
    p_customer_id: user.id,
    p_expected: String(form.get("expected") || ""),
    p_notes: String(form.get("notes") || ""),
  });
  if (error) {
    console.error("[Design revision]", error);
    redirect(
      path +
        "?error=Revision%20not%20sent.%20Refresh%20and%20check%20your%20allowance.",
    );
  }
  revalidatePath(path);
  revalidatePath("/admin/design/" + id);
  redirect(path + "?saved=1");
}

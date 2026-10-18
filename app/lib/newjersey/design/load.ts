import "server-only";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { UUID } from "./model";
export async function designCustomer(next: string) {
  const auth = await createClient();
  const {
    data: { user },
    error,
  } = await auth.auth.getUser();
  if (error || !user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
export async function loadDesign(id: string, customerId?: string) {
  if (!UUID.test(id)) notFound();
  const db = getSupabaseAdmin();
  let query = db.from("design_projects").select("*").eq("order_id", id);
  if (customerId) query = query.eq("customer_id", customerId);
  const { data: project, error } = await query.maybeSingle();
  if (error) throw new Error("Unable to load design project.");
  if (!project) notFound();
  const [orderResult, filesResult] = await Promise.all([
    db
      .from("orders")
      .select(
        "id,order_number,customer_full_name,customer_email,customer_phone,status,final_total,preferred_deadline",
      )
      .eq("id", id)
      .single(),
    db
      .from("design_files")
      .select("id,kind,round,file_name,created_at")
      .eq("order_id", id)
      .order("created_at"),
  ]);
  if (orderResult.error || filesResult.error)
    throw new Error("Unable to load design details.");
  return { project, order: orderResult.data, files: filesResult.data ?? [] };
}

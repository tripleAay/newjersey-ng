import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { UUID } from "@/app/lib/newjersey/design/model";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID.test(id)) return new NextResponse("Not found", { status: 404 });
  const auth = await createClient();
  const {
    data: { user },
    error,
  } = await auth.auth.getUser();
  if (error || !user)
    return new NextResponse("Sign in required", { status: 401 });
  const db = getSupabaseAdmin();
  const result = await db
    .from("design_files")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (result.error)
    return new NextResponse("Unable to load file", { status: 503 });
  if (!result.data) return new NextResponse("Not found", { status: 404 });
  const file = result.data;
  const { data: project, error: pError } = await db
    .from("design_projects")
    .select("customer_id")
    .eq("order_id", file.order_id)
    .maybeSingle();
  if (pError || !project)
    return new NextResponse("Unable to load project", { status: 503 });
  const { data: admin } = await db
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .eq("active", true)
    .maybeSingle();
  const isAdmin = admin && ["owner", "admin"].includes(admin.role);
  if (project.customer_id !== user.id && !isAdmin)
    return new NextResponse("Access denied", { status: 403 });
  if (file.kind === "delivery" && !isAdmin) {
    const { data: order, error: oError } = await db
      .from("orders")
      .select("final_total")
      .eq("id", file.order_id)
      .single();
    if (oError || !order)
      return new NextResponse("Unable to check payment", { status: 503 });
    const { data: paid, error: payError } = await db
      .from("order_payments")
      .select("id")
      .eq("order_id", file.order_id)
      .eq("customer_id", user.id)
      .eq("status", "verified")
      .eq("currency", "NGN")
      .eq("amount", order.final_total)
      .limit(1);
    if (payError || !paid?.length)
      return new NextResponse("Verified payment required", { status: 403 });
  }
  const { data: signed, error: signError } = await db.storage
    .from("newjersey-design-files")
    .createSignedUrl(file.storage_path, 60, { download: file.file_name });
  if (signError || !signed?.signedUrl)
    return new NextResponse("Download unavailable", { status: 503 });
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: signed.signedUrl,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

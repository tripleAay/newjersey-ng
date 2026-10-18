import "server-only";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  uuid,
  invoiceAvailable,
  matchingPayment,
  consistentTotals,
  consistentItems,
  type DocumentKind,
  type DocumentData,
  type OrderRecord,
  type PaymentRecord,
} from "./model";
export class DocumentError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function loadDocument(
  id: string,
  kind: DocumentKind,
): Promise<DocumentData> {
  if (!uuid.test(id)) throw new DocumentError("Document not found.", 404);
  const auth = await createClient();
  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();
  if (authError || !user)
    throw new DocumentError("Please sign in to download this document.", 401);
  const db = getSupabaseAdmin();
  const { data: admin, error: adminError } = await db
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .eq("active", true)
    .maybeSingle();
  // A failed admin lookup never grants elevated access. Customers can still access their own order.
  const elevated =
    !adminError && admin && ["owner", "admin"].includes(admin.role);
  let query = db
    .from("orders")
    .select(
      "id,customer_id,order_number,project_name,status,customer_full_name,customer_email,customer_phone,customer_organization,delivery_method,delivery_state,delivery_city,delivery_address,subtotal,design_fee,delivery_fee,final_total,production_instructions,preferred_deadline,created_at,design_service",
    )
    .eq("id", id);
  if (!elevated) query = query.eq("customer_id", user.id);
  const { data: raw, error } = await query.maybeSingle();
  if (error) {
    console.error("[PDF order]", error);
    throw new DocumentError(
      "Unable to load this order. Please try again.",
      503,
    );
  }
  if (!raw) throw new DocumentError("Document not found.", 404);
  const order = raw as OrderRecord;
  if (
    (kind === "invoice" || kind === "receipt") &&
    (!invoiceAvailable(order) || !consistentTotals(order))
  )
    throw new DocumentError(
      "A confirmed, consistent order total is required for this document.",
      409,
    );
  if (kind === "design" && !order.design_service)
    throw new DocumentError("This is not a design project.", 404);
  const [itemResult, paymentResult, designResult] = await Promise.all([
    db
      .from("order_items")
      .select(
        "id,product_name,quantity,unit_price,total_price,design_fee,selections",
      )
      .eq("order_id", id)
      .order("created_at")
      .order("id"),
    kind === "receipt"
      ? db
          .from("order_payments")
          .select(
            "id,order_id,customer_id,reference,amount,currency,status,method,reviewed_at,created_at,transfer_reference",
          )
          .eq("order_id", id)
          .eq("customer_id", order.customer_id)
          .eq("status", "verified")
          .eq("currency", "NGN")
          .order("reviewed_at", { ascending: false, nullsFirst: false })
          .limit(50)
      : Promise.resolve({ data: [], error: null }),
    order.design_service
      ? db
          .from("design_projects")
          .select(
            "designer,project_type,brief,scope,due_date,included_revisions,revisions_used,revision_notes,updated_at",
          )
          .eq("order_id", id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (itemResult.error || paymentResult.error || designResult.error) {
    console.error("[PDF details]", {
      items: itemResult.error,
      payment: paymentResult.error,
      design: designResult.error,
    });
    throw new DocumentError(
      "Unable to load document details. Please try again.",
      503,
    );
  }
  if (
    (kind === "invoice" || kind === "receipt") &&
    !consistentItems(order, itemResult.data ?? [])
  )
    throw new DocumentError(
      "The item totals need review before this document can be issued.",
      409,
    );
  const payment =
    ((paymentResult.data as PaymentRecord[]) ?? []).find((p) =>
      matchingPayment(order, p),
    ) ?? null;
  if (kind === "receipt" && !payment)
    throw new DocumentError(
      "A receipt is available after a matching payment has been verified.",
      409,
    );
  if (kind === "design" && !designResult.data)
    throw new DocumentError("Design project not found.", 404);
  return {
    order,
    items: itemResult.data ?? [],
    payment,
    design: designResult.data,
    generatedAt: new Date().toISOString(),
  };
}

import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
export async function GET() {
  try {
    const auth = await createClient();
    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser();
    if (authError || !user)
      return NextResponse.json(
        { signedIn: false, orders: [], designs: [], enquiries: [] },
        { headers },
      );
    const db = getSupabaseAdmin();
    const fields = "id,order_number,project_name,status,updated_at";
    const [orders, designs, enquiries] = await Promise.all([
      db
        .from("orders")
        .select(fields)
        .eq("customer_id", user.id)
        .eq("design_service", false)
        .order("updated_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(3),
      db
        .from("orders")
        .select(fields)
        .eq("customer_id", user.id)
        .eq("design_service", true)
        .order("updated_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(3),
      db
        .from("catalogue_enquiries")
        .select("id,product_name,status,updated_at")
        .eq("customer_id", user.id)
        .order("updated_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(3),
    ]);
    if (orders.error || designs.error || enquiries.error)
      throw orders.error || designs.error || enquiries.error;
    return NextResponse.json(
      {
        signedIn: true,
        orders: orders.data ?? [],
        designs: designs.data ?? [],
        enquiries: enquiries.data ?? [],
      },
      { headers },
    );
  } catch (error) {
    console.error("[Shop activity]", error);
    return NextResponse.json(
      { message: "Your recent activity could not be loaded." },
      { status: 503, headers },
    );
  }
}

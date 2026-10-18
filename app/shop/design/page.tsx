import Link from "next/link";
import { designCustomer } from "@/app/lib/newjersey/design/load";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { designStatus } from "@/app/lib/newjersey/design/model";
export default async function DesignsPage() {
  const user = await designCustomer("/shop/design");
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("design_projects")
    .select("order_id,designer,project_type,created_at")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Unable to load your design requests.");
  const ids = (data ?? []).map((p) => p.order_id);
  const result = ids.length
    ? await db.from("orders").select("id,status").in("id", ids)
    : { data: [], error: null };
  if (result.error) throw new Error("Unable to load request statuses.");
  return (
    <>
      <Link href="/shop/account" className="text-sm text-[#625D55]">
        Back to account
      </Link>
      <h1 className="mt-6 text-3xl font-semibold">Your design requests.</h1>
      <Link
        href="/hire-a-designer"
        className="mt-4 inline-block text-sm underline"
      >
        Start a new brief
      </Link>
      <div className="mt-8 space-y-3">
        {data?.map((p) => (
          <Link
            key={p.order_id}
            href={"/shop/design/" + p.order_id}
            className="block rounded-2xl border border-black/10 bg-white p-5"
          >
            <p className="text-xs uppercase tracking-widest text-[#FF6B00]">
              {p.designer}
            </p>
            <h2 className="mt-2 font-semibold">{p.project_type}</h2>
            <p className="mt-2 text-sm text-[#625D55]">
              {designStatus(
                result.data?.find((o) => o.id === p.order_id)?.status ??
                  "under-review",
              )}
            </p>
          </Link>
        ))}
        {!data?.length && (
          <p>No requests yet. Choose INK or FORM to get started.</p>
        )}
      </div>
    </>
  );
}

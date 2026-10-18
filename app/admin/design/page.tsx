import Link from "next/link";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { designStatus } from "@/app/lib/newjersey/design/model";
export const dynamic = "force-dynamic";
export default async function AdminDesigns() {
  await requireStoreAdmin();
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("design_projects")
    .select("order_id,designer,project_type,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error)
    throw new Error(
      "Unable to load design requests. Run the design studio migration first.",
    );
  const ids = (data ?? []).map((p) => p.order_id);
  const result = ids.length
    ? await db
        .from("orders")
        .select("id,status,customer_full_name")
        .in("id", ids)
    : { data: [], error: null };
  if (result.error) throw new Error("Unable to load design orders.");
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-semibold">Design requests.</h1>
      <p className="mt-3 text-sm text-[#625D55]">
        Review briefs, confirm scope and price, then deliver finished files
        after payment verification.
      </p>
      <div className="mt-8 space-y-3">
        {data?.map((p) => {
          const o = result.data?.find((o) => o.id === p.order_id);
          return (
            <Link
              key={p.order_id}
              href={"/admin/design/" + p.order_id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-5"
            >
              <div>
                <p className="text-xs uppercase text-[#FF6B00]">{p.designer}</p>
                <h2 className="mt-1 font-semibold">{p.project_type}</h2>
                <p className="mt-1 text-sm text-[#625D55]">
                  {o?.customer_full_name}
                </p>
              </div>
              <span className="text-sm">
                {designStatus(o?.status ?? "under-review")}
              </span>
            </Link>
          );
        })}
        {!data?.length && <p>No design requests yet.</p>}
      </div>
    </main>
  );
}

import Link from "next/link";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { updateEnquiry } from "../actions";
export const dynamic = "force-dynamic";
export default async function Enquiries() {
  await requireStoreAdmin();
  const { data, error } = await getSupabaseAdmin()
    .from("catalogue_enquiries")
    .select(
      "id,product_name,customer_name,customer_email,customer_phone,brief,location,status,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error("Unable to load product enquiries.");
  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8">
      <Link href="/admin/catalogue" className="text-sm underline">
        Back to catalogue
      </Link>
      <h1 className="mt-6 text-3xl font-semibold">
        Print & product enquiries.
      </h1>
      <p className="mt-3 text-sm text-[#625D55]">
        Contact the customer to confirm measurements, materials, installation
        and pricing. These are enquiries, not paid orders.
      </p>
      <div className="mt-7 space-y-4">
        {data?.map((q) => (
          <article
            key={q.id}
            className="rounded-xl border border-black/10 bg-white p-6"
          >
            <p className="text-xs uppercase text-[#FF6B00]">
              {q.status} · {new Date(q.created_at).toLocaleDateString("en-GB")}
            </p>
            <h2 className="mt-3 text-xl font-semibold">{q.product_name}</h2>
            <p className="mt-3 text-sm leading-7">
              {q.customer_name}
              <br />
              {q.customer_email} · {q.customer_phone}
              <br />
              {q.location}
            </p>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#625D55]">
              {q.brief}
            </p>
            <form action={updateEnquiry} className="mt-5 flex flex-wrap gap-3">
              <input type="hidden" name="id" value={q.id} />
              <select
                name="status"
                defaultValue={q.status}
                className="min-h-11 rounded-lg border border-black/15 px-3"
              >
                {["new", "reviewing", "quoted", "closed"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button className="rounded-full bg-[#181818] px-5 py-3 text-sm text-white">
                Update status
              </button>
            </form>
          </article>
        ))}
        {!data?.length && <p>No enquiries yet.</p>}
      </div>
    </main>
  );
}

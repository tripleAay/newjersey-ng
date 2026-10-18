import Link from "next/link";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { suppressSubscriber } from "./actions";
export const dynamic = "force-dynamic";
type Props = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
    saved?: string;
    error?: string;
  }>;
};
export default async function NewsletterAdmin({ searchParams }: Props) {
  await requireStoreAdmin();
  const params = await searchParams;
  const page = /^[1-9]\d{0,4}$/.test(params.page || "")
    ? Number(params.page)
    : 1;
  const status = ["pending", "suppressed"].includes(params.status || "")
    ? params.status!
    : "all";
  const search = (params.q || "").trim().slice(0, 254);
  let query = getSupabaseAdmin()
    .from("newsletter_subscribers")
    .select("id,email,status,source,consented_at,created_at", {
      count: "exact",
    });
  if (status !== "all") query = query.eq("status", status);
  if (search)
    query = query.ilike("email", `%${search.replace(/[\\%_]/g, "\\$&")}%`);
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .order("id")
    .range((page - 1) * 30, page * 30 - 1);
  if (error) {
    console.error("[Newsletter admin] Unable to load subscribers.");
    throw new Error(
      "Unable to load subscribers. Check that the newsletter migration has been installed.",
    );
  }
  function href(next: number) {
    return `/admin/newsletter?${new URLSearchParams({ page: String(next), status, q: search })}`;
  }
  return (
    <main className="mx-auto max-w-6xl p-5 sm:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#9A4000]">
        Audience
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Newsletter requests.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#625D55]">
        Website signup requests only. Addresses are unverified. Email sending is
        paused; verify ownership before marketing. Suppressing an address
        prevents public signup from reactivating it.
      </p>
      {params.saved === "1" && (
        <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm">
          Address suppressed.
        </p>
      )}
      {params.error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm">
          Unable to update this address. Please try again.
        </p>
      )}
      <form className="my-6 flex flex-wrap items-end gap-3">
        <label className="flex-1 text-xs font-semibold">
          Find email
          <input
            name="q"
            type="search"
            defaultValue={search}
            maxLength={254}
            className="mt-2 block min-h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-base"
          />
        </label>
        <label className="text-xs font-semibold">
          Status
          <select
            name="status"
            defaultValue={status}
            className="mt-2 block min-h-11 rounded-xl border border-black/15 bg-white px-3 text-base"
          >
            <option value="all">All requests</option>
            <option value="pending">Pending verification</option>
            <option value="suppressed">Suppressed</option>
          </select>
        </label>
        <button className="min-h-11 rounded-full bg-[#181818] px-5 text-sm font-semibold text-white">
          Apply
        </button>
      </form>
      <p className="mb-3 text-xs text-[#625D55]">
        {count ?? 0} matching requests
      </p>
      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F0EFEB] text-xs">
            <tr>
              <th scope="col" className="p-4">
                Email
              </th>
              <th scope="col" className="p-4">
                Status
              </th>
              <th scope="col" className="p-4">
                Consent recorded
              </th>
              <th scope="col" className="p-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr key={row.id} className="border-t border-black/10">
                <td className="break-all p-4">{row.email}</td>
                <td className="p-4">
                  {row.status === "pending"
                    ? "Pending verification"
                    : "Suppressed"}
                </td>
                <td className="whitespace-nowrap p-4">
                  {new Date(row.consented_at).toLocaleDateString("en-GB", {
                    timeZone: "Africa/Lagos",
                  })}
                </td>
                <td className="p-4">
                  {row.status === "pending" ? (
                    <form action={suppressSubscriber}>
                      <input type="hidden" name="id" value={row.id} />
                      <button className="min-h-11 rounded-lg border border-black/15 px-3 text-xs font-semibold">
                        Suppress
                      </button>
                    </form>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length && (
          <p className="p-6 text-sm text-[#625D55]">
            No subscription requests found.
          </p>
        )}
      </div>
      <nav
        aria-label="Subscriber pages"
        className="mt-5 flex items-center justify-between text-sm"
      >
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className="inline-flex min-h-11 items-center underline"
          >
            Previous
          </Link>
        ) : (
          <span />
        )}
        <span>Page {page}</span>
        {page * 30 < (count ?? 0) ? (
          <Link
            href={href(page + 1)}
            className="inline-flex min-h-11 items-center underline"
          >
            Next
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}

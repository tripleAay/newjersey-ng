import Link from "next/link";
import DocumentDownloads from "@/app/components/newjersey/DocumentDownloads";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { loadDesign } from "@/app/lib/newjersey/design/load";
import {
  designStatus,
  naira,
  field,
  button,
} from "@/app/lib/newjersey/design/model";
import FileUpload from "@/app/lib/newjersey/design/FileUpload";
import { quoteDesign } from "../actions";
export default async function AdminDesign({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireStoreAdmin();
  const { id } = await params;
  const { project: p, order: o, files } = await loadDesign(id);
  const q = await searchParams;
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/admin/design" className="text-sm text-[#625D55]">
        Back to design requests
      </Link>
      <p className="mt-7 text-xs uppercase tracking-widest text-[#FF6B00]">
        {p.designer} / {designStatus(o.status)}
      </p>
      <h1 className="mt-3 text-3xl font-semibold">{p.project_type}</h1>
      <p className="mt-3 text-sm text-[#625D55]">
        {o.order_number} · {o.customer_full_name}
        <br />
        {o.customer_email} · {o.customer_phone}
      </p>
      {q.error && (
        <p role="alert" className="mt-5 bg-red-50 p-4 text-sm text-red-800">
          {q.error}
        </p>
      )}
      {q.saved === "1" && (
        <p role="status" className="mt-4">
          Quote sent to the customer.
        </p>
      )}
      <DocumentDownloads orderId={id} />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Customer brief</h2>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">
            {p.brief}
          </p>
          <p className="mt-4 text-sm text-[#625D55]">
            Requested deadline: {o.preferred_deadline || "Not provided"}
          </p>
          <ul className="mt-5 space-y-3">
            {files
              .filter((f) => f.kind === "reference")
              .map((f) => (
                <li key={f.id}>
                  <a
                    href={"/api/design-files/" + f.id}
                    className="break-all text-sm underline"
                  >
                    Reference: {f.file_name}
                  </a>
                </li>
              ))}
          </ul>
          {p.revision_notes && (
            <div className="mt-6 border-t border-black/10 pt-5">
              <h3 className="font-semibold">Latest revision request</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7">
                {p.revision_notes}
              </p>
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          {o.status === "under-review" ? (
            <form action={quoteDesign}>
              <h2 className="text-xl font-semibold">Confirm the quote</h2>
              <p className="mt-3 text-xs leading-6 text-[#625D55]">
                This is a digital design service. Include all deliverables and
                agree a realistic deadline. The customer reviews these terms
                before payment.
              </p>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="expected" value={p.updated_at} />
              <label className="mt-5 block text-sm font-medium">
                Total design price (NGN)
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  max="99999999.99"
                  step="0.01"
                  required
                  className={field}
                />
              </label>
              <label className="mt-5 block text-sm font-medium">
                Scope and deliverables
                <textarea
                  name="scope"
                  required
                  minLength={15}
                  maxLength={3000}
                  rows={5}
                  className={field}
                  placeholder="Describe the agreed work, file formats and what is included."
                />
              </label>
              <label className="mt-5 block text-sm font-medium">
                Delivery date
                <input name="due" type="date" required className={field} />
              </label>
              <label className="mt-5 block text-sm font-medium">
                Included revisions
                <input
                  name="revisions"
                  type="number"
                  min="0"
                  max="10"
                  step="1"
                  defaultValue="1"
                  required
                  className={field}
                />
              </label>
              <button className={button + " mt-6"}>Send confirmed quote</button>
            </form>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{naira(o.final_total)}</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
                {p.scope}
              </p>
              <p className="mt-4 text-sm">
                Due: {p.due_date} · Revisions: {p.revisions_used}/
                {p.included_revisions}
              </p>
              {o.status === "awaiting-payment" && (
                <>
                  <p className="mt-5 text-sm leading-7">
                    Waiting for the customer’s transfer. Verify the received
                    bank credit in Payments before delivering.
                  </p>
                  <Link href="/admin/payments" className={button + " mt-5"}>
                    Open payments
                  </Link>
                </>
              )}
              {["confirmed", "in-production"].includes(o.status) && (
                <FileUpload id={id} kind="delivery" expected={p.updated_at} />
              )}
              <ul className="mt-6 space-y-3">
                {files
                  .filter((f) => f.kind === "delivery")
                  .map((f) => (
                    <li key={f.id}>
                      <a
                        href={"/api/design-files/" + f.id}
                        className="break-all text-sm underline"
                      >
                        Version {f.round + 1}: {f.file_name}
                      </a>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

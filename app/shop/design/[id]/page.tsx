import Link from "next/link";
import DocumentDownloads from "@/app/components/newjersey/DocumentDownloads";
import { designCustomer, loadDesign } from "@/app/lib/newjersey/design/load";
import {
  designStatus,
  naira,
  field,
  button,
} from "@/app/lib/newjersey/design/model";
import FileUpload from "@/app/lib/newjersey/design/FileUpload";
import { requestDesignRevision } from "../actions";
export default async function DesignProject({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const user = await designCustomer("/shop/design/" + id);
  const { project: p, order: o, files } = await loadDesign(id, user.id);
  const query = await searchParams;
  const references = files.filter((f) => f.kind === "reference");
  const deliveries = files.filter((f) => f.kind === "delivery");
  return (
    <>
      <Link href="/shop/design" className="text-sm text-[#625D55]">
        Back to design requests
      </Link>
      <p className="mt-8 text-xs uppercase tracking-widest text-[#FF6B00]">
        NewJersey studio / {p.designer}
      </p>
      <h1 className="mt-3 text-3xl font-semibold">{p.project_type}</h1>
      <p className="mt-3 text-sm text-[#625D55]">
        {o.order_number} · {designStatus(o.status)}
      </p>
      {query.error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800"
        >
          {query.error}
        </p>
      )}
      {query.saved === "1" && (
        <p role="status" className="mt-5 text-sm">
          Your changes have been saved.
        </p>
      )}
      <DocumentDownloads orderId={id} />
      <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Your brief</h2>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#625D55]">
            {p.brief}
          </p>
          <h3 className="mt-6 text-sm font-semibold">References</h3>
          <ul className="mt-3 space-y-2">
            {references.map((f) => (
              <li key={f.id}>
                <a
                  href={"/api/design-files/" + f.id}
                  className="break-all text-sm underline"
                >
                  {f.file_name}
                </a>
              </li>
            ))}
          </ul>
          {o.status === "under-review" && references.length < 3 && (
            <FileUpload id={id} kind="reference" expected={p.updated_at} />
          )}
        </section>
        <section className="rounded-2xl border border-black/10 bg-[#F0EFEB] p-6">
          <h2 className="font-semibold">
            {p.scope ? "Confirmed scope" : "We’re reviewing your brief"}
          </h2>
          {p.scope ? (
            <>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7">
                {p.scope}
              </p>
              <p className="mt-5 text-2xl font-semibold">
                {naira(o.final_total)}
              </p>
              <p className="mt-3 text-sm leading-7">
                Delivery date: {p.due_date}
                <br />
                {p.included_revisions} included revision
                {p.included_revisions === 1 ? "" : "s"} · {p.revisions_used}{" "}
                used
              </p>
              <p className="mt-3 text-xs leading-6 text-[#625D55]">
                Digital design files only. Printing and physical delivery are
                separate. Payment confirms your acceptance of this scope, price
                and revision allowance.
              </p>
              {o.status === "awaiting-payment" && (
                <Link
                  href={"/shop/order/" + id + "/payment"}
                  className={button + " mt-5"}
                >
                  Review and pay
                </Link>
              )}
              {["confirmed", "in-production"].includes(o.status) && (
                <p className="mt-5 text-sm">
                  Your project is in design. We’ll notify you when your file is
                  ready.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm leading-7 text-[#625D55]">
              We’ll confirm the scope, price, deadline and included revisions
              here before you pay. You can add reference files while your
              request is under review.
            </p>
          )}
        </section>
      </div>
      {deliveries.length > 0 && (
        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-semibold">Your design files</h2>
          <ul className="mt-4 space-y-3">
            {deliveries.map((f) => (
              <li key={f.id}>
                <a
                  href={"/api/design-files/" + f.id}
                  className="inline-flex min-h-11 items-center break-all text-sm underline"
                >
                  Version {f.round + 1}: {f.file_name}
                </a>
              </li>
            ))}
          </ul>
          {o.status === "completed" &&
          p.revisions_used < p.included_revisions ? (
            <form
              action={requestDesignRevision}
              className="mt-6 border-t border-black/10 pt-5"
            >
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="expected" value={p.updated_at} />
              <label className="text-sm font-medium">
                What would you like changed?
                <textarea
                  name="notes"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  className={field}
                />
              </label>
              <p className="mt-3 text-xs leading-6 text-[#625D55]">
                Keep your changes within the confirmed scope. Sending this
                request uses one included revision.
              </p>
              <button className={button + " mt-4"}>
                Request revision ({p.included_revisions - p.revisions_used}{" "}
                left)
              </button>
            </form>
          ) : o.status === "completed" ? (
            <p className="mt-4 text-sm text-[#625D55]">
              Your included revisions are complete. For additional work,{" "}
              <Link href="/hire-a-designer" className="underline">
                send a new brief
              </Link>
              .
            </p>
          ) : null}
        </section>
      )}
    </>
  );
}

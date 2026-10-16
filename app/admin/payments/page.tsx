import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import { reviewPayment } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    status?: string | string[];
    page?: string | string[];
    error?: string | string[];
    saved?: string | string[];
  }>;
};

const PAGE_SIZE = 20;

const filters = [
  { value: "submitted", label: "To verify" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "pending", label: "Awaiting submission" },
  { value: "all", label: "All" },
];

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

function formatDate(value: string | null) {
  if (!value) return "—";

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : dateFormatter.format(parsed);
}

function formatMoney(value: unknown) {
  if (
    typeof value !== "number" &&
    typeof value !== "string"
  ) {
    return "Unavailable";
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? currency.format(parsed)
    : "Unavailable";
}

export default async function AdminPaymentsPage({
  searchParams,
}: Props) {
  await requireStoreAdmin();

  const params = await searchParams;

  const status =
    typeof params.status === "string" &&
    filters.some((filter) => filter.value === params.status)
      ? params.status
      : "submitted";

  const rawPage =
    typeof params.page === "string" ? Number(params.page) : 1;

  const page =
    Number.isSafeInteger(rawPage) &&
    rawPage >= 1 &&
    rawPage <= 100000
      ? rawPage
      : 1;

  const error =
    typeof params.error === "string" ? params.error : "";

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("order_payments")
    .select(
      `
        id,
        order_id,
        reference,
        amount,
        status,
        bank_name,
        account_name,
        account_number,
        sender_name,
        transfer_reference,
        evidence_file_name,
        evidence_storage_path,
        review_notes,
        submitted_at,
        reviewed_at,
        created_at
      `,
      { count: "exact" }
    );

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error: paymentsError, count } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (paymentsError) {
    console.error("[Admin payments]", paymentsError);
    throw new Error("Unable to load payments.");
  }

  const payments = data ?? [];
  const orderIds = [...new Set(payments.map((item) => item.order_id))];

  const ordersResult = orderIds.length
    ? await supabase
        .from("orders")
        .select(
          "id, order_number, customer_full_name, project_name, status"
        )
        .in("id", orderIds)
    : { data: [], error: null };

  if (ordersResult.error) {
    console.error("[Payment orders]", ordersResult.error);
    throw new Error("Unable to load payment orders.");
  }

  const orders = new Map(
    (ordersResult.data ?? []).map((order) => [order.id, order])
  );

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Payments.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
            Match transfer submissions to actual bank credits
            before confirming payment.
          </p>
        </div>

        <Link
          href="/admin/settings/payments"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#625D55] hover:underline"
        >
          Payment settings
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800"
        >
          {error}
        </p>
      )}

      {params.saved === "1" && (
        <p
          role="status"
          className="mt-6 rounded-xl bg-[#EDF3ED] p-4 text-sm text-[#426247]"
        >
          Payment review saved.
        </p>
      )}

      <nav
        aria-label="Payment filters"
        className="mt-8 flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={`/admin/payments?status=${filter.value}&page=1`}
            aria-current={
              status === filter.value ? "page" : undefined
            }
            className={[
              "inline-flex min-h-11 items-center rounded-full px-4 text-xs font-medium",
              status === filter.value
                ? "bg-[#181818] text-white"
                : "border border-black/10 bg-white text-[#625D55] hover:bg-[#F5F4F0]",
            ].join(" ")}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      <p className="mt-6 text-xs text-[#7A7368]">
        {total} {total === 1 ? "payment" : "payments"}
      </p>

      <div className="mt-4 space-y-5">
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8">
            <h2 className="text-lg font-semibold">
              No payments in this view.
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#625D55]">
              Customer transfer submissions will appear under
              To verify.
            </p>
          </div>
        ) : (
          payments.map((payment) => {
            const order = orders.get(payment.order_id);

            return (
              <article
                key={payment.id}
                className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="break-all text-xs text-[#7A7368]">
                      {order?.order_number || "Order unavailable"}
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                      {order?.project_name || "Bank transfer"}
                    </h2>

                    <p className="mt-2 text-sm text-[#625D55]">
                      {order?.customer_full_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-semibold tracking-tight">
                      {formatMoney(payment.amount)}
                    </p>

                    <p className="mt-2 text-xs capitalize text-[#625D55]">
                      {payment.status === "submitted"
                        ? "Awaiting verification"
                        : payment.status}
                    </p>
                  </div>
                </div>

                <dl className="mt-6 grid gap-5 border-t border-black/10 pt-5 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Sender’s account name
                    </dt>
                    <dd className="mt-2 break-words">
                      {payment.sender_name || "Not submitted"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Bank transaction reference
                    </dt>
                    <dd className="mt-2 break-all">
                      {payment.transfer_reference || "Not provided"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Payment reference
                    </dt>
                    <dd className="mt-2 break-all font-mono text-xs">
                      {payment.reference}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Receiving account
                    </dt>
                    <dd className="mt-2 leading-6">
                      {payment.bank_name}
                      <br />
                      {payment.account_name}
                      <br />
                      {payment.account_number}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Submitted
                    </dt>
                    <dd className="mt-2">
                      {formatDate(payment.submitted_at)}
                    </dd>
                  </div>

                  {payment.reviewed_at && (
                    <div>
                      <dt className="text-xs text-[#7A7368]">
                        Reviewed
                      </dt>
                      <dd className="mt-2">
                        {formatDate(payment.reviewed_at)}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-5">
                  {payment.evidence_storage_path && (
                    <a
                      href={`/api/admin/payments/${payment.id}/evidence`}
                      className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold underline underline-offset-4"
                    >
                      Download receipt
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}

                  {order && (
                    <Link
                      href={`/admin/orders/${encodeURIComponent(order.order_number)}`}
                      className="inline-flex min-h-11 items-center text-xs font-semibold text-[#625D55] hover:underline"
                    >
                      View order
                    </Link>
                  )}
                </div>

                {payment.review_notes && (
                  <div className="mt-5 rounded-xl bg-[#F5F4F0] p-4">
                    <p className="text-xs font-semibold">
                      Review notes
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#625D55]">
                      {payment.review_notes}
                    </p>
                  </div>
                )}

                {payment.status === "submitted" && (
                  <form
                    action={reviewPayment}
                    className="mt-6 space-y-5 border-t border-black/10 pt-6"
                  >
                    <input
                      type="hidden"
                      name="paymentId"
                      value={payment.id}
                    />

                    <label className="block text-sm font-medium">
                      Review notes
                      <textarea
                        name="notes"
                        maxLength={2000}
                        rows={3}
                        placeholder="Required when rejecting a submission. Rejection notes are shared with the customer."
                        className="mt-2 block w-full rounded-xl border border-black/15 px-4 py-3 text-base"
                      />
                    </label>

                    <label className="flex items-start gap-3 text-sm leading-6">
                      <input
                        type="checkbox"
                        name="bankCreditChecked"
                        className="mt-1 h-5 w-5 shrink-0 accent-[#181818]"
                      />
                      I checked the receiving bank account and
                      matched this amount, sender, and reference
                      to an actual credit that has not already
                      been used for another payment.
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        name="decision"
                        value="verified"
                        className="min-h-12 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636]"
                      >
                        Verify payment
                      </button>

                      <button
                        type="submit"
                        name="decision"
                        value="rejected"
                        className="min-h-12 rounded-full border border-black/15 px-6 text-sm font-semibold hover:bg-[#F5F4F0]"
                      >
                        Reject submission
                      </button>
                    </div>
                  </form>
                )}
              </article>
            );
          })
        )}
      </div>

      <nav
        aria-label="Payment pages"
        className="mt-7 flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <p className="text-[#7A7368]">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-5">
          {page > 1 && (
            <Link
              href={`/admin/payments?status=${status}&page=${page - 1}`}
              className="inline-flex min-h-11 items-center font-semibold"
            >
              Previous
            </Link>
          )}

          {page < totalPages && (
            <Link
              href={`/admin/payments?status=${status}&page=${page + 1}`}
              className="inline-flex min-h-11 items-center font-semibold"
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
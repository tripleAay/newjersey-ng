import "server-only";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

type Props = {
  orderId: string;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

function money(value: unknown) {
  if (
    (typeof value !== "number" &&
      typeof value !== "string") ||
    (typeof value === "string" && !value.trim())
  ) {
    return "Unavailable";
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? currency.format(parsed)
    : "Unavailable";
}

function date(value: string | null) {
  if (!value) return "—";

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : dateFormatter.format(parsed);
}

function statusDetails(status: string) {
  switch (status) {
    case "verified":
      return {
        label: "Verified",
        style: "bg-[#EDF3ED] text-[#426247]",
      };

    case "rejected":
      return {
        label: "Needs attention",
        style: "bg-[#F7ECEB] text-[#8A4B45]",
      };

    case "submitted":
      return {
        label: "Awaiting verification",
        style: "bg-[#F1F1EE] text-[#625D55]",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        style: "bg-[#F1F1EE] text-[#625D55]",
      };

    default:
      return {
        label: "Awaiting transfer",
        style: "bg-[#F1F1EE] text-[#625D55]",
      };
  }
}

export default async function PaymentHistory({
  orderId,
}: Props) {
  if (!UUID.test(orderId)) return null;

  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) return null;

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error("[Payment history order]", orderError);

    return (
      <p role="status" className="mt-8 text-sm text-[#625D55]">
        Payment history is temporarily unavailable.
      </p>
    );
  }

  if (!order) return null;

  const { data, error, count } = await supabase
    .from("order_payments")
    .select(
      `
        id,
        reference,
        amount,
        status,
        sender_name,
        evidence_file_name,
        review_notes,
        created_at,
        submitted_at,
        reviewed_at
      `,
      { count: "exact" }
    )
    .eq("order_id", order.id)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[Customer payment history]", error);

    return (
      <p role="status" className="mt-8 text-sm text-[#625D55]">
        Payment history is temporarily unavailable.
      </p>
    );
  }

  const payments = data ?? [];

  if (payments.length === 0) return null;

  return (
    <section
      aria-labelledby="payment-history-heading"
      className="mt-10 border-t border-black/10 pt-8"
    >
      <h2
        id="payment-history-heading"
        className="text-xl font-semibold tracking-tight"
      >
        Payment history
      </h2>

      <p className="mt-2 text-sm leading-7 text-[#625D55]">
        Your payment requests, submitted receipts, and
        verification updates for this order.
      </p>

      <div className="mt-6 space-y-4">
        {payments.map((payment) => {
          const status = statusDetails(payment.status);

          return (
            <article
              key={payment.id}
              className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-semibold">
                    {money(payment.amount)}
                  </p>

                  <p className="mt-2 break-all font-mono text-xs leading-6 text-[#625D55]">
                    {payment.reference}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${status.style}`}
                >
                  {status.label}
                </span>
              </div>

              <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#7A7368]">
                    Created
                  </dt>
                  <dd className="mt-1 leading-6">
                    {date(payment.created_at)}
                  </dd>
                </div>

                {payment.submitted_at && (
                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Receipt submitted
                    </dt>
                    <dd className="mt-1 leading-6">
                      {date(payment.submitted_at)}
                    </dd>
                  </div>
                )}

                {payment.sender_name && (
                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Sender
                    </dt>
                    <dd className="mt-1 break-words leading-6">
                      {payment.sender_name}
                    </dd>
                  </div>
                )}

                {payment.evidence_file_name && (
                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Submitted file
                    </dt>
                    <dd className="mt-1 break-all leading-6">
                      {payment.evidence_file_name}
                    </dd>
                  </div>
                )}

                {payment.reviewed_at && (
                  <div>
                    <dt className="text-xs text-[#7A7368]">
                      Reviewed
                    </dt>
                    <dd className="mt-1 leading-6">
                      {date(payment.reviewed_at)}
                    </dd>
                  </div>
                )}
              </dl>

              {payment.status === "rejected" && (
                <div className="mt-5 border-t border-black/10 pt-5">
                  <h3 className="text-sm font-semibold">
                    Why this submission was rejected
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#625D55]">
                    {payment.review_notes ||
                      "Contact our team for clarification."}
                  </p>

                  <p className="mt-3 text-xs leading-6 text-[#7A7368]">
                    If money has already left your account,
                    contact us with this reference before
                    making another transfer.
                  </p>
                </div>
              )}

              {payment.status === "verified" && (
                <p className="mt-5 border-t border-black/10 pt-5 text-sm leading-7 text-[#426247]">
                  Your bank transfer was verified.
                </p>
              )}
            </article>
          );
        })}
      </div>

      {(count ?? 0) > payments.length && (
        <p className="mt-4 text-xs leading-6 text-[#7A7368]">
          Showing your latest {payments.length} payment
          requests. Contact our team for older records.
        </p>
      )}
    </section>
  );
}
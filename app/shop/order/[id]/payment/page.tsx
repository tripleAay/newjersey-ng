import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
import PaymentEvidenceForm from "@/app/components/newjersey/order/PaymentEvidenceForm";
import PaymentHistory from "@/app/components/newjersey/order/PaymentHistory";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import { startBankTransfer } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ Id: string }>;
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const buttonClass =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2";

function parseAmount(value: unknown): number | null {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && !value.trim())
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : null;
}

function money(value: unknown) {
  const parsed = parseAmount(value);

  return parsed === null
    ? "Not confirmed"
    : currency.format(parsed);
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-[#7A7368]">{label}</dt>
      <dd className="mt-2 break-words text-base font-medium leading-7">
        {children}
      </dd>
    </div>
  );
}

export default async function PaymentPage({
  params,
  searchParams,
}: Props) {
  const { Id: id } = await params;
  const query = await searchParams;

  if (typeof id !== "string" || !UUID.test(id)) {
    notFound();
  }

  const path = `/shop/order/${id}/payment`;
  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    redirect(`/login?next=${encodeURIComponent(path)}`);
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number, project_name, status, final_total")
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error("[Payment order lookup]", orderError);
    throw new Error("Unable to load your order.");
  }

  if (!order) notFound();

  const [paymentResult, settingsResult, rejectedResult] =
    await Promise.all([
      supabase
        .from("order_payments")
        .select(`
          id,
          reference,
          amount,
          status,
          bank_name,
          account_name,
          account_number,
          instructions,
          evidence_file_name
        `)
        .eq("order_id", order.id)
        .eq("customer_id", user.id)
        .in("status", ["pending", "submitted", "verified"])
        .maybeSingle(),

      supabase
        .from("store_payment_settings")
        .select("enabled")
        .eq("id", "bank-transfer")
        .maybeSingle(),

      supabase
        .from("order_payments")
        .select("id", { count: "exact", head: true })
        .eq("order_id", order.id)
        .eq("customer_id", user.id)
        .eq("status", "rejected"),
    ]);

  if (
    paymentResult.error ||
    settingsResult.error ||
    rejectedResult.error
  ) {
    console.error("[Payment page details]", {
      payment: paymentResult.error,
      settings: settingsResult.error,
      rejected: rejectedResult.error,
    });

    throw new Error("Unable to load payment details.");
  }

  const payment = paymentResult.data;
  const hasRejectedSubmission = (rejectedResult.count ?? 0) > 0;
  const finalAmount = parseAmount(order.final_total);

  const orderAcceptsPayment =
    order.status === "awaiting-payment" &&
    finalAmount !== null &&
    finalAmount > 0;

  const transferEnabled = settingsResult.data?.enabled === true;

  const canSubmit =
    payment?.status === "pending" &&
    orderAcceptsPayment &&
    parseAmount(payment.amount) === finalAmount;

  const error =
    typeof query.error === "string" ? query.error : "";

  const statusText =
    payment?.status === "verified"
      ? "Verified"
      : payment?.status === "submitted"
        ? "Awaiting verification"
        : payment?.status === "pending"
          ? "Awaiting transfer"
          : hasRejectedSubmission
            ? "Previous submission rejected"
            : "Not started";

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>
        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1080px] px-5 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-8">
        <Link
          href={`/shop/order/${order.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to your order
        </Link>

        <div className="pb-8 pt-7 sm:pb-10 sm:pt-10">
          <p className="break-all text-xs font-medium text-[#7A7368]">
            {order.order_number}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Payment.
          </h1>
          <p className="mt-4 break-words text-sm leading-7 text-[#625D55]">
            {order.project_name || "Your order"}
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800"
          >
            {error}
          </p>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <section className="min-w-0 rounded-[24px] border border-black/10 bg-white p-6 sm:p-8">
            {payment?.status === "verified" ? (
              <>
                <CheckCircle2
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-[#426247]"
                />
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  Payment verified.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#625D55]">
                  Your bank transfer has been verified. Check your
                  order for production updates.
                </p>
                <Link
                  href={`/shop/order/${order.id}`}
                  className={`${buttonClass} mt-6`}
                >
                  View your order
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            ) : payment?.status === "submitted" ? (
              <>
                <Clock3
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-[#625D55]"
                />
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  We’re checking your transfer.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#625D55]">
                  Your receipt has been received. We’ll verify the
                  bank credit and update your payment status.
                </p>

                {payment.evidence_file_name && (
                  <div className="mt-6 rounded-xl bg-[#F5F4F0] p-4">
                    <p className="text-xs text-[#7A7368]">
                      Submitted receipt
                    </p>
                    <p className="mt-2 break-all text-sm font-medium">
                      {payment.evidence_file_name}
                    </p>
                  </div>
                )}

                <p className="mt-5 text-xs leading-6 text-[#7A7368]">
                  Do not make another transfer while this payment
                  is awaiting verification.
                </p>
              </>
            ) : canSubmit && payment ? (
              <>
                <h2 className="text-xl font-semibold tracking-tight">
                  Pay by bank transfer.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#625D55]">
                  Transfer the exact amount to the account below,
                  then submit your receipt.
                </p>

                {hasRejectedSubmission && (
                  <p className="mt-5 rounded-xl bg-[#F5F4F0] p-4 text-sm leading-7 text-[#625D55]">
                    A previous submission was rejected. Read the
                    feedback in your payment history. If you already
                    transferred money, contact us before paying again.
                  </p>
                )}

                <dl className="mt-7 grid gap-6 sm:grid-cols-2">
                  <Detail label="Bank">{payment.bank_name}</Detail>
                  <Detail label="Account name">
                    {payment.account_name}
                  </Detail>
                  <Detail label="Account number">
                    <span className="select-all font-mono text-2xl tracking-wide">
                      {payment.account_number}
                    </span>
                  </Detail>
                  <Detail label="Amount to transfer">
                    {money(payment.amount)}
                  </Detail>
                  <div className="sm:col-span-2">
                    <Detail label="Payment reference">
                      <span className="select-all break-all font-mono text-sm">
                        {payment.reference}
                      </span>
                    </Detail>
                  </div>
                </dl>

                {payment.instructions && (
                  <p className="mt-7 whitespace-pre-wrap border-t border-black/10 pt-5 text-sm leading-7 text-[#625D55]">
                    {payment.instructions}
                  </p>
                )}

                <p className="mt-5 text-xs leading-6 text-[#7A7368]">
                  These bank details are saved for this payment
                  request. Payment is confirmed after we verify
                  the bank credit.
                </p>

                <PaymentEvidenceForm
                  key={payment.id}
                  paymentId={payment.id}
                />
              </>
            ) : payment ? (
              <>
                <h2 className="text-xl font-semibold">
                  Check your order before paying.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#625D55]">
                  This request cannot currently accept a submission.
                  Contact our team before making a transfer.
                </p>
                <Link
                  href={`/shop/order/${order.id}`}
                  className={`${buttonClass} mt-6`}
                >
                  View your order
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            ) : orderAcceptsPayment && transferEnabled ? (
              <>
                <p className="text-xs font-medium text-[#7A7368]">
                  Payment method
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Bank transfer.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#625D55]">
                  Get your bank details and payment reference.
                  After transferring, submit your receipt for
                  verification.
                </p>

                {hasRejectedSubmission && (
                  <p className="mt-5 rounded-xl bg-[#F5F4F0] p-4 text-sm leading-7 text-[#625D55]">
                    Your previous submission was rejected. Check
                    the reason below. Creating new instructions
                    does not mean you should transfer again if
                    money has already left your account.
                  </p>
                )}

                <form action={startBankTransfer} className="mt-7">
                  <input
                    type="hidden"
                    name="orderId"
                    value={order.id}
                  />
                  <button type="submit" className={buttonClass}>
                    {hasRejectedSubmission
                      ? "Create new payment request"
                      : "Get bank details"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">
                  Payment is currently unavailable.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#625D55]">
                  {orderAcceptsPayment
                    ? "Bank transfer is temporarily unavailable. Contact our team for help."
                    : "Check your order for its current status. Payment is available after final pricing is confirmed and the order is awaiting payment."}
                </p>
                <Link
                  href={`/shop/order/${order.id}`}
                  className={`${buttonClass} mt-6`}
                >
                  View your order
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            )}
          </section>

          <aside className="min-w-0 border-t border-black/10 pt-6">
            <p className="text-xs font-medium text-[#7A7368]">
              {payment
                ? "Payment request amount"
                : "Confirmed order total"}
            </p>
            <p className="mt-3 break-words text-3xl font-semibold tracking-[-0.04em]">
              {money(payment ? payment.amount : order.final_total)}
            </p>

            <dl className="mt-6 space-y-5">
              <Detail label="Payment status">
                <span className="text-sm">{statusText}</span>
              </Detail>
              {payment && (
                <Detail label="Payment reference">
                  <span className="select-all break-all font-mono text-xs">
                    {payment.reference}
                  </span>
                </Detail>
              )}
            </dl>

            <div className="mt-7 border-t border-black/10 pt-5">
              <p className="text-xs font-semibold">Need help?</p>
              <a
                href={`mailto:hello@newjersey.ng?subject=${encodeURIComponent(
                  `Payment help: ${order.order_number}`
                )}`}
                className="mt-2 inline-flex min-h-11 items-center break-all text-xs text-[#625D55] underline underline-offset-4 hover:text-[#181818]"
              >
                hello@newjersey.ng
              </a>
            </div>
          </aside>
        </div>

        <PaymentHistory orderId={order.id} />
      </main>

      <Footer />
    </div>
  );
}
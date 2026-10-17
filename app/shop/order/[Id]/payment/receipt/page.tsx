import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

import PrintReceiptButton from "@/app/components/newjersey/PrintReceiptButton";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import styles from "./receipt.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ Id: string }>;
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
      <dd className="mt-2 break-words text-sm leading-7">
        {children}
      </dd>
    </div>
  );
}

export default async function PaymentReceiptPage({
  params,
}: Props) {
  const { Id: id } = await params;

  if (typeof id !== "string" || !UUID.test(id)) {
    notFound();
  }

  const receiptPath = `/shop/order/${id}/payment/receipt`;
  const paymentPath = `/shop/order/${id}/payment`;

  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    redirect(
      `/login?next=${encodeURIComponent(receiptPath)}`
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error("[Receipt order lookup]", orderError);
    throw new Error("Unable to load this receipt.");
  }

  if (!order) notFound();

  const { data: payment, error: paymentError } =
    await supabase
      .from("order_payments")
      .select(`
        id,
        reference,
        amount,
        currency,
        method,
        sender_name,
        bank_name,
        reviewed_at
      `)
      .eq("order_id", order.id)
      .eq("customer_id", user.id)
      .eq("status", "verified")
      .maybeSingle();

  if (paymentError) {
    console.error("[Verified payment receipt]", paymentError);
    throw new Error("Unable to load this receipt.");
  }

  // A submitted receipt is not a verified payment.
  if (!payment) {
    redirect(paymentPath);
  }

  const amount = Number(payment.amount);
  const verifiedAt = payment.reviewed_at
    ? new Date(payment.reviewed_at)
    : null;

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    payment.currency !== "NGN" ||
    !verifiedAt ||
    Number.isNaN(verifiedAt.getTime())
  ) {
    throw new Error(
      "This receipt is unavailable. Contact our team with your order reference."
    );
  }

  const receiptNumber =
    `NJ-RCT-${payment.id.replaceAll("-", "").toUpperCase()}`;

  return (
    <main className="min-h-screen bg-[#FCFBF8] px-5 py-8 text-[#181818] sm:px-8 sm:py-12">
      <div
        className={`${styles.controls} mx-auto mb-7 flex max-w-[800px] flex-wrap items-center justify-between gap-4`}
      >
        <Link
          href={paymentPath}
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#625D55] hover:text-[#181818]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to payment
        </Link>

        <PrintReceiptButton />
      </div>

      <article
        className={`${styles.receipt} mx-auto max-w-[800px] rounded-[24px] border border-black/10 p-6 sm:p-10`}
      >
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-black/10 pb-8">
          <div>
            <p className="text-2xl font-bold tracking-tight">
              newjersey.ng
            </p>
            <p className="mt-2 text-xs leading-6 text-[#625D55]">
              Print &amp; Branding
            </p>
          </div>

          <div className="sm:text-right">
            <h1 className="text-xl font-semibold tracking-tight">
              Payment receipt
            </h1>

            <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#426247]">
              <CheckCircle2 size={15} aria-hidden="true" />
              Payment verified
            </p>
          </div>
        </header>

        <section className="py-8">
          <p className="text-xs text-[#7A7368]">
            Amount received
          </p>

          <p className="mt-3 break-words text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {currency.format(amount)}
          </p>

          <p className="mt-3 text-sm leading-7 text-[#625D55]">
            Bank transfer verified by NewJersey.ng.
          </p>
        </section>

        <section className="border-t border-black/10 py-8">
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Detail label="Receipt number">
              <span className="break-all font-mono text-xs">
                {receiptNumber}
              </span>
            </Detail>

            <Detail label="Order reference">
              <span className="break-all">
                {order.order_number}
              </span>
            </Detail>

            <Detail label="Payment reference">
              <span className="break-all font-mono text-xs">
                {payment.reference}
              </span>
            </Detail>

            <Detail label="Verified on">
              {dateFormatter.format(verifiedAt)} WAT
            </Detail>

            <Detail label="Sender’s account name">
              {payment.sender_name || "Not recorded"}
            </Detail>

            <Detail label="Payment method">
              Bank transfer · NGN
            </Detail>

            <Detail label="Receiving bank">
              {payment.bank_name}
            </Detail>
          </dl>
        </section>

        <section className="border-t border-black/10 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-sm font-semibold">
              Total received
            </h2>

            <p className="text-xl font-semibold">
              {currency.format(amount)}
            </p>
          </div>
        </section>

        <footer className="border-t border-black/10 pt-6">
          <p className="text-xs leading-6 text-[#625D55]">
            This receipt acknowledges the verified payment
            referenced above. Production and delivery
            progress are available on your order page.
          </p>

          <p className="mt-4 text-xs leading-6 text-[#625D55]">
            hello@newjersey.ng · +234 808 957 0493
          </p>
        </footer>
      </article>
    </main>
  );
}
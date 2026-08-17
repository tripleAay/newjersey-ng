"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/dashboard components/mainheader";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Pending" | "Overdue";
type PaymentMethodKey = "card" | "transfer" | "wallet";

type Invoice = {
  id: string;
  label: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  project?: string;
};

const formatNGN = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const INVOICES: Invoice[] = [
  {
    id: "INV-2412-001",
    label: "Brand starter pack",
    date: "10 February 2025",
    amount: 185000,
    status: "Paid",
    project: "Studio – Design & Mockups",
  },
  {
    id: "INV-2412-002",
    label: "50 Classic White Tees",
    date: "24 February 2025",
    amount: 325000,
    status: "Pending",
    project: "PrintHub – Merch drop",
  },
  {
    id: "2411-008",
    label: "Autotech crew merch",
    date: "02 January 2025",
    amount: 210000,
    status: "Overdue",
    project: "AutoTech – Internal merch",
  },
];

const invoiceStatusStyles: Record<InvoiceStatus, { chip: string; text: string }> = {
  Paid: {
    chip: "bg-emerald-50/90 text-emerald-700 border-emerald-200",
    text: "text-emerald-300",
  },
  Pending: {
    chip: "bg-amber-50/90 text-amber-700 border-amber-200",
    text: "text-amber-300",
  },
  Overdue: {
    chip: "bg-rose-50/90 text-rose-700 border-rose-200",
    text: "text-rose-300",
  },
};

export default function BillingPage() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodKey>("card");

  const stats = useMemo(() => {
    const totalInvoices = INVOICES.length;
    const paid = INVOICES.filter((i) => i.status === "Paid").length;
    const pending = INVOICES.filter((i) => i.status === "Pending").length;
    const overdue = INVOICES.filter((i) => i.status === "Overdue").length;
    const outstanding = INVOICES.filter((i) => i.status !== "Paid").reduce(
      (sum, i) => sum + i.amount,
      0
    );
    const totalPaid = INVOICES.filter((i) => i.status === "Paid").reduce(
      (sum, i) => sum + i.amount,
      0
    );

    return { totalInvoices, paid, pending, overdue, outstanding, totalPaid };
  }, []);

  const currentPlanName = "Standard Plan";
  const currentPlanTagline = "Clean billing. No noise.";

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20 pb-16">
      <Header />

      <div className="max-w-6xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-3 sm:mb-4 text-[11px] sm:text-xs text-neutral-500">
          <ol className="flex items-center gap-1.5 sm:gap-2">
            <li>
              <Link href="/" className="hover:text-neutral-200">
                Home
              </Link>
            </li>
            <li className="text-neutral-600">/</li>
            <li className="text-neutral-300">Billing</li>
          </ol>
        </nav>

        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => history.back()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Billing
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-xl">
              All payments in one clean view.
            </p>
          </div>

          <div className="text-right text-[11px] sm:text-xs">
            <p className="text-neutral-400">Invoices</p>
            <p className="text-sm sm:text-base font-semibold">
              {stats.totalInvoices}{" "}
              <span className="text-neutral-400 font-normal">total</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-6 lg:gap-8">
          {/* ───────── LEFT ───────── */}
          <section className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    Current plan
                  </p>
                  <h2 className="text-sm sm:text-base font-semibold">{currentPlanName}</h2>
                  <p className="text-[11px] sm:text-xs text-neutral-400">{currentPlanTagline}</p>
                </div>

                <div className="text-right text-[11px] sm:text-xs">
                  <p className="text-neutral-400">Total paid</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {formatNGN(stats.totalPaid)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-[11px] sm:text-xs">
                <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 px-3 py-2.5">
                  <p className="text-neutral-100">Outstanding</p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-amber-300">
                    {formatNGN(stats.outstanding)}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/35 bg-emerald-950/40 px-3 py-2.5">
                  <p className="text-neutral-100">Upgrade</p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-emerald-300">
                    Studio + Priority
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-1.5 font-medium hover:bg-neutral-100"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Upgrade
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-500 px-4 py-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay balance
                </button>
              </div>
            </motion.div>

            {/* Payment method */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] p-4 sm:p-5"
            >
              <h2 className="text-sm sm:text-base font-medium">Payment method</h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(["card", "transfer", "wallet"] as PaymentMethodKey[]).map((method) => {
                  const icons = { card: <CreditCard className="h-3.5 w-3.5" />, transfer: <FileText className="h-3.5 w-3.5" />, wallet: <Wallet className="h-3.5 w-3.5" /> };
                  const labels = { card: "Card", transfer: "Bank transfer", wallet: "Wallet" };
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={`flex flex-col items-start rounded-2xl border px-3 py-2.5 text-left text-[11px] sm:text-xs transition-all ${
                        selectedMethod === method
                          ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                          : "border-neutral-700 bg-neutral-900/70"
                      }`}
                    >
                      <div className="flex items-center gap-2">{icons[method]}<span className="font-medium">{labels[method]}</span></div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </section>

          {/* ───────── RIGHT ───────── */}
          <section className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#101010] to-[#050505] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-sm sm:text-base font-medium">Invoices</h2>
                <span className="rounded-full border border-neutral-700 px-3 py-1 text-[10px] text-neutral-300 bg-neutral-900/70">
                  {INVOICES.length}
                </span>
              </div>

              <div className="space-y-2">
                {INVOICES.map((inv) => {
                  const styles = invoiceStatusStyles[inv.status];
                  return (
                    <div
                      key={inv.id}
                      className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/70 px-3 py-3 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:text-xs"
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] ${styles.chip}`}
                        >
                          {inv.status === "Paid" && <CheckCircle2 className="w-3 h-3" />}
                          {inv.status === "Pending" && <AlertCircle className="w-3 h-3" />}
                          {inv.status === "Overdue" && <XCircle className="w-3 h-3" />}
                          <span>{inv.status}</span>
                        </span>

                        <div className="min-w-0">
                          <p className="font-mono text-[11px] text-neutral-300">{inv.id}</p>
                          <p className="mt-0.5 truncate font-medium text-neutral-50">{inv.label}</p>
                          {inv.project && <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-[11px]">{inv.project}</p>}
                          <p className="mt-0.5 text-[10px] text-neutral-500">{inv.date}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-1 sm:items-end">
                        <p className="text-sm sm:text-base font-semibold text-neutral-50">{formatNGN(inv.amount)}</p>
                        <div className="flex flex-wrap gap-1.5 text-[10px] sm:text-[11px]">
                          <button className="inline-flex items-center gap-1 rounded-full border border-neutral-600 px-2.5 py-1 text-neutral-100">
                            <FileText className="w-3 h-3" /> Invoice
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-2.5 py-1 text-neutral-300">
                            <Download className="w-3 h-3" /> Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}

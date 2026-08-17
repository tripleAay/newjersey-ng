"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MainHeader from "@/components/dashboard components/mainheader";
import { ArrowLeft, CheckCircle2, Eye } from "lucide-react";

type RawOrder = {
  id: string;
  item_title: string | null;
  amount: number | string | null;
  order_status: string | null;
  payment_status: string | null;
  tx_ref: string | null;
  transaction_id: string | null;
  created_at: string | null;
  metadata?: {
    quantity?: number;
    [key: string]: unknown;
  } | null;
};

type OrderItem = {
  id: string;
  orderNumber: string;
  product: string;
  amount: number;
  quantity: number;
  status: "Paid" | "Processing" | "Delivered";
  date: string;
  ref: string;
};

const formatNGN = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusStyles: Record<OrderItem["status"], string> = {
  Paid: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Processing: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Delivered: "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

function formatOrderDate(dateString: string | null) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function makeOrderNumber(order: RawOrder, index: number) {
  if (order.transaction_id) return `FYN-${order.transaction_id}`;
  if (order.tx_ref) return order.tx_ref.slice(0, 18).toUpperCase();
  return `FYN-ORDER-${index + 1}`;
}

function mapStatus(order: RawOrder): OrderItem["status"] {
  const normalizedOrderStatus = String(order.order_status || "").toLowerCase();
  const normalizedPaymentStatus = String(order.payment_status || "").toLowerCase();

  if (normalizedOrderStatus === "completed") return "Delivered";
  if (normalizedOrderStatus === "processing") return "Processing";
  if (normalizedPaymentStatus === "paid") return "Paid";

  return "Processing";
}

export default function OrdersPage() {
  const [rawOrders, setRawOrders] = useState<RawOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const res = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load orders.");
        }

        if (isMounted) {
          setRawOrders(Array.isArray(data?.orders) ? data.orders : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load orders."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const orders = useMemo<OrderItem[]>(() => {
    return rawOrders.map((order, index) => ({
      id: order.id,
      orderNumber: makeOrderNumber(order, index),
      product: order.item_title || "Untitled order",
      amount: Number(order.amount || 0),
      quantity: Number(order.metadata?.quantity || 1),
      status: mapStatus(order),
      date: formatOrderDate(order.created_at),
      ref: order.tx_ref || "—",
    }));
  }, [rawOrders]);

  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <MainHeader />

      <section className="relative overflow-hidden px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-16 h-48 w-48 -translate-x-1/2 rounded-full bg-[#d6cc6d]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to shop
              </Link>

              <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/35">
                Orders
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Your order history
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">
                See every order you’ve made in one place. Open any order to view
                the complete details.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:block">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                Total orders
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {orders.length}
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
            <div className="hidden grid-cols-[1.2fr_1fr_.7fr_.8fr_.9fr_.9fr] gap-4 border-b border-white/8 px-6 py-4 text-[11px] uppercase tracking-[0.16em] text-white/35 md:grid">
              <p>Product</p>
              <p>Order ID</p>
              <p>Qty</p>
              <p>Amount</p>
              <p>Status</p>
              <p className="text-right">Action</p>
            </div>

            <div className="divide-y divide-white/8">
              {isLoading ? (
                <div className="px-6 py-10 text-sm text-white/45">
                  Loading orders...
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="px-4 py-4 transition hover:bg-white/[0.025] sm:px-6"
                  >
                    <div className="space-y-3 md:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {order.product}
                          </p>
                          <p className="mt-1 text-xs text-white/45">
                            {order.orderNumber}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs text-white/55">
                        <div>
                          <p className="text-white/30">Qty</p>
                          <p className="mt-1 text-white/85">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-white/30">Amount</p>
                          <p className="mt-1 text-white/85">
                            {formatNGN(order.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/30">Date</p>
                          <p className="mt-1 text-white/85">{order.date}</p>
                        </div>
                      </div>

                      <Link
                       href={`/shop/order/${order.id}`}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                      >
                        <Eye className="h-4 w-4" />
                        View details
                      </Link>
                    </div>

                    <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_.7fr_.8fr_.9fr_.9fr] md:items-center md:gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {order.product}
                        </p>
                        <p className="mt-1 text-xs text-white/45">{order.date}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm text-[#e7db9b]">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/35">
                          {order.ref}
                        </p>
                      </div>

                      <p className="text-sm text-white/75">{order.quantity}</p>

                      <p className="text-sm font-medium text-white">
                        {formatNGN(order.amount)}
                      </p>

                      <div>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href={`/shop/order/${order.orderNumber}`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                        >
                          <Eye className="h-4 w-4" />
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {!isLoading && orders.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">
                No orders yet
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Once you place an order, it will appear here.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
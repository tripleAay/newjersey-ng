import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: {
    id: string;
  };
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatNGN(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const rawId = decodeURIComponent(params.id);

  let order = null;
  let error = null;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      rawId
    );

  if (isUuid) {
    const result = await supabase
      .from("orders")
      .select("*")
      .eq("id", rawId)
      .maybeSingle();

    order = result.data;
    error = result.error;
  } else if (rawId.startsWith("FYN-")) {
    const transactionId = rawId.replace("FYN-", "");

    const result = await supabase
      .from("orders")
      .select("*")
      .eq("transaction_id", transactionId)
      .maybeSingle();

    order = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from("orders")
      .select("*")
      .eq("tx_ref", rawId)
      .maybeSingle();

    order = result.data;
    error = result.error;
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#050506] px-6 py-20 text-white">
        <Link
          href="/shop/order"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="mt-10">
          <h1 className="text-2xl font-semibold">Order not found</h1>
          <p className="mt-2 text-white/50">
            This order does not exist or has been removed.
          </p>
        </div>
      </main>
    );
  }

  const quantity = order?.metadata?.quantity || 1;

  return (
    <main className="min-h-screen bg-[#050506] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/shop/orders"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-semibold">
            {order.item_title || "Order details"}
          </h1>

          <p className="mt-1 text-sm text-white/45">
            Order ID: {order.transaction_id || order.tx_ref || order.id}
          </p>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            <div>
              <p className="text-white/30">Amount</p>
              <p className="mt-1 font-medium text-white">
                {formatNGN(Number(order.amount || 0))}
              </p>
            </div>

            <div>
              <p className="text-white/30">Quantity</p>
              <p className="mt-1 text-white">{quantity}</p>
            </div>

            <div>
              <p className="text-white/30">Currency</p>
              <p className="mt-1 text-white">{order.currency || "—"}</p>
            </div>

            <div>
              <p className="text-white/30">Payment Status</p>
              <p className="mt-1 capitalize text-emerald-400">
                {order.payment_status || "—"}
              </p>
            </div>

            <div>
              <p className="text-white/30">Order Status</p>
              <p className="mt-1 capitalize text-amber-400">
                {order.order_status || "—"}
              </p>
            </div>

            <div>
              <p className="text-white/30">Date</p>
              <p className="mt-1 text-white">{formatDate(order.created_at)}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="text-sm font-medium text-white/80">
              Customer Details
            </h2>

            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p>Name: {order.customer_name || "—"}</p>
              <p>Email: {order.customer_email || "—"}</p>
              <p>Phone: {order.customer_phone || "—"}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="text-sm font-medium text-white/80">
              Payment Information
            </h2>

            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p>Transaction ID: {order.transaction_id || "—"}</p>
              <p>Reference: {order.tx_ref || "—"}</p>
              <p>Provider: {order.payment_provider || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
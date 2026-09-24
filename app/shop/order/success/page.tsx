import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import type { ReactNode } from "react";

type PageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const orderNumber =
    params.order?.trim() || "Pending";

  const hasOrderNumber =
    orderNumber !== "Pending";

  const orderHref = hasOrderNumber
    ? `/shop/order/${encodeURIComponent(orderNumber)}`
    : "/shop";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#222]">
      <div className="mx-auto flex min-h-[88vh] w-[92%] max-w-[1000px] items-center justify-center py-14">
        <div className="w-full">
          {/* SUCCESS HEADER */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff2e8] text-[#FF6B00]">
              <CheckCircle2 size={30} />
            </div>

            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              Request received
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
              Your production request is in.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#777]">
              Your job is now ready for specification,
              artwork and pricing review before production
              is confirmed.
            </p>

            {/* ORDER REFERENCE */}
            <div className="mx-auto mt-8 inline-flex min-w-[260px] flex-col rounded-2xl border border-black/[0.07] bg-white px-7 py-5 shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#aaa]">
                Order reference
              </span>

              <span className="mt-2 font-mono text-lg font-bold tracking-wide">
                {orderNumber}
              </span>
            </div>

            {/* PRIMARY ACTION */}
            {hasOrderNumber && (
              <div className="mt-6 flex justify-center">
                <Link
                  href={orderHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#e86100]"
                >
                  View your order
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <StatusCard
              number="01"
              icon={<ClipboardCheck size={18} />}
              title="Request received"
              description="Your production brief has been submitted."
              completed
            />

            <StatusCard
              number="02"
              icon={<FileSearch size={18} />}
              title="Job review"
              description="Specifications, artwork and pricing are checked."
              active
            />

            <StatusCard
              number="03"
              icon={<PackageCheck size={18} />}
              title="Confirmation"
              description="Final details are approved before production begins."
            />
          </div>

          {/* NEXT STEP */}
          <div className="mt-8 rounded-[26px] bg-[#222] p-6 text-white sm:p-8">
            <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF8A33]">
                  What happens now
                </p>

                <h2 className="mt-3 text-xl font-bold tracking-[-0.025em]">
                  We review before payment and production.
                </h2>

                <p className="mt-2 max-w-lg text-xs leading-5 text-white/60">
                  Keep your order reference. It identifies
                  this job through artwork review, pricing,
                  production and delivery.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                {hasOrderNumber && (
                  <Link
                    href={orderHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#e86100] sm:w-auto"
                  >
                    <PackageCheck size={15} />
                    Track order
                    <ArrowRight size={15} />
                  </Link>
                )}

                <Link
                  href="/shop"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-xs font-bold text-[#222] transition hover:bg-[#f2f2f0] sm:w-auto"
                >
                  <ShoppingBag size={15} />
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>

          {/* PAYMENT NOTICE */}
          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#888]">
              <Check
                size={13}
                className="text-[#FF6B00]"
              />

              No payment has been taken.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusCard({
  number,
  icon,
  title,
  description,
  active = false,
  completed = false,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        active
          ? "border-[#FF6B00]/30 bg-[#fff7f0]"
          : "border-black/[0.06] bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            completed
              ? "bg-[#222] text-white"
              : active
                ? "bg-[#FF6B00] text-white"
                : "bg-[#f3f3f1] text-[#777]"
          }`}
        >
          {completed ? <Check size={17} /> : icon}
        </div>

        <span className="text-[9px] font-bold text-[#bbb]">
          {number}
        </span>
      </div>

      <p className="mt-5 text-sm font-bold">
        {title}
      </p>

      <p className="mt-2 text-[10px] leading-4 text-[#888]">
        {description}
      </p>
    </div>
  );
}s
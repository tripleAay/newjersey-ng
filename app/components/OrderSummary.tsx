"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useCart } from "@/app/contexts/cartContext";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

export default function OrderSummary() {
  const {
    items,
    itemCount,
    subtotal,
    designFee,
    estimatedTotal,
    hydrated,
  } = useCart();

  const needsDesign = items.some(
    (item) => item.artwork?.type === "design-needed"
  );

  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-6 text-[#181818]">
      <h2 className="text-xl font-bold tracking-tight">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#625D55]">Configured jobs</dt>
          <dd className="font-semibold">
            {hydrated ? itemCount : "—"}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-[#625D55]">Production</dt>
          <dd className="font-semibold">
            {hydrated ? currency.format(subtotal) : "—"}
          </dd>
        </div>

        {needsDesign && (
          <div className="flex justify-between gap-4">
            <dt className="text-[#625D55]">Design assistance</dt>
            <dd className="font-semibold">
              {hydrated ? currency.format(designFee) : "—"}
            </dd>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <dt className="text-[#625D55]">Delivery</dt>
          <dd className="text-right text-xs text-[#625D55]">
            Confirmed separately
          </dd>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
          <dt className="font-semibold">Estimated total</dt>
          <dd className="text-2xl font-bold tracking-tight">
            {hydrated ? currency.format(estimatedTotal) : "—"}
          </dd>
        </div>
      </dl>

      <p className="mt-2 text-right text-xs text-[#625D55]">
        Before delivery
      </p>

      {needsDesign && (
        <p className="mt-4 text-xs leading-6 text-[#625D55]">
          Design assistance is included above, once per configured
          design. Identical jobs share that design fee.
        </p>
      )}

      {hydrated && items.length > 0 ? (
        <Link
          href="/shop/checkout"
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F58220] px-5 py-4 text-sm font-semibold transition-colors hover:bg-[#D96B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
        >
          Continue to checkout
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 min-h-12 w-full rounded-xl bg-[#EFEDE7] px-5 py-4 text-sm font-semibold text-[#625D55]"
        >
          {hydrated ? "Add products to continue" : "Loading…"}
        </button>
      )}

      <p className="mt-4 text-center text-xs leading-6 text-[#625D55]">
        Review your details and production brief next.
        Payment is not taken at this step.
      </p>
    </div>
  );
}
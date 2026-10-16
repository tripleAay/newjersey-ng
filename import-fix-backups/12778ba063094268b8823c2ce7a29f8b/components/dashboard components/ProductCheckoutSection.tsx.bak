"use client";

import { useState } from "react";
import PayNowButton from "@/components/dashboard components/PayNowButton";

type ProductCheckoutSectionProps = {
  product: {
    id: string | number;
    price?: string | number | null;
  };
  title: string;
};

export default function ProductCheckoutSection({
  product,
  title,
}: ProductCheckoutSectionProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  return (
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div>
        <p className="text-base font-semibold text-white">Complete your order</p>
        <p className="mt-1 text-sm text-white/55">
          Enter your details, then continue to secure payment.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Your full name"
          className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/30"
        />

        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Your email address"
          className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/30"
        />

        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Your phone number"
          className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>

      <div className="mt-5">
        <PayNowButton
          serviceId={String(product.id)}
          serviceTitle={title}
          amount={Number(product.price) || 0}
          customerName={customerName}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          redirectUrl="/shop/success"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#d6cc6d] px-6 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </section>
  );
}
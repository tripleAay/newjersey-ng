"use client";

import Image from "next/image";
import Link from "next/link";
import PayNowButton from "@/components//dashboard components/PayNowButton";

export type ServiceDisplayItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  pricing: string | number;
  delivery: string;
  status: "Active" | "Draft" | "Paused";
  description?: string;
  features?: string[];
  link?: string;
};

type ServiceDisplayTileProps = {
  service?: ServiceDisplayItem | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  showDetailsButton?: boolean;
};

function formatPrice(price: string | number) {
  if (typeof price === "number") {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  }

  const raw = String(price).trim();
  const numeric = Number(raw.replace(/[^0-9.]/g, ""));

  if (!Number.isNaN(numeric) && numeric > 0) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return raw;
}

function numericAmount(price: string | number) {
  if (typeof price === "number") return price;

  const numeric = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function trimDescription(text?: string, maxLength = 82) {
  const fallback =
    "A premium Fynaro service designed for serious brands that want refined execution and clear delivery.";

  const value = (text || fallback).trim();

  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export default function ServiceDisplayTile({
  service,
  customerName = "",
  customerEmail = "",
  customerPhone = "",
  showDetailsButton = true,
}: ServiceDisplayTileProps) {
  if (!service) {
    return (
      <article className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
        <div className="animate-pulse space-y-3">
          <div className="h-32 rounded-[14px] bg-white/5" />
          <div className="h-4 w-2/3 rounded bg-white/5" />
          <div className="h-3 w-full rounded bg-white/5" />
          <div className="h-3 w-3/4 rounded bg-white/5" />
          <div className="flex gap-2">
            <div className="h-9 flex-1 rounded-full bg-white/5" />
            <div className="h-9 w-24 rounded-full bg-white/5" />
          </div>
        </div>
      </article>
    );
  }

  const amount = numericAmount(service.pricing);
  const displayPrice = formatPrice(service.pricing);
  const shortDescription = trimDescription(service.description, 82);

  return (
    <article className="group relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] transition duration-300 hover:border-white/20 hover:bg-white/[0.05]">
      {/* IMAGE */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={service.image || "/images/placeholder-service.jpg"}
          alt={service.title || "Service image"}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* PRICE */}
        <div className="absolute bottom-2 left-3">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/40">
            From
          </p>
          <p className="text-sm font-semibold text-[#eadb97]">{displayPrice}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-2.5 p-3">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-sm font-semibold leading-tight text-white">
            {service.title}
          </h3>

          <p className="line-clamp-2 text-[11px] leading-relaxed text-white/60">
            {shortDescription}
          </p>
        </div>

        {/* CTA ROW */}
        <div className="flex items-center gap-2 pt-1">
          <PayNowButton
            serviceId={service.id}
            serviceTitle={service.title}
            amount={amount}
            customerName={customerName}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
            redirectUrl="/shop/success"
            className="inline-flex h-8 flex-1 items-center justify-center rounded-full bg-[#d6cc6d] px-3 text-[11px] font-semibold text-black transition hover:scale-[1.02]"
          />

          {showDetailsButton && (
            <Link
              href={service.link || `/services/${service.id}`}
              className="inline-flex h-8 items-center justify-center rounded-full border border-white/10 px-3 text-[11px] font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
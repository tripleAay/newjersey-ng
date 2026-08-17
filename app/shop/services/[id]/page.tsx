import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Layers3,
  Sparkles,
  WalletCards,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard components/mainheader";
import DashboardBreadcrumb from "@/components/dashboard components/breadcrumb";
import Footer from "@/components/footer";
import PayNowButton from "@/components//dashboard components/PayNowButton";

type ServiceData = {
  id: string | number;
  title?: string | null;
  category?: string | null;
  subtitle?: string | null;
  pricing?: string | number | null;
  delivery?: string | null;
  status?: "Active" | "Draft" | "Paused" | string | null;
  description?: string | null;
  ctaNote?: string | null;
  tag?: string | null;
  isFeatured?: boolean | null;
  image?: string | null;
  features?: string[] | string | null;
  deliverables?: string[] | string | null;
  link?: string | null;
};

async function getService(id: string): Promise<ServiceData | null> {
  try {
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) return null;

    const res = await fetch(`${protocol}://${host}/api/services/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.service ?? data ?? null;
  } catch {
    return null;
  }
}

function formatPrice(price?: string | number | null) {
  if (price === null || price === undefined || price === "") {
    return "Price on request";
  }

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

function numericAmount(price?: string | number | null) {
  if (typeof price === "number") return price;
  if (!price) return 0;

  const numeric = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function parseStringList(value?: string[] | string | null): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0
        );
      }
      return [];
    } catch {
      return [];
    }
  }

  return [];
}

function statusClasses(status?: string | null) {
  switch (status) {
    case "Active":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    case "Paused":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
    case "Draft":
    default:
      return "border-white/10 bg-white/[0.05] text-white/70";
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#050506] text-white">
        <DashboardHeader />

        <div className="border-b border-white/5 px-3 pb-4 pt-30">
          <DashboardBreadcrumb
            items={[
              { label: "Shop", href: "/shop" },
              { label: "Services", href: "/shop/services" },
              { label: "Service" },
            ]}
          />
        </div>

        <main className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/shop/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition hover:border-white/25 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
              <h1 className="text-2xl font-semibold tracking-tight">
                Service not found
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                The service you are trying to open does not exist or is no
                longer available.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const title = service.title || "Service";
  const description =
    service.description ||
    service.subtitle ||
    "A premium Fynaro service designed for serious brands that want refined execution and clear delivery.";

  const displayPrice = formatPrice(service.pricing);
  const amount = numericAmount(service.pricing);
  const features = parseStringList(service.features);
  const deliverables = parseStringList(service.deliverables);
  const image = service.image || "/images/placeholder-service.jpg";

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <DashboardHeader />

      <div className="border-b border-white/5 px-3 pb-4 pt-30">
        <DashboardBreadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Services", href: "/shop/services" },
            { label: title },
          ]}
        />
      </div>

      <main className="px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <Link
            href="/shop/services"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,204,109,0.10),transparent_35%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />

            <div className="relative grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4 p-4 sm:p-6">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
                  <div className="relative min-h-[360px] sm:min-h-[500px] lg:min-h-[620px]">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                      {service.category || "Service"}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${statusClasses(
                        service.status
                      )}`}
                    >
                      {service.status || "Draft"}
                    </span>

                    {service.tag ? (
                      <span className="rounded-full border border-[#eadb97]/25 bg-[#eadb97]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#eadb97]">
                        {service.tag}
                      </span>
                    ) : null}

                    {service.isFeatured ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#eadb97]/20 bg-[#eadb97]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#eadb97]">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                    {title}
                  </h1>

                  <p className="mt-3 text-lg font-medium text-[#eadb97]">
                    {displayPrice}
                  </p>

                  {service.subtitle ? (
                    <p className="mt-4 text-sm leading-7 text-white/62 sm:text-[15px]">
                      {service.subtitle}
                    </p>
                  ) : null}

                  <p className="mt-5 text-sm leading-8 text-white/68 sm:text-base">
                    {description}
                  </p>

                  {service.ctaNote ? (
                    <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                        Why this service
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/80">
                        {service.ctaNote}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                      <WalletCards className="h-4 w-4" />
                      Pricing
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/82">
                      {displayPrice}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                      <Clock3 className="h-4 w-4" />
                      Delivery
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/82">
                      {service.delivery || "Timeline on request"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <PayNowButton
                      serviceId={String(service.id)}
                      serviceTitle={title}
                      amount={amount}
                      redirectUrl="/shop/success"
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#d6cc6d] px-6 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {service.link ? (
                    <Link
                      href={service.link}
                      target="_blank"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
                    >
                      Visit Service
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {features.length > 0 ? (
            <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                <Layers3 className="h-4 w-4" />
                Key Features
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={`${feature}-${index}`}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eadb97]/12 text-[#eadb97]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="mt-4 text-sm font-medium leading-6 text-white/85">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {deliverables.length > 0 ? (
            <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                <BadgeCheck className="h-4 w-4" />
                Deliverables
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {deliverables.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Deliverable {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-white/85">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
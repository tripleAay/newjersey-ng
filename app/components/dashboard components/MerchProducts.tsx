"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  GraduationCap,
  PackageCheck,
  Palette,
  Shirt,
  Trophy,
  Users,
} from "lucide-react";

type MerchRoute = {
  title: string;
  description: string;
  href: string;
  image: string;
  eyebrow: string;
  action: string;
};

type CustomUse = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

const merchRoutes: MerchRoute[] = [
  {
    title: "T-Shirts & Polos",
    description:
      "Everyday apparel for businesses, teams, campaigns and personal projects.",
    href: "/apparel/t-shirts",
    image: "/images/product-placeholder.svg",
    eyebrow: "Wear your brand",
    action: "Explore apparel",
  },
  {
    title: "Caps & Accessories",
    description:
      "Branded pieces that extend your identity beyond the usual printed materials.",
    href: "/apparel/caps",
    image: "/images/products/print/caps.webp",
    eyebrow: "Small format · high visibility",
    action: "Explore accessories",
  },
  {
    title: "Jerseys",
    description:
      "Custom jerseys for teams, communities, schools, events and organisations.",
    href: "/apparel/jerseys",
    image: "/images/product-placeholder.svg",
    eyebrow: "Built for groups",
    action: "Build your jersey",
  },
];

const customUses: CustomUse[] = [
  {
    title: "Corporate",
    description: "Staff apparel and branded company merchandise.",
    href: "/apparel/corporate",
    icon: Building2,
  },
  {
    title: "Teams",
    description: "Jerseys and coordinated apparel for your squad.",
    href: "/apparel/team-jerseys",
    icon: Users,
  },
  {
    title: "Schools",
    description: "Student, staff, club and school-event apparel.",
    href: "/apparel/school",
    icon: GraduationCap,
  },
  {
    title: "Events",
    description: "Merchandise made around your event and audience.",
    href: "/apparel/events",
    icon: CalendarDays,
  },
];

export default function ApparelMerchSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1EEE7] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[92%] max-w-[1440px]">
        {/* =====================================================
            INTRO
        ===================================================== */}

        <div className="grid gap-7 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7 bg-[#FF6B00]" />

              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                Apparel & merchandise
              </span>
            </div>

            <h2 className="mt-4 max-w-[700px] text-[38px] font-black leading-[0.98] tracking-[-0.045em] text-[#191919] sm:text-[48px] lg:text-[58px]">
              Put the brand
              <br />
              on something people wear.
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-[540px] text-[13px] leading-6 text-[#716E68] sm:text-sm">
              T-shirts, polos, caps, jerseys and merchandise produced
              for businesses, teams, schools, events and people building
              something worth recognising.
            </p>

            <Link
              href="/apparel"
              className="group mt-6 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#191919] transition hover:text-[#FF6B00]"
            >
              Explore all apparel

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 transition-all group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white">
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>
        </div>

        {/* =====================================================
            THREE PRIMARY ROUTES
        ===================================================== */}

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {merchRoutes.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative min-h-[470px] overflow-hidden rounded-[24px] bg-[#222]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 92vw, 31vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/5" />

              <div className="absolute left-5 top-5">
                <span className="text-[9px] font-black tracking-[0.16em] text-white/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#191919] transition-all duration-300 group-hover:bg-[#FF6B00] group-hover:text-white">
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#FF7A1A]">
                  {item.eyebrow}
                </p>

                <h3 className="mt-3 text-[27px] font-black tracking-[-0.04em] text-white">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-[340px] text-[11px] leading-5 text-white/55">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.12em] text-white">
                  {item.action}

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* =====================================================
            READY VS BRANDED
        ===================================================== */}

        <div className="mt-5 grid overflow-hidden rounded-[24px] bg-white lg:grid-cols-2">
          {/* READY TO ORDER */}

          <div className="relative p-7 sm:p-9 lg:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#191919] text-white">
              <PackageCheck size={18} />
            </div>

            <p className="mt-7 text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6B00]">
              Need it straightforward?
            </p>

            <h3 className="mt-3 max-w-[420px] text-[27px] font-black leading-[1.05] tracking-[-0.035em] text-[#191919] sm:text-[32px]">
              Start with the product.
            </h3>

            <p className="mt-4 max-w-[480px] text-[11px] leading-5 text-[#77736D]">
              Choose the apparel first, then select quantity, size and
              available production options. Good for smaller and simpler
              orders.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "T-Shirts",
                "Polos",
                "Caps",
                "Tote Bags",
                "Mugs",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/10 bg-[#F7F6F3] px-3 py-2 text-[9px] font-bold text-[#5F5B55]"
                >
                  {item}
                </span>
              ))}
            </div>

            <Link
              href="/apparel/shop"
              className="group mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#191919] transition hover:text-[#FF6B00]"
            >
              Shop apparel

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* MADE TO ORDER */}

          <div className="relative overflow-hidden bg-[#FF6B00] p-7 text-white sm:p-9 lg:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full border-[45px] border-white/[0.08]"
            />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#FF6B00]">
                <Palette size={18} />
              </div>

              <p className="mt-7 text-[9px] font-black uppercase tracking-[0.16em] text-white/65">
                Need your identity on it?
              </p>

              <h3 className="mt-3 max-w-[440px] text-[27px] font-black leading-[1.05] tracking-[-0.035em] sm:text-[32px]">
                Start with the brand.
              </h3>

              <p className="mt-4 max-w-[490px] text-[11px] leading-5 text-white/70">
                Send your logo, artwork or idea. We&apos;ll work out the
                product, placement and production requirements around the
                job.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  "Logo Print",
                  "Team Orders",
                  "Staff Wear",
                  "Event Merch",
                  "Bulk Production",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-bold text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <Link
                href="/apparel/custom"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#191919] px-5 py-3 text-[9px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#191919]"
              >
                Start branded order

                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            CUSTOM / ORGANISATION USE CASES
        ===================================================== */}

        <div className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">
                Made around your people
              </p>

              <h3 className="mt-2 text-[21px] font-black tracking-[-0.03em] text-[#191919]">
                Who are you producing for?
              </h3>
            </div>

            <Shirt
              size={22}
              strokeWidth={1.5}
              className="hidden text-black/20 sm:block"
            />
          </div>

          <div className="grid overflow-hidden rounded-[22px] border border-black/[0.08] bg-white sm:grid-cols-2 lg:grid-cols-4">
            {customUses.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`
                    group
                    relative
                    min-h-[220px]
                    p-6
                    transition-colors
                    hover:bg-[#191919]

                    ${
                      index > 0
                        ? "border-t border-black/[0.08] sm:border-l"
                        : ""
                    }

                    ${
                      index === 2
                        ? "sm:border-l-0 lg:border-l"
                        : ""
                    }

                    ${
                      index >= 2
                        ? "sm:border-t lg:border-t-0"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F1EA] text-[#191919] transition-colors group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon size={17} />
                    </div>

                    <ArrowUpRight
                      size={14}
                      className="text-black/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF6B00]"
                    />
                  </div>

                  <div className="mt-9">
                    <h4 className="text-[15px] font-black text-[#191919] transition-colors group-hover:text-white">
                      {item.title}
                    </h4>

                    <p className="mt-3 max-w-[220px] text-[10px] leading-5 text-[#85817A] transition-colors group-hover:text-white/50">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            JERSEY / BULK PROJECT CTA
        ===================================================== */}

        <div className="mt-6 grid overflow-hidden rounded-[24px] bg-[#191919] text-white lg:grid-cols-[1fr_auto]">
          <div className="flex gap-5 p-7 sm:items-center sm:p-9">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF6B00]">
              <Trophy size={19} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                Team, school or organisation?
              </p>

              <h3 className="mt-2 text-[20px] font-black tracking-[-0.025em] sm:text-[22px]">
                Ordering for more than one person?
              </h3>

              <p className="mt-2 max-w-[670px] text-[10px] leading-5 text-white/45">
                Tell us the quantity, product, sizes and branding
                requirements. We&apos;ll structure the production instead
                of making you configure every piece individually.
              </p>
            </div>
          </div>

          <Link
            href="/apparel/custom"
            className="group flex min-h-[90px] items-center justify-between gap-8 bg-white px-7 text-[#191919] transition-colors hover:bg-[#FF6B00] hover:text-white lg:min-w-[250px]"
          >
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.12em]">
                Start bulk order
              </span>

              <span className="mt-1 block text-[9px] opacity-50">
                Get production pricing
              </span>
            </div>

            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
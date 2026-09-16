"use client";

import Link from "next/link";
import {
  Shirt,
  BadgeCheck,
  CircleDot,
  Coffee,
  ShoppingBag,
  Palette,
  Printer,
  Trophy,
  Users,
  Building2,
  CalendarDays,
  GraduationCap,
  Sparkles,
  Clock3,
  ArrowUpRight,
  PackageCheck,
  Layers3,
} from "lucide-react";

const availableNow = [
  {
    name: "Blank T-Shirts",
    icon: Shirt,
    href: "/apparel/t-shirts",
  },
  {
    name: "Selected Polos",
    icon: BadgeCheck,
    href: "/apparel/polos",
  },
  {
    name: "Selected Caps",
    icon: CircleDot,
    href: "/apparel/caps",
  },
  {
    name: "Selected Mugs",
    icon: Coffee,
    href: "/apparel/mugs",
  },
  {
    name: "Selected Tote Bags",
    icon: ShoppingBag,
    href: "/apparel/tote-bags",
  },
];

const madeToOrder = [
  {
    name: "Printed T-Shirts",
    icon: Printer,
    href: "/apparel/printed-t-shirts",
  },
  {
    name: "Branded Polos",
    icon: Shirt,
    href: "/apparel/branded-polos",
  },
  {
    name: "Branded Caps",
    icon: CircleDot,
    href: "/apparel/branded-caps",
  },
  {
    name: "Branded Mugs",
    icon: Coffee,
    href: "/apparel/branded-mugs",
  },
  {
    name: "Branded Tote Bags",
    icon: ShoppingBag,
    href: "/apparel/branded-tote-bags",
  },
];

const customMerch = [
  {
    name: "Branded Jerseys",
    icon: Trophy,
    href: "/apparel/branded-jerseys",
  },
  {
    name: "Team Jerseys",
    icon: Users,
    href: "/apparel/team-jerseys",
  },
  {
    name: "Corporate Apparel",
    icon: Building2,
    href: "/apparel/corporate",
  },
  {
    name: "Event Merchandise",
    icon: CalendarDays,
    href: "/apparel/events",
  },
  {
    name: "Staff Uniforms",
    icon: BadgeCheck,
    href: "/apparel/uniforms",
  },
  {
    name: "School Apparel",
    icon: GraduationCap,
    href: "/apparel/school",
  },
];

const preOrderItems = [
  {
    name: "NewJersey Merchandise Drops",
    href: "/apparel/drops",
  },
  {
    name: "Limited-Edition Jerseys",
    href: "/apparel/limited-edition",
  },
  {
    name: "Seasonal Collections",
    href: "/apparel/seasonal",
  },
  {
    name: "NewJersey Branded Apparel",
    href: "/apparel/newjersey",
  },
];

export default function ApparelMerchSection() {
  return (
    <section className="w-full bg-[#f6f6f6] py-10 md:py-14">
      <div className="mx-auto w-[92%] max-w-[1440px]">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF6B00]" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
                NewJersey.ng
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#262626] md:text-4xl">
              APPAREL & MERCH
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#737373] md:text-base">
              Shop ready-to-buy essentials, order branded merchandise, or
              create custom apparel for your team, business, school, or event.
            </p>
          </div>

          <Link
            href="/apparel"
            className="group flex w-fit items-center gap-3 text-sm font-bold text-[#262626] transition hover:text-[#FF6B00]"
          >
            Explore Apparel

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dcdcdc] transition-all duration-300 group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>

        {/* TOP AREA */}
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1.85fr]">
          {/* AVAILABLE NOW */}
          <div className="relative overflow-hidden rounded-3xl bg-[#262626] p-6 text-white md:p-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#FF6B00]/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00]">
                  <PackageCheck size={23} />
                </div>

                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Available Now
                </span>
              </div>

              <h3 className="mt-7 text-3xl font-bold leading-tight">
                Ready when
                <br />
                you are.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
                A selected range of ready-to-order apparel and merchandise for
                when you need something without starting a custom project.
              </p>

              <div className="mt-7 space-y-2">
                {availableNow.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 transition hover:border-[#FF6B00]/50 hover:bg-white/[0.09]"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={17}
                          className="text-[#FF6B00]"
                        />

                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                      </div>

                      <ArrowUpRight
                        size={16}
                        className="text-white/35 transition group-hover:text-[#FF6B00]"
                      />
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/apparel/shop"
                className="mt-7 flex items-center justify-between rounded-xl bg-white px-5 py-4 text-sm font-bold text-[#262626] transition hover:bg-[#FF6B00] hover:text-white"
              >
                Shop Available Products

                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          {/* MADE TO ORDER */}
          <div className="rounded-3xl border border-[#e7e7e7] bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0e6] text-[#FF6B00]">
                    <Layers3 size={16} />
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                    Made to Order
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold text-[#262626]">
                  Made specifically for you.
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#777]">
                  Choose your apparel or merchandise, add your branding, and
                  we'll produce it based on your requirements.
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#f3f3f3] px-3 py-1.5 text-xs font-semibold text-[#777]">
                {madeToOrder.length} Options
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {madeToOrder.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative flex min-h-[120px] items-center gap-4 overflow-hidden rounded-2xl border border-[#ededed] bg-[#fafafa] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/40 hover:bg-white hover:shadow-lg"
                  >
                    <span className="absolute right-4 top-3 text-xs font-bold text-[#d8d8d8]">
                      0{index + 1}
                    </span>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#262626] shadow-sm transition group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#262626] group-hover:text-[#FF6B00]">
                        {item.name}
                      </h4>

                      <span className="mt-2 inline-block text-xs text-[#888]">
                        Create your order →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/apparel/made-to-order"
              className="mt-6 flex w-fit items-center gap-2 text-sm font-bold text-[#FF6B00]"
            >
              View Made-to-Order Options

              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* CUSTOM MERCH */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-[#e8e8e8] bg-white">
          <div className="grid lg:grid-cols-[0.85fr_2.15fr]">
            {/* Custom intro */}
            <div className="relative bg-[#fff0e6] p-6 md:p-8">
              <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full border-[30px] border-[#FF6B00]/10" />

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00] text-white">
                  <Palette size={22} />
                </div>

                <span className="mt-7 block text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                  Custom
                </span>

                <h3 className="mt-3 text-3xl font-bold leading-tight text-[#262626]">
                  Built around
                  <br />
                  your people.
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#777]">
                  From sports teams and staff uniforms to corporate apparel and
                  event merchandise.
                </p>

                <Link
                  href="/apparel/custom"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#262626] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#FF6B00]"
                >
                  Start a Custom Project

                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            {/* Custom services */}
            <div className="grid grid-cols-2 gap-px bg-[#e8e8e8] sm:grid-cols-3">
              {customMerch.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group min-h-[180px] bg-white p-5 transition hover:bg-[#262626]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e6] text-[#FF6B00] transition group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon size={19} />
                    </div>

                    <div className="mt-8">
                      <h4 className="text-sm font-bold text-[#262626] transition group-hover:text-white">
                        {item.name}
                      </h4>

                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#999] transition group-hover:text-[#FF9A55]">
                        Custom Solution

                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* PRE-ORDER */}
        <div className="mt-5 rounded-3xl bg-[#262626] p-5 text-white md:p-7">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
            <div className="lg:w-[30%]">
              <div className="flex items-center gap-2">
                <Clock3 size={17} className="text-[#FF6B00]" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                  Pre-Order
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold">
                Get it before it drops.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Upcoming collections, limited releases, and exclusive
                NewJersey merchandise.
              </p>

              <Link
                href="/apparel/pre-order"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00]"
              >
                See Upcoming Drops

                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {preOrderItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative min-h-[150px] rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]"
                >
                  <span className="text-xs font-bold text-[#FF6B00] transition group-hover:text-white/60">
                    DROP 0{index + 1}
                  </span>

                  <h4 className="mt-8 text-sm font-bold leading-6 text-white">
                    {item.name}
                  </h4>

                  <Sparkles
                    size={17}
                    className="absolute bottom-5 right-5 text-white/30 transition group-hover:text-white"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
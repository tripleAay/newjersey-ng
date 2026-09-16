"use client";

import Link from "next/link";
import {
  PenTool,
  FileImage,
  Image as ImageIcon,
  Smartphone,
  Palette,
  Megaphone,
  PartyPopper,
  Package,
  Gift,
  CalendarDays,
  GraduationCap,
  Church,
  BadgePercent,
  Sparkles,
  ArrowUpRight,
  Plus,
  Layers3,
  Lightbulb,
  MessageSquarePlus,
} from "lucide-react";

/* =========================================
   ART & CREATIVE SERVICES
========================================= */

const creativeServices = [
  {
    name: "Logo Design",
    description: "Create a memorable visual mark for your brand.",
    icon: PenTool,
    href: "/art/logo-design",
  },
  {
    name: "Flyer Design",
    description: "Professional designs that communicate clearly.",
    icon: FileImage,
    href: "/art/flyer-design",
  },
  {
    name: "Poster Design",
    description: "Eye-catching artwork built to get attention.",
    icon: ImageIcon,
    href: "/art/poster-design",
  },
  {
    name: "Social Media Design",
    description: "Creative visuals designed for your digital presence.",
    icon: Smartphone,
    href: "/art/social-media-design",
  },
  {
    name: "Brand Identity",
    description: "Build a complete and consistent visual identity.",
    icon: Palette,
    href: "/art/brand-identity",
  },
  {
    name: "Marketing Artwork",
    description: "Creative materials built to support your campaigns.",
    icon: Megaphone,
    href: "/art/marketing-artwork",
  },
  {
    name: "Event Artwork",
    description: "Visual experiences designed around your event.",
    icon: PartyPopper,
    href: "/art/event-artwork",
  },
];

/* =========================================
   CUSTOM SERVICES
========================================= */

const customServices = [
  {
    name: "Custom Packaging",
    icon: Package,
    href: "/custom/packaging",
  },
  {
    name: "Corporate Souvenirs",
    icon: Gift,
    href: "/custom/corporate-souvenirs",
  },
  {
    name: "Event Souvenirs",
    icon: CalendarDays,
    href: "/custom/event-souvenirs",
  },
  {
    name: "School Materials",
    icon: GraduationCap,
    href: "/custom/school-materials",
  },
  {
    name: "Church Materials",
    icon: Church,
    href: "/custom/church-materials",
  },
  {
    name: "Promotional Products",
    icon: BadgePercent,
    href: "/custom/promotional-products",
  },
  {
    name: "Special Production Requests",
    icon: Sparkles,
    href: "/custom/special-requests",
  },
];

/* =========================================
   MAIN COMPONENT
========================================= */

export default function ArtCreativeCustomSection() {
  return (
    <section className="w-full bg-[#f7f7f7] py-10 md:py-14">
      <div className="mx-auto w-[92%] max-w-[1440px]">
        {/* =====================================================
            ART & CREATIVE
        ===================================================== */}

        <div className="mb-16">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0e6] text-[#FF6B00]">
                  <Palette size={15} />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
                  Creative Studio
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#262626] md:text-4xl">
                ART & CREATIVE
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#737373] md:text-base">
                From individual design requests to complete creative systems,
                we help bring your ideas, campaigns, brands, and events to
                life visually.
              </p>
            </div>

            <Link
              href="/art"
              className="group flex w-fit items-center gap-3 text-sm font-bold text-[#262626] transition hover:text-[#FF6B00]"
            >
              Explore Creative Services

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] text-white transition-all duration-300 group-hover:bg-[#FF6B00] group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>

          {/* Creative content */}
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1.8fr]">
            {/* Left Creative Statement */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#FF6B00] p-7 text-white md:p-9">
              {/* Decorative shapes */}
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-[35px] border-white/10" />

              <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#262626]/10 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#FF6B00] shadow-lg">
                  <Lightbulb size={25} />
                </div>

                <span className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                  100% Custom Creative Work
                </span>

                <h3 className="mt-4 text-4xl font-bold leading-tight">
                  An idea is
                  <br />
                  where it starts.
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
                  Whether you have a clear brief or just a rough idea, our
                  creative services are built around what you want to achieve.
                </p>

                <div className="mt-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                      01
                    </span>

                    <span className="text-sm font-medium">
                      Share your idea
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                      02
                    </span>

                    <span className="text-sm font-medium">
                      We create the direction
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                      03
                    </span>

                    <span className="text-sm font-medium">
                      Refine and bring it to life
                    </span>
                  </div>
                </div>

                <Link
                  href="/art/request"
                  className="mt-auto pt-10"
                >
                  <div className="flex items-center justify-between rounded-2xl bg-[#262626] px-5 py-4 text-sm font-bold transition hover:bg-white hover:text-[#FF6B00]">
                    Start a Creative Request

                    <ArrowUpRight size={18} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Services */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {creativeServices.map((service, index) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="group relative flex min-h-[210px] flex-col rounded-3xl border border-[#e7e7e7] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/40 hover:shadow-xl"
                  >
                    <span className="absolute right-5 top-5 text-xs font-bold text-[#d4d4d4]">
                      0{index + 1}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e6] text-[#FF6B00] transition-all duration-300 group-hover:rotate-6 group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>

                    <div className="mt-auto pt-7">
                      <h4 className="text-base font-bold text-[#262626] transition group-hover:text-[#FF6B00]">
                        {service.name}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-[#888]">
                        {service.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#FF6B00]">
                        Request Service

                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Extra request card */}
              <Link
                href="/art/custom-request"
                className="group flex min-h-[210px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#FF6B00]/50 bg-[#fffaf6] p-6 text-center transition hover:bg-[#FF6B00]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#FF6B00]/30 text-[#FF6B00] transition group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white">
                  <Plus size={22} />
                </div>

                <h4 className="mt-5 text-sm font-bold text-[#262626] transition group-hover:text-white">
                  Something Else?
                </h4>

                <p className="mt-2 text-xs leading-5 text-[#888] transition group-hover:text-white/75">
                  Tell us what you need.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            CUSTOM
        ===================================================== */}

        <div>
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-[2px] w-8 bg-[#FF6B00]" />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
                  Bespoke Solutions
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#262626] md:text-4xl">
                CUSTOM
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#737373] md:text-base">
                Have something specific in mind? From packaging and souvenirs
                to specialized materials and unique production requests, we
                help make it happen.
              </p>
            </div>

            <Link
              href="/custom"
              className="group flex w-fit items-center gap-3 text-sm font-bold text-[#262626] transition hover:text-[#FF6B00]"
            >
              Explore Custom Solutions

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dedede] transition group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>

          {/* Custom layout */}
          <div className="overflow-hidden rounded-[2rem] bg-[#262626]">
            <div className="grid lg:grid-cols-[2fr_1fr]">
              {/* Services grid */}
              <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3">
                {customServices.map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="group relative flex min-h-[200px] flex-col bg-[#262626] p-6 transition hover:bg-[#303030]"
                    >
                      <span className="text-xs font-bold tracking-wider text-white/20">
                        CUSTOM 0{index + 1}
                      </span>

                      <div className="mt-auto">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#FF6B00] transition group-hover:bg-[#FF6B00] group-hover:text-white">
                          <Icon size={19} />
                        </div>

                        <h3 className="mt-5 text-sm font-bold leading-6 text-white">
                          {service.name}
                        </h3>

                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/40 transition group-hover:text-[#FF6B00]">
                          Discuss Project

                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Right CTA */}
              <div className="relative flex flex-col justify-between overflow-hidden bg-[#FF6B00] p-7 text-white md:p-9">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full border-[40px] border-white/10" />

                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#FF6B00]">
                    <MessageSquarePlus size={24} />
                  </div>

                  <span className="mt-8 block text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                    Don't see it listed?
                  </span>

                  <h3 className="mt-4 text-4xl font-bold leading-tight">
                    Let's build
                    <br />
                    something new.
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/80">
                    Some of the best projects don't fit neatly into a category.
                    Tell us what you have in mind and we'll explore the best
                    way to make it happen.
                  </p>
                </div>

                <Link
                  href="/custom/request"
                  className="relative z-10 mt-10 flex items-center justify-between rounded-2xl bg-[#262626] px-5 py-4 text-sm font-bold transition hover:bg-white hover:text-[#FF6B00]"
                >
                  Make a Special Request

                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom message */}
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#e8e8e8] bg-white p-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[#FF6B00]">
                <Sparkles size={20} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#262626]">
                  Have an idea that doesn't fit a category?
                </h4>

                <p className="mt-1 text-xs leading-5 text-[#888]">
                  Custom projects start with a conversation.
                </p>
              </div>
            </div>

            <Link
              href="/custom/request"
              className="flex w-fit items-center gap-2 text-sm font-bold text-[#FF6B00]"
            >
              Tell Us About It

              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
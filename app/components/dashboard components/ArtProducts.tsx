"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BadgePercent,
  Boxes,
  Building2,
  CalendarDays,
  Church,
  FileImage,
  Gift,
  GraduationCap,
  Image as ImageIcon,
  Layers3,
  Lightbulb,
  Megaphone,
  MessageSquarePlus,
  Package,
  Palette,
  PartyPopper,
  PenTool,
  Plus,
  Smartphone,
  Sparkles,
} from "lucide-react";

/* =========================================================
   CREATIVE SERVICES
========================================================= */

const creativeServices = [
  {
    name: "Logo Design",
    description:
      "A distinctive logo designed around your business, audience and positioning.",
    icon: PenTool,
    href: "/art/logo-design",
  },
  {
    name: "Flyer Design",
    description:
      "Campaign, promotional and informational flyers prepared for print or digital use.",
    icon: FileImage,
    href: "/art/flyer-design",
  },
  {
    name: "Poster Design",
    description:
      "High-impact poster artwork for campaigns, announcements, events and promotions.",
    icon: ImageIcon,
    href: "/art/poster-design",
  },
  {
    name: "Social Media Design",
    description:
      "Branded visual assets built for your social channels and digital campaigns.",
    icon: Smartphone,
    href: "/art/social-media-design",
  },
  {
    name: "Brand Identity",
    description:
      "A coordinated visual system covering logo direction, typography, colours and usage.",
    icon: Palette,
    href: "/art/brand-identity",
  },
  {
    name: "Marketing Artwork",
    description:
      "Campaign-ready creative assets designed to support promotions and customer acquisition.",
    icon: Megaphone,
    href: "/art/marketing-artwork",
  },
  {
    name: "Event Artwork",
    description:
      "Invitations, digital graphics, signage artwork and supporting visuals for your event.",
    icon: PartyPopper,
    href: "/art/event-artwork",
  },
];

/* =========================================================
   CUSTOM PRODUCTION

   These are deliberately positioned as PROJECTS rather
   than normal catalogue products.
========================================================= */

const customServices = [
  {
    name: "Bespoke Packaging",
    description:
      "Packaging projects requiring unusual formats, finishes, quantities or production.",
    icon: Package,
    href: "/custom/packaging",
  },
  {
    name: "Corporate Souvenirs",
    description:
      "Branded gift and merchandise combinations prepared around your organisation.",
    icon: Gift,
    href: "/custom/corporate-souvenirs",
  },
  {
    name: "Event Production",
    description:
      "Coordinated print, merchandise and visual materials for events and activations.",
    icon: CalendarDays,
    href: "/custom/event-production",
  },
  {
    name: "School Projects",
    description:
      "Custom printed and branded materials produced around school requirements.",
    icon: GraduationCap,
    href: "/custom/school-projects",
  },
  {
    name: "Church Projects",
    description:
      "Purpose-built print, merchandise and event materials for churches and ministries.",
    icon: Church,
    href: "/custom/church-projects",
  },
  {
    name: "Promotional Campaigns",
    description:
      "Multi-item promotional production for launches, campaigns and customer engagement.",
    icon: BadgePercent,
    href: "/custom/promotional-campaigns",
  },
];

/* =========================================================
   PROCESS
========================================================= */

const creativeProcess = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Share the idea, objective, references or rough direction you already have.",
  },
  {
    number: "02",
    title: "We shape the direction",
    description:
      "We turn the brief into a clear creative direction built around the intended use.",
  },
  {
    number: "03",
    title: "Review and refine",
    description:
      "You review the work and we refine the approved direction where required.",
  },
  {
    number: "04",
    title: "Receive production-ready work",
    description:
      "Final files are prepared for their intended digital, print or production use.",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ArtCreativeCustomSection() {
  return (
    <section className="w-full bg-[#f7f7f5]">
      {/* =====================================================
          CREATIVE STUDIO
      ===================================================== */}

      <div className="border-t border-black/[0.06] py-12 md:py-16">
        <div className="mx-auto w-[92%] max-w-[1440px]">
          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e6] text-[#FF6B00]">
                  <Palette size={17} />
                </span>

                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
                  Creative Studio
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-[-0.035em] text-[#242424] sm:text-4xl md:text-[44px]">
                Need it designed?
                <br className="hidden sm:block" /> Start here.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#747474] md:text-base">
                NewJersey Creative Studio handles the design work behind the
                things you print, publish, promote and present.
              </p>
            </div>

            <Link
              href="/art"
              className="group inline-flex w-fit items-center gap-3 text-sm font-bold text-[#262626] transition hover:text-[#FF6B00]"
            >
              Explore Creative Studio

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] text-white transition duration-300 group-hover:bg-[#FF6B00]">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          </div>

          {/* MAIN CREATIVE AREA */}

          <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
            {/* FEATURE CARD */}

            <div className="relative min-h-[520px] overflow-hidden rounded-[28px] bg-[#FF6B00] p-7 text-white sm:p-9">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-white/[0.08]" />

              <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#FF6B00] shadow-lg">
                    <Lightbulb size={24} />
                  </div>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]">
                    Design Service
                  </span>
                </div>

                <div className="mt-12">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">
                    Have the idea. Need the execution.
                  </p>

                  <h3 className="mt-4 max-w-md text-4xl font-bold leading-[1.03] tracking-[-0.04em] sm:text-5xl">
                    Bring us the brief.
                  </h3>

                  <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
                    You do not need a finished concept before contacting us.
                    Bring the objective, rough idea, references or even the
                    problem. We&apos;ll help shape the visual direction.
                  </p>
                </div>

                <div className="mt-auto pt-12">
                  <Link
                    href="/art/request"
                    className="group flex items-center justify-between rounded-2xl bg-[#262626] px-5 py-4 text-sm font-bold transition hover:bg-white hover:text-[#FF6B00]"
                  >
                    Start a Creative Request

                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>

                  <p className="mt-3 text-[10px] leading-5 text-white/60">
                    Tell us what you&apos;re creating, where it will be used
                    and when you need it.
                  </p>
                </div>
              </div>
            </div>

            {/* SERVICES */}

            <div className="grid gap-3 sm:grid-cols-2">
              {creativeServices.map((service, index) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="group relative flex min-h-[180px] flex-col rounded-[22px] border border-black/[0.07] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#FF6B00]/30 hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)] sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2e9] text-[#FF6B00] transition duration-300 group-hover:bg-[#FF6B00] group-hover:text-white">
                        <Icon size={19} strokeWidth={1.8} />
                      </span>

                      <span className="text-[10px] font-bold tracking-[0.16em] text-[#c8c8c8]">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="mt-auto pt-7">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-[15px] font-bold text-[#292929] transition group-hover:text-[#FF6B00]">
                          {service.name}
                        </h3>

                        <ArrowUpRight
                          size={15}
                          className="shrink-0 text-[#b5b5b5] transition group-hover:text-[#FF6B00]"
                        />
                      </div>

                      <p className="mt-2 max-w-md text-[12px] leading-5 text-[#858585]">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                );
              })}

              {/* SOMETHING ELSE */}

              <Link
                href="/art/custom-request"
                className="group flex min-h-[180px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#FF6B00]/35 bg-[#fffaf6] p-6 text-center transition duration-300 hover:border-[#FF6B00] hover:bg-[#FF6B00]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FF6B00]/25 text-[#FF6B00] transition group-hover:border-white/25 group-hover:bg-white/10 group-hover:text-white">
                  <Plus size={19} />
                </span>

                <h3 className="mt-4 text-sm font-bold text-[#292929] transition group-hover:text-white">
                  Something else?
                </h3>

                <p className="mt-2 text-xs text-[#8a8a8a] transition group-hover:text-white/70">
                  Describe the design you need.
                </p>
              </Link>
            </div>
          </div>

          {/* CREATIVE PROCESS */}

          <div className="mt-5 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white">
            <div className="grid md:grid-cols-[0.7fr_1.3fr]">
              <div className="border-b border-black/[0.06] p-6 md:border-b-0 md:border-r md:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#262626] text-white">
                  <Layers3 size={18} />
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight text-[#262626]">
                  From idea to usable artwork.
                </h3>

                <p className="mt-3 max-w-sm text-xs leading-6 text-[#858585]">
                  A straightforward process designed to move from your brief to
                  work you can actually use.
                </p>
              </div>

              <div className="grid sm:grid-cols-2">
                {creativeProcess.map((step) => (
                  <div
                    key={step.number}
                    className="border-b border-black/[0.06] p-5 last:border-b-0 sm:p-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <span className="text-[10px] font-black tracking-[0.18em] text-[#FF6B00]">
                      {step.number}
                    </span>

                    <h4 className="mt-3 text-sm font-bold text-[#303030]">
                      {step.title}
                    </h4>

                    <p className="mt-2 text-[11px] leading-5 text-[#8c8c8c]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CUSTOM PRODUCTION
      ===================================================== */}

      <div className="bg-[#1f1f1f] py-12 text-white md:py-16">
        <div className="mx-auto w-[92%] max-w-[1440px]">
          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#FF6B00]" />

                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
                  Custom Production
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl md:text-[44px]">
                Not everything belongs
                <br className="hidden sm:block" /> in a catalogue.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
                For projects involving unusual quantities, multiple products,
                special production requirements or something we don&apos;t
                normally list.
              </p>
            </div>

            <Link
              href="/custom"
              className="group inline-flex w-fit items-center gap-3 text-sm font-bold text-white transition hover:text-[#FF6B00]"
            >
              Explore Custom Projects

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          </div>

          {/* CUSTOM PROJECTS */}

          <div className="overflow-hidden rounded-[28px] border border-white/[0.08]">
            <div className="grid xl:grid-cols-[1.55fr_0.75fr]">
              <div className="grid grid-cols-2 gap-px bg-white/[0.08] md:grid-cols-3">
                {customServices.map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="group flex min-h-[220px] flex-col bg-[#252525] p-5 transition duration-300 hover:bg-[#2d2d2d] sm:p-6"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                          Project 0{index + 1}
                        </span>

                        <ArrowUpRight
                          size={15}
                          className="text-white/20 transition group-hover:text-[#FF6B00]"
                        />
                      </div>

                      <div className="mt-auto">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] text-[#FF6B00] transition group-hover:bg-[#FF6B00] group-hover:text-white">
                          <Icon size={19} />
                        </span>

                        <h3 className="mt-5 text-sm font-bold text-white">
                          {service.name}
                        </h3>

                        <p className="mt-2 text-[11px] leading-5 text-white/40">
                          {service.description}
                        </p>

                        <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-[#FF6B00]">
                          Discuss project
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* MAIN CUSTOM CTA */}

              <div className="relative flex min-h-[520px] flex-col overflow-hidden bg-[#FF6B00] p-7 sm:p-9 xl:min-h-0">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-white/10" />

                <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

                <div className="relative z-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#FF6B00]">
                    <Boxes size={23} />
                  </span>

                  <p className="mt-9 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                    Bespoke request
                  </p>

                  <h3 className="mt-4 text-4xl font-bold leading-[1.04] tracking-[-0.04em]">
                    Tell us what
                    <br />
                    you&apos;re trying
                    <br />
                    to make.
                  </h3>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">
                    We&apos;ll determine the right materials, production
                    approach, quantity and pricing around the actual project.
                  </p>
                </div>

                <div className="relative z-10 mt-auto pt-12">
                  <Link
                    href="/custom/request"
                    className="group flex items-center justify-between rounded-2xl bg-[#262626] px-5 py-4 text-sm font-bold transition hover:bg-white hover:text-[#FF6B00]"
                  >
                    Start a Custom Request

                    <MessageSquarePlus size={17} />
                  </Link>

                  <p className="mt-3 text-[10px] leading-5 text-white/60">
                    Best for unusual, multi-product or production-heavy
                    requests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BUSINESS PROJECT CTA */}

          <div className="mt-5 flex flex-col gap-5 rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00]/10 text-[#FF6B00]">
                <Building2 size={19} />
              </span>

              <div>
                <h4 className="text-sm font-bold text-white">
                  Planning a larger business, school, church or event project?
                </h4>

                <p className="mt-1 max-w-2xl text-[11px] leading-5 text-white/40">
                  Send the complete requirement instead of ordering individual
                  items. We can structure the production as one project.
                </p>
              </div>
            </div>

            <Link
              href="/custom/request"
              className="group inline-flex shrink-0 items-center gap-2 text-xs font-bold text-[#FF6B00]"
            >
              Discuss the project

              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
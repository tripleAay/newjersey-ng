"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  Check,
  Church,
  GraduationCap,
  LayoutTemplate,
  MessageSquarePlus,
  Package,
  Palette,
  PenTool,
  Sparkles,
  Store,
} from "lucide-react";

type BrandingService = {
  number: string;
  name: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

const brandingServices: BrandingService[] = [
  {
    number: "01",
    name: "Business Branding",
    description:
      "Build a clear visual identity for your company, product or growing business.",
    icon: BriefcaseBusiness,
    href: "/branding/business",
  },
  {
    number: "02",
    name: "Church Branding",
    description:
      "Create a consistent identity across church communication, print and environments.",
    icon: Church,
    href: "/branding/church",
  },
  {
    number: "03",
    name: "School Branding",
    description:
      "Bring your school identity together across uniforms, print, signage and events.",
    icon: GraduationCap,
    href: "/branding/school",
  },
  {
    number: "04",
    name: "Event Branding",
    description:
      "Build one visual direction across invitations, signage, merchandise and event materials.",
    icon: CalendarDays,
    href: "/branding/event",
  },
  {
    number: "05",
    name: "Vehicle Branding",
    description:
      "Turn business and campaign vehicles into professionally branded moving assets.",
    icon: Car,
    href: "/branding/vehicle",
  },
  {
    number: "06",
    name: "Office & Space",
    description:
      "Extend your identity into offices, stores, reception areas and physical spaces.",
    icon: Building2,
    href: "/branding/office",
  },
];

const capabilities = [
  {
    title: "Identity",
    description: "Logo systems, colours, typography and brand direction.",
    icon: PenTool,
  },
  {
    title: "Print",
    description: "Business stationery, marketing materials and packaging.",
    icon: Package,
  },
  {
    title: "Environment",
    description: "Signage, office graphics, displays and branded spaces.",
    icon: Store,
  },
  {
    title: "Campaign",
    description: "Coordinated creative materials for launches and events.",
    icon: LayoutTemplate,
  },
];

const projectSteps = [
  "Tell us what you're building",
  "We define the right branding scope",
  "Design direction is developed",
  "Approved assets move into production",
];

export default function BrandingSection() {
  return (
    <section className="relative overflow-hidden bg-[#111111] py-16 text-white sm:py-20 lg:py-24">
      {/* Background detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-160px] top-[-180px] h-[480px] w-[480px] rounded-full border-[70px] border-white/[0.025]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-220px] left-[-170px] h-[440px] w-[440px] rounded-full border-[60px] border-[#FF6B00]/[0.035]"
      />

      <div className="relative mx-auto w-[92%] max-w-[1440px]">
        {/* =====================================================
            INTRO
        ===================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7 bg-[#FF6B00]" />

              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                Branding Studio
              </span>
            </div>

            <h2 className="mt-5 max-w-[760px] text-[39px] font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-[50px] lg:text-[64px]">
              Your business should
              <br />
              <span className="text-[#FF6B00]">look like it means business.</span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-[520px] text-[12px] leading-6 text-white/50 sm:text-[13px]">
              NewJersey helps businesses, organisations and events build a
              visual identity that works across print, merchandise, signage
              and physical spaces.
            </p>

            <Link
              href="/branding/start-project"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#FF6B00] px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#191919]"
            >
              Start a branding project

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* =====================================================
            BRANDING SERVICE GRID
        ===================================================== */}

        <div className="mt-12 overflow-hidden rounded-[26px] border border-white/[0.08]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {brandingServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.name}
                  href={service.href}
                  className={`
                    group
                    relative
                    min-h-[285px]
                    bg-[#171717]
                    p-6
                    transition-all
                    duration-300
                    hover:bg-[#FF6B00]
                    sm:p-7

                    ${index > 0 ? "border-t border-white/[0.08]" : ""}

                    ${
                      index === 1
                        ? "sm:border-l sm:border-t-0"
                        : ""
                    }

                    ${
                      index === 2
                        ? "lg:border-l lg:border-t-0"
                        : ""
                    }

                    ${
                      index === 3
                        ? "sm:border-l lg:border-l-0"
                        : ""
                    }

                    ${
                      index === 4
                        ? "lg:border-l"
                        : ""
                    }

                    ${
                      index === 5
                        ? "sm:border-l"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-black tracking-[0.16em] text-white/25 transition-colors group-hover:text-white/55">
                      {service.number}
                    </span>

                    <ArrowUpRight
                      size={16}
                      className="text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                    />
                  </div>

                  <div className="mt-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] text-[#FF6B00] transition-colors group-hover:bg-white group-hover:text-[#FF6B00]">
                    <Icon size={18} strokeWidth={1.7} />
                  </div>

                  <div className="mt-7">
                    <h3 className="text-[17px] font-black tracking-[-0.025em] text-white">
                      {service.name}
                    </h3>

                    <p className="mt-3 max-w-[330px] text-[10px] leading-5 text-white/42 transition-colors group-hover:text-white/75">
                      {service.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            WHAT BRANDING CAN INCLUDE
        ===================================================== */}

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">
              One identity. Many surfaces.
            </p>

            <h3 className="mt-3 max-w-[420px] text-[29px] font-black leading-[1.04] tracking-[-0.04em] text-white sm:text-[34px]">
              Branding that survives outside the logo file.
            </h3>

            <p className="mt-4 max-w-[440px] text-[11px] leading-6 text-white/45">
              A useful identity has to work wherever your customers meet your
              business. We can carry the same visual direction from design
              into physical production.
            </p>

            <Link
              href="/branding"
              className="group mt-7 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.13em] text-white transition hover:text-[#FF6B00]"
            >
              Explore branding services

              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid overflow-hidden rounded-[22px] border border-white/[0.08] sm:grid-cols-2">
            {capabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`
                    min-h-[180px]
                    bg-white/[0.035]
                    p-6

                    ${index > 0 ? "border-t border-white/[0.08]" : ""}

                    ${
                      index === 1
                        ? "sm:border-l sm:border-t-0"
                        : ""
                    }

                    ${
                      index === 2
                        ? "sm:border-t"
                        : ""
                    }

                    ${
                      index === 3
                        ? "sm:border-l"
                        : ""
                    }
                  `}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.6}
                    className="text-[#FF6B00]"
                  />

                  <h4 className="mt-7 text-[13px] font-black text-white">
                    {item.title}
                  </h4>

                  <p className="mt-2 max-w-[260px] text-[10px] leading-5 text-white/40">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            BRAND PROJECT PROCESS
        ===================================================== */}

        <div className="mt-14 overflow-hidden rounded-[26px] bg-[#F1EEE7] text-[#191919]">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* LEFT */}

            <div className="relative overflow-hidden bg-[#FF6B00] p-7 text-white sm:p-9 lg:p-10">
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -right-20 h-[280px] w-[280px] rounded-full border-[45px] border-white/[0.09]"
              />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#FF6B00]">
                  <Palette size={19} />
                </div>

                <p className="mt-8 text-[9px] font-black uppercase tracking-[0.16em] text-white/65">
                  Have an idea already?
                </p>

                <h3 className="mt-3 max-w-[420px] text-[30px] font-black leading-[1.02] tracking-[-0.04em]">
                  Bring us the rough idea.
                  <br />
                  We&apos;ll build the system.
                </h3>

                <p className="mt-4 max-w-[430px] text-[11px] leading-5 text-white/70">
                  You do not need to arrive with a complete brand brief. Tell
                  us what you&apos;re building, who it&apos;s for and what you
                  need the brand to do.
                </p>

                <Link
                  href="/branding/start-project"
                  className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#191919] px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#191919]"
                >
                  Tell us about your project

                  <MessageSquarePlus size={14} />
                </Link>
              </div>
            </div>

            {/* RIGHT */}

            <div className="p-7 sm:p-9 lg:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#FF6B00]">
                    How a project starts
                  </p>

                  <h3 className="mt-2 text-[22px] font-black tracking-[-0.03em]">
                    Clear before creative.
                  </h3>
                </div>

                <Sparkles
                  size={20}
                  strokeWidth={1.5}
                  className="text-[#FF6B00]"
                />
              </div>

              <div className="mt-7">
                {projectSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 border-t border-black/[0.08] py-4 first:border-t-0 first:pt-0"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#191919] text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>

                    <div className="flex flex-1 items-center justify-between gap-5">
                      <p className="text-[11px] font-bold text-[#383633]">
                        {step}
                      </p>

                      <span className="text-[8px] font-black tracking-[0.15em] text-black/25">
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FINAL BRANDING CTA
        ===================================================== */}

        <div className="mt-6 flex flex-col justify-between gap-6 rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-6 sm:flex-row sm:items-center sm:p-7">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-white">
              <BriefcaseBusiness size={16} />
            </div>

            <div>
              <h4 className="text-[13px] font-black text-white">
                Not sure which branding service you need?
              </h4>

              <p className="mt-1 max-w-[580px] text-[10px] leading-5 text-white/40">
                Start with the project instead of the service. Tell us what
                you&apos;re trying to achieve and we&apos;ll determine the
                appropriate scope.
              </p>
            </div>
          </div>

          <Link
            href="/branding/start-project"
            className="group flex shrink-0 items-center gap-3 text-[9px] font-black uppercase tracking-[0.12em] text-[#FF6B00]"
          >
            Start project

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6B00] text-white transition-transform group-hover:translate-x-1">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
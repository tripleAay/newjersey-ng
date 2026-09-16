"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  Church,
  GraduationCap,
  CalendarHeart,
  Car,
  Building2,
  ArrowUpRight,
  MessageSquarePlus,
} from "lucide-react";

const brandingServices = [
  {
    name: "Business Branding",
    description: "A strong, professional identity for your business.",
    icon: BriefcaseBusiness,
    href: "/branding/business",
  },
  {
    name: "Church Branding",
    description: "A consistent identity for your church and ministry.",
    icon: Church,
    href: "/branding/church",
  },
  {
    name: "School Branding",
    description: "A clear, recognizable identity for your school.",
    icon: GraduationCap,
    href: "/branding/school",
  },
  {
    name: "Event Branding",
    description: "A memorable visual experience for your event.",
    icon: CalendarHeart,
    href: "/branding/event",
  },
  {
    name: "Vehicle Branding",
    description: "Turn your vehicles into moving brand visibility.",
    icon: Car,
    href: "/branding/vehicle",
  },
  {
    name: "Office Branding",
    description: "Turn your workspace into an extension of your brand.",
    icon: Building2,
    href: "/branding/office",
  },
];

export default function BrandingSection() {
  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto w-[92%] max-w-[1440px]">
        {/* Section heading */}
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#262626] md:text-2xl">
              Branding Solutions
            </h2>

            <p className="mt-1 max-w-xl text-sm text-[#8a8a8a]">
              Custom branding for your business, event, or space.
            </p>
          </div>

          <Link
            href="/branding"
            className="group flex w-fit items-center gap-1 text-sm font-medium text-[#262626] transition hover:text-[#FF6B00]"
          >
            Explore Branding
            <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          {/* Left - Branding introduction */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#262626] p-6 text-white">
            <div>
              <h3 className="text-xl font-semibold leading-snug">
                Your brand is not a template.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/60">
                Tell us what you're building. We'll help translate your ideas
                into a branding solution that fits your goals.
              </p>
            </div>

            <Link
              href="/branding/start-project"
              className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#E66000]"
            >
              Start a Branding Project
              <MessageSquarePlus size={16} />
            </Link>
          </div>

          {/* Right - Branding services */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {brandingServices.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.name}
                  href={service.href}
                  className="group flex flex-col gap-3 rounded-2xl border border-[#ececec] p-5 transition-colors duration-200 hover:border-[#FF6B00]/30 hover:bg-[#FF6B00]/[0.02]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#565656] transition-colors group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00]">
                    <Icon size={18} strokeWidth={1.7} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#262626]">
                      {service.name}
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-[#8a8a8a]">
                      {service.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
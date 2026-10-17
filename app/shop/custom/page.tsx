import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Layers3,
  Package,
  Ruler,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Custom Print Projects | NewJersey.ng",
  description:
    "Have something specific in mind? Discuss custom sizes, packaging, branded sets and print projects with NewJersey.ng.",
};

const QUOTE_PATH = "/shop/quote";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1A36] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FCFBF8]";

const possibilities = [
  {
    icon: Ruler,
    title: "A different size or finish.",
    description:
      "When standard options do not fit. Discuss dimensions, materials and finishing for your intended use.",
  },
  {
    icon: Package,
    title: "Something made as a set.",
    description:
      "Bring packaging, printed inserts, apparel and branded items together for a launch, event or business.",
  },
  {
    icon: Layers3,
    title: "An idea that needs working out.",
    description:
      "Start with a reference, sketch or description. We’ll help establish what can be made and what it needs.",
  },
];

const briefDetails = [
  {
    number: "01",
    title: "What are we making?",
    description:
      "Describe the item and how you plan to use it. A reference photo or sketch can help.",
  },
  {
    number: "02",
    title: "How many, and what size?",
    description:
      "Share quantities, approximate dimensions and any material preferences you have.",
  },
  {
    number: "03",
    title: "Where and when?",
    description:
      "Include your location and preferred delivery date so we can discuss timing.",
  },
];

export default function CustomPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
        <nav aria-label="Breadcrumb" className="pt-5">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-[#625D55]">
            <li>
              <Link
                href="/shop"
                className={`inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-[#181818] ${focusClass}`}
              >
                Shop
              </Link>
            </li>

            <li aria-hidden="true">
              <ChevronRight
                size={13}
                strokeWidth={1.5}
                className="text-[#9A948B]"
              />
            </li>

            <li>
              <span
                aria-current="page"
                className="inline-flex min-h-11 items-center font-medium text-[#181818]"
              >
                Custom projects
              </span>
            </li>
          </ol>
        </nav>

        <section
          aria-labelledby="custom-title"
          className="grid gap-10 border-b border-black/10 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16"
        >
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#625D55]">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#6D1A36]"
              />
              Custom projects
            </p>

            <h1
              id="custom-title"
              className="mt-6 max-w-2xl text-5xl font-medium leading-[1.04] tracking-[-0.06em] sm:text-6xl lg:text-7xl"
            >
              Not everything
              <br />
              fits a catalogue.
            </h1>
          </div>

          <div className="max-w-md">
            <p className="text-base leading-8 text-[#625D55]">
              A particular size. An unusual finish. A collection
              of items for one occasion. Tell us what you have
              in mind, and we’ll work through the possibilities.
            </p>

            <Link
              href={QUOTE_PATH}
              className={`mt-7 inline-flex min-h-12 items-center justify-center gap-6 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6D1A36] ${focusClass}`}
            >
              Discuss your project
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>

            <p className="mt-3 text-xs leading-6 text-[#7A7368]">
              An idea is enough to start the conversation.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="possibilities-title"
          className="py-12 sm:py-16"
        >
          <h2
            id="possibilities-title"
            className="text-2xl font-medium tracking-tight sm:text-3xl"
          >
            What makes your project different?
          </h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-7">
            {possibilities.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="border-t border-black/10 pt-6"
                >
                  <Icon
                    size={25}
                    strokeWidth={1.4}
                    aria-hidden="true"
                    className="text-[#6D1A36]"
                  />

                  <h3 className="mt-5 text-lg font-medium tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#625D55]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="brief-title"
          className="grid gap-8 rounded-2xl bg-[#F1EEE7] p-6 sm:p-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:p-12"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A7368]">
              Your starting point
            </p>

            <h2
              id="brief-title"
              className="mt-4 text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-4xl"
            >
              A few details.
              <br />
              A clearer quote.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#625D55]">
              Share what you know. If you are unsure about
              materials, artwork or measurements, mention that
              in your enquiry.
            </p>
          </div>

          <ol className="divide-y divide-black/10">
            {briefDetails.map((item) => (
              <li
                key={item.number}
                className="flex gap-5 py-5 first:pt-0 last:pb-0"
              >
                <span className="pt-1 text-xs text-[#7A7368]">
                  {item.number}
                </span>

                <div>
                  <h3 className="text-sm font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#625D55]">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="next-title"
          className="grid gap-7 pt-12 sm:pt-16 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16"
        >
          <div className="max-w-xl">
            <h2
              id="next-title"
              className="text-3xl font-medium tracking-[-0.045em] sm:text-4xl"
            >
              Let’s see what we can make.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#625D55]">
              We’ll review feasibility and clarify the scope before
              quoting. Minimum quantities, samples and production
              timing depend on the project.
            </p>

            <p className="mt-3 text-xs leading-6 text-[#7A7368]">
              Sending an enquiry does not place an order or require
              payment.
            </p>
          </div>

          <Link
            href={QUOTE_PATH}
            className={`inline-flex min-h-12 items-center justify-center gap-6 justify-self-start rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6D1A36] ${focusClass}`}
          >
            Request a custom quote
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
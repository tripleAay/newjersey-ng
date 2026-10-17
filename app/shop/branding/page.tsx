import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  PenTool,
  Signpost,
  Truck,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Branding That Goes Places | NewJersey.ng",
  description:
    "Brand identity, signage, vehicle graphics and branding for shops and workspaces. Share your idea and request a tailored quote.",
};

const QUOTE_PATH = "/shop/quote";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1A36] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FCFBF8]";

const services = [
  {
    number: "01",
    icon: PenTool,
    title: "Your identity.",
    description:
      "A distinctive look that gives your business a consistent starting point.",
    examples: "Logos · Visual identity · Brand guidelines",
  },
  {
    number: "02",
    icon: Signpost,
    title: "Your presence.",
    description:
      "Signage that helps people find your business and recognise it on arrival.",
    examples: "Shopfronts · Reception signs · Wayfinding",
  },
  {
    number: "03",
    icon: Truck,
    title: "Your movement.",
    description:
      "Vehicle graphics that carry your business name wherever work takes you.",
    examples: "Lettering · Vehicle graphics · Fleet branding",
  },
  {
    number: "04",
    icon: Building2,
    title: "Your space.",
    description:
      "Bring your identity into the places where customers meet your business.",
    examples: "Wall graphics · Windows · Office branding",
  },
];

const steps = [
  {
    title: "Tell us the idea.",
    description:
      "What needs branding, where it will be used and when you need it.",
  },
  {
    title: "Work through the details.",
    description:
      "We clarify artwork, dimensions, materials and installation needs.",
  },
  {
    title: "Agree the next step.",
    description:
      "Review the scope, price and schedule before work begins.",
  },
];

const questions = [
  {
    question: "Can I use my existing logo?",
    answer:
      "Yes. Share the files you have. We will check whether they suit the intended size and application, and discuss any artwork preparation needed.",
  },
  {
    question: "What if I do not have measurements?",
    answer:
      "Start with photos and your location. We will explain which measurements are needed and whether a site assessment is necessary before final pricing.",
  },
  {
    question: "Is installation included?",
    answer:
      "This depends on the project and location. Your quote will state what is included, with design, production and installation itemised where applicable.",
  },
];

export default function BrandingPage() {
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

      <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <Link
          href="/shop"
          className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium text-[#625D55] transition-colors hover:text-[#181818] ${focusClass}`}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to shop
        </Link>

        {/* Main story */}
        <section
          aria-labelledby="branding-title"
          className="grid items-center gap-10 pb-12 pt-7 sm:pb-16 sm:pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
        >
          <div className="max-w-xl lg:py-8">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#625D55]">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#6D1A36]"
              />
              Branding by NewJersey.ng
            </p>

            <h1
              id="branding-title"
              className="mt-7 text-[clamp(2.75rem,5.5vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.065em]"
            >
              A brand.
              <br />
              A presence.
              <br />
              <span className="text-[#6D1A36]">
                A lasting impression.
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#625D55] sm:text-base sm:leading-8">
              From your first logo to the vehicle outside your shop.
              Give your business a look people can recognise,
              wherever they meet it.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href={QUOTE_PATH}
                className={`inline-flex min-h-12 items-center justify-center gap-6 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6D1A36] ${focusClass}`}
              >
                Request a quote
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>

              <a
                href="#services"
                className={`inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-[#625D55] transition-colors hover:text-[#181818] ${focusClass}`}
              >
                Explore the possibilities
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>

            <p className="mt-5 text-xs leading-6 text-[#7A7368]">
              No finished brief needed. Start with your idea.
            </p>
          </div>

          <figure className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#EDE8DE] sm:rounded-[2rem]">
              <Image
                src="/images/branding/daddieshinor-danfo.png"
                alt="DADDIESHINOR vehicle branding concept: a man in a suit and Panama hat stands between two yellow Lagos danfo vans."
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <figcaption className="flex flex-wrap items-start justify-between gap-3 px-1 pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                  DADDIESHINOR
                </p>
                <p className="mt-1 text-xs text-[#625D55]">
                  Read. Think. Grow.
                </p>
              </div>

              <span className="text-[10px] leading-5 text-[#7A7368]">
                Illustrative branding concept
              </span>
            </figcaption>
          </figure>
        </section>

        {/* Quiet supporting statement */}
        <div className="flex flex-col justify-between gap-4 border-y border-black/10 py-6 sm:flex-row sm:items-center">
          <p className="max-w-md text-base font-medium tracking-tight sm:text-lg">
            One identity. Everywhere your business shows up.
          </p>

          <p className="max-w-sm text-xs leading-6 text-[#625D55]">
            Design, materials and application considered together,
            with the scope agreed before work begins.
          </p>
        </div>

        {/* Service options */}
        <section
          id="services"
          aria-labelledby="services-title"
          className="scroll-mt-44 py-14 sm:py-20"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A7368]">
                The possibilities
              </p>

              <h2
                id="services-title"
                className="mt-3 text-3xl font-medium tracking-[-0.045em] sm:text-4xl"
              >
                Where will your brand go?
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-7 text-[#625D55]">
              Start with one application.
              <br className="hidden sm:block" />
              Build a connected look over time.
            </p>
          </div>

          <div className="mt-9 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="border-t border-black/10 pb-7 pt-6"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      size={24}
                      strokeWidth={1.4}
                      aria-hidden="true"
                      className="text-[#6D1A36]"
                    />

                    <span className="text-[10px] text-[#8A847B]">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-medium tracking-tight">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#625D55]">
                    {service.description}
                  </p>

                  <p className="mt-4 text-[11px] leading-6 text-[#7A7368]">
                    {service.examples}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Enquiry process */}
        <section
          aria-labelledby="process-title"
          className="grid gap-8 rounded-[1.5rem] bg-[#F1EEE7] p-6 sm:p-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:p-12"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A7368]">
              A clear way forward
            </p>

            <h2
              id="process-title"
              className="mt-4 max-w-sm text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-4xl"
            >
              You bring the idea.
              <br />
              We help shape the brief.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#625D55]">
              Photos, a business name or a few lines about what you
              want to achieve are enough to start the conversation.
            </p>
          </div>

          <ol className="divide-y divide-black/10">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 py-5 first:pt-0 last:pb-0 sm:gap-6"
              >
                <span className="pt-1 text-[11px] text-[#7A7368]">
                  0{index + 1}
                </span>

                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-7 text-[#625D55]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Questions */}
        <section
          aria-labelledby="questions-title"
          className="grid gap-7 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
        >
          <div>
            <h2
              id="questions-title"
              className="text-2xl font-medium tracking-tight sm:text-3xl"
            >
              A few things you might ask.
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-7 text-[#625D55]">
              You do not need to have every detail worked out.
            </p>
          </div>

          <div className="divide-y divide-black/10 border-y border-black/10">
            {questions.map((item) => (
              <details key={item.question}>
                <summary
                  className={`cursor-pointer rounded-sm py-5 pr-3 text-sm font-medium leading-6 ${focusClass}`}
                >
                  {item.question}
                </summary>

                <p className="max-w-lg pb-5 pr-5 text-sm leading-7 text-[#625D55]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final invitation */}
        <section
          aria-labelledby="quote-title"
          className="border-t border-black/10 pb-4 pt-10 sm:pt-14"
        >
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center lg:gap-12">
            <div>
              <h2
                id="quote-title"
                className="max-w-xl text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-5xl"
              >
                Let’s make your business
                <br className="hidden sm:block" />
                easier to recognise.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#625D55]">
                Tell us what needs branding, your location and your
                preferred timing. We’ll work through the details with you.
              </p>

              <p className="mt-5 flex items-center gap-2 text-xs text-[#625D55]">
                <Check
                  size={14}
                  aria-hidden="true"
                  className="text-[#6D1A36]"
                />
                Scope and pricing agreed before work begins.
              </p>
            </div>

            <Link
              href={QUOTE_PATH}
              className={`inline-flex min-h-14 shrink-0 items-center justify-center gap-8 self-start rounded-full bg-[#181818] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#6D1A36] lg:self-center ${focusClass}`}
            >
              Tell us about your project
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
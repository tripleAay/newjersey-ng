import { CheckCircle2, CloudUpload, MousePointer2, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Item",
    description:
      "Pick what you want to print — apparel, jerseys, business cards, mugs, caps, or branded merchandise.",
    icon: MousePointer2,
  },
  {
    number: "02",
    title: "Send Your Design",
    description:
      "Upload your artwork, logo, or brief. No design yet? Our team can help create one for your order.",
    icon: CloudUpload,
  },
  {
    number: "03",
    title: "Confirm & Pay",
    description:
      "Review your order details, confirm pricing, and complete payment securely through our available checkout options.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Print & Deliver",
    description:
      "We produce your order, package it neatly, and arrange pickup or delivery based on your timeline.",
    icon: Truck,
  },
];

export default function SeamlessPrintsDelivery() {
  return (
    <section className="w-full bg-[#2E1E0F] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#ff6b00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
              Simple Process
            </span>

            <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-tight text-white md:text-[42px]">
              Seamless Prints
              <br className="hidden md:block" /> & Delivery
            </h2>
          </div>

          <p className="max-w-sm text-[15px] leading-6 text-white">
            From idea to finished product, NewJersey.ng keeps your print
            order clear, simple, and easy to track — every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-[74px] hidden h-px bg-black/10 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative">
                <div
                  className="
                    group
                    relative
                    flex
                    h-full
                    min-h-[260px]
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-black/[0.08]
                    bg-white
                    p-6
                    shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#ff6b00]/30
                    hover:shadow-[0_20px_44px_rgba(0,0,0,0.09)]
                  "
                >
                  {/* Ghost number watermark */}
                  <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[92px] font-black leading-none text-black/[0.035] transition-colors duration-300 group-hover:text-[#ff6b00]/[0.06]">
                    {step.number}
                  </span>

                  {/* Icon + step index */}
                  <div className="relative z-10 mb-9 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f3ee] text-black transition-all duration-300 group-hover:bg-[#ff6b00] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(255,107,0,0.35)]">
                      <Icon className="h-[18px] w-[18px] stroke-[2.25]" />
                    </div>

                    <span className="text-[13px] font-black tracking-[0.05em] text-black/25">
                      Step {step.number}
                    </span>
                  </div>

                  {/* Text */}
                  <h3 className="relative z-10 text-[17px] font-black tracking-tight text-black">
                    {step.title}
                  </h3>

                  <p className="relative z-10 mt-3 text-[13.5px] leading-6 text-black/60">
                    {step.description}
                  </p>

                  {/* Bottom progress accent */}
                  <div className="relative z-10 mt-auto flex items-center gap-2 pt-6">
                    <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                      <div className="h-full w-0 rounded-full bg-[#ff6b00] transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                  </div>
                </div>

                {/* Arrow connector between cards (desktop only) */}
                {!isLast && (
                  <div className="absolute right-[-19px] top-[68px] z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-[#f7f3ee] lg:flex">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-black/30"
                    >
                      <path
                        d="M1 6H11M11 6L6.5 1.5M11 6L6.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
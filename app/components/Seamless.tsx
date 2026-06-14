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
    <section className="w-full bg-[#f7f3ee] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#ff6b00]">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111111] md:text-4xl">
              Seamless Prints & Delivery
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-black/60">
            From idea to finished product, NewJersey.ng keeps your print order
            clear, simple, and easy to track.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="
                  group
                  relative
                  min-h-[240px]
                  overflow-hidden
                  rounded-3xl
                  border
                  border-black/10
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#ff6b00]/40
                  hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)]
                "
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#ff6b00]/0 transition-all duration-300 group-hover:bg-[#ff6b00]/10" />

                <div className="mb-8 flex items-center justify-between">
                  <span className="text-sm font-black text-[#ff6b00]">
                    {step.number}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7f3ee] text-black transition-all duration-300 group-hover:bg-[#ff6b00] group-hover:text-white">
                    <Icon className="h-5 w-5 stroke-[2]" />
                  </div>
                </div>

                <h3 className="text-lg font-black tracking-tight text-black">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-black/65">
                  {step.description}
                </p>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#ff6b00] transition-all duration-300 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
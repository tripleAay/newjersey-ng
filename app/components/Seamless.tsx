import {
  CheckCircle2,
  CloudUpload,
  MousePointer2,
  Truck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose your product",
    description:
      "Explore print, apparel, jerseys and branding.",
    icon: MousePointer2,
  },
  {
    number: "02",
    title: "Make it yours",
    description:
      "Choose your options. Add artwork when your order needs it.",
    icon: CloudUpload,
  },
  {
    number: "03",
    title: "Review & pay",
    description:
      "Check your details and confirmed price, then follow the payment instructions.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Production & delivery",
    description:
      "We prepare your order and confirm pickup or delivery arrangements.",
    icon: Truck,
  },
];

export default function SeamlessPrintsDelivery() {
  return (
    <section
      aria-labelledby="process-title"
      className="bg-[#2E1E0F] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF6B00]">
              How it works
            </p>

            <h2
              id="process-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
            >
              A clear path to your order.
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-white/65">
            Choose, personalise and order.
            We’ll take it from there.
          </p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <li
              key={number}
              className="rounded-2xl border border-white/10 bg-[#F8F5EF] p-5 text-[#181818]"
            >
              <div className="flex items-center justify-between">
                <Icon
                  size={20}
                  strokeWidth={1.6}
                  aria-hidden="true"
                  className="text-[#B94700]"
                />

                <span
                  aria-hidden="true"
                  className="text-[11px] font-medium tabular-nums text-[#8A8379]"
                >
                  {number}
                </span>
              </div>

              <h3 className="mt-5 text-sm font-semibold tracking-tight">
                {title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-[#625D55]">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
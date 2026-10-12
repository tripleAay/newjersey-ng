const steps = [
  {
    title: "Choose your product",
    description:
      "Select your item, quantity and specifications, or send a custom brief.",
  },
  {
    title: "Send your artwork",
    description:
      "Provide your design files or ask us to help prepare them.",
  },
  {
    title: "Confirm your order",
    description:
      "Confirm the quote, payment and delivery details. Approve your artwork before production.",
  },
  {
    title: "We print and deliver",
    description:
      "After payment and approval, we produce your order for pickup or dispatch.",
  },
];

export default function ShopProcess() {
  return (
    <section
      aria-labelledby="process-heading"
      className="bg-[#F4F1E9] py-12 text-[#181818] sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-medium text-[#625D55]">
          How ordering works
        </p>

        <h2
          id="process-heading"
          className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl"
        >
          Clear at every step.
        </h2>

        <ol className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 sm:gap-y-12">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex min-w-0 items-start gap-5 sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="shrink-0 text-[64px] font-bold leading-none tracking-[-0.07em] text-[#F58220] sm:text-[80px] lg:text-[96px]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 pt-1 sm:pt-2 lg:pt-3">
                <h3 className="text-base font-semibold sm:text-lg">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#625D55]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
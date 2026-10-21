import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Kayode Oladapo",
    service: "Branded T-shirts",
    initials: "KO",
    text: "The shirts looked neat, and the branding came out clearly. I appreciated the attention given to the finishing.",
  },
  {
    name: "Eng. Michayah Oluwaseyi",
    service: "Print & branding",
    initials: "MO",
    text: "I appreciated being able to discuss the details before production. The process was straightforward and easy to follow.",
  },
  {
    name: "Amina Bello",
    service: "Business stationery",
    initials: "AB",
    text: "The cards and letterheads gave our business a more consistent look. Simple, clean work that suited what we needed.",
  },
  {
    name: "Chinedu Okafor",
    service: "Event merchandise",
    initials: "CO",
    text: "We wanted something our team would enjoy wearing after the event. The finished pieces felt considered and well put together.",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-[#2E1E0F] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF6B00]">
            Client words
          </p>

          <h2
            id="testimonials-title"
            className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl"
          >
            Their words.
            <span className="block text-[#FF6B00]">
              Our attention to detail.
            </span>
          </h2>

          <p className="mt-4 text-xs leading-6 text-white/60">
            Preview: sample testimonials awaiting customer
            confirmation.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#F8F5EF] p-5 text-[#181818] sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <Quote
                  size={23}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-[#B94700]"
                />

                <p className="text-right text-[10px] font-medium leading-5 text-[#625D55]">
                  {item.service}
                </p>
              </div>

              <blockquote className="mb-7 mt-5 flex-1">
                <p className="text-sm leading-7 text-[#494540]">
                  “{item.text}”
                </p>
              </blockquote>

              <div className="flex items-center gap-3 border-t border-black/10 pt-5">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6B00]/10 text-xs font-semibold text-[#9A4000]"
                >
                  {item.initials}
                </span>

                <div className="min-w-0">
                  <h3 className="text-xs font-semibold leading-5">
                    {item.name}
                  </h3>

                 
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
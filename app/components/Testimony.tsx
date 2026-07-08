import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Rotimi Olawale",
    role: "Executive Director, YouthHub Africa",
    image: "/images/testimonials/rotimi.jpg",
    text: "We needed branded apparel and tote bags for our event on short notice. The quality exceeded expectations and delivery was right on time.",
  },
  {
    name: "Temilola Adepetun",
    role: "CEO, SKLD",
    image: "/images/testimonials/temi.jpg",
    text: "Excellent print quality, excellent service and excellent communication. The team delivered beyond what we expected.",
  },
  {
    name: "Uche Uzoebo",
    role: "Head, Distribution & Stakeholder Engagement, SANEF",
    image: "/images/testimonials/uche.jpg",
    text: "Professional, reliable and quality-driven. NewJersey.ng understands what brands need and consistently delivers.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#fafafa] py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-[#ff6b00]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff6b00]">
              Testimonials
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111111] md:text-4xl">
              Trusted by businesses,
              <br />
              creators and organisations.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-black/60">
              Real feedback from clients who trusted us with their printing,
              branding and merchandise projects.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="group inline-flex items-center gap-2 text-sm font-bold text-black"
          >
            View All Reviews
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-black/5
                bg-white
                p-8
                shadow-[0_10px_40px_rgba(0,0,0,0.04)]
              "
            >
              {/* Quote */}
              <span
                className="
                  absolute
                  right-5
                  top-0
                  text-[120px]
                  font-black
                  leading-none
                  text-[#ff6b00]/5
                "
              >
                "
              </span>

              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={52}
                  height={52}
                  className="rounded-full object-cover"
                />

                <div>
                  <h3 className="text-sm font-black text-[#111111]">
                    {item.name}
                  </h3>

                  <p className="text-xs text-black/55">
                    {item.role}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-[15px] leading-8 text-black/70">
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
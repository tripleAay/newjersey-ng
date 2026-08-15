import Image from "next/image";

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
    <section className="bg-[#2E1E0F] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />

            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/45">
              Client Words
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
          </div>

          <h2 className="text-3xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            They printed with us.
            <span className="block text-[#FF6B00] mt-2">
              They came back.
            </span>
          </h2>
        </div>

        {/* TESTIMONIALS */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={`
                group relative flex min-h-[270px] flex-col justify-between
                overflow-hidden rounded-[24px]
                border border-black/5
                bg-white
                p-6
                shadow-[0_12px_40px_rgba(0,0,0,0.04)]
                transition duration-300
                hover:-translate-y-1
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                ${index === 1 ? "md:-translate-y-3 md:hover:-translate-y-4" : ""}
              `}
            >
              {/* Orange accent */}
              <div className="absolute left-0 top-0 h-1 w-14 bg-[#FF6B00]" />

              {/* Quote mark */}
              <div className="absolute right-5 top-2 text-7xl font-black leading-none text-[#FF6B00]/[0.07]">
                “
              </div>

              {/* Quote */}
              <div className="relative z-10">
                <div className="mb-4 flex gap-1 text-[#FF6B00]">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>

                <p className="text-[14px] font-medium leading-6 tracking-[-0.01em] text-black/75">
                  “{item.text}”
                </p>
              </div>

              {/* Client */}
              <div className="relative z-10 mt-7 flex items-center gap-3 border-t border-black/5 pt-5">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                />

                <div className="min-w-0">
                  <h3 className="truncate text-[12px] font-black text-black">
                    {item.name}
                  </h3>

                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-black/45">
                    {item.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* BOTTOM TRUST SIGNAL */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <div className="h-px w-10 bg-black/10" />

          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/35">
            Built on good work
          </span>

          <div className="h-px w-10 bg-black/10" />
        </div>
      </div>
    </section>
  );
}
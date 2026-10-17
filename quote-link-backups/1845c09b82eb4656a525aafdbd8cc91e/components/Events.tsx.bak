import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleArrowRight } from "lucide-react";

const eventProducts = [
  {
    title: "Flyers & Handbills",
    min: "100",
    tag: "Event Marketing",
    image: "/images/flyer-handbills.jpg",
  },
  {
    title: "Custom Mugs",
    min: "1",
    tag: "Corporate Gifts",
    image: "/images/custom-mug.jpg",
  },
  {
    title: "Calendars",
    min: "25",
    tag: "Year-Round Branding",
    image: "/images/calendar.jpg",
  },
  {
    title: "Wall Art",
    min: "1",
    tag: "Interior Branding",
    image: "/images/wall-art.jpg",
  },
];

export default function EventsSection() {
  return (
    <section className="w-full bg-[#f7f3ee] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#ff6b00]">
              Events & Promotions
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111] md:text-4xl">
              Event Essentials
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
              Everything you need to promote events, launch campaigns,
              celebrate milestones, and create memorable experiences.
            </p>
          </div>

          <Link
            href="/shop/events"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:border-[#ff6b00]/40 hover:text-[#ff6b00]"
          >
            Explore Collection
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {eventProducts.map((product) => (
            <Link
              href="/shop/events"
              key={product.title}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-black/10
                bg-white
                p-3
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#ff6b00]/40
                hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)]
              "
            >
              <div className="relative h-[220px] overflow-hidden rounded-2xl bg-[#eef3f5]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-black shadow-sm backdrop-blur">
                  {product.tag}
                </div>

                <div className="absolute bottom-4 right-4 rounded-2xl bg-black px-4 py-2 text-white shadow-lg">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                    Min order
                  </span>

                  <span className="text-lg font-black text-[#ff6b00]">
                    {product.min}
                  </span>

                  <span className="ml-1 text-[11px] font-semibold text-white/80">
                    units
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 px-2 py-5">
                <div>
                  <h3 className="text-xl font-black leading-tight text-black">
                    {product.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium text-black/50">
                    High-quality printing for events, giveaways,
                    campaigns, and promotions.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f3ee] text-black transition group-hover:bg-[#ff6b00] group-hover:text-white">
                  <CircleArrowRight className="h-5 w-5 stroke-[2]" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#ff6b00] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-12 overflow-hidden rounded-[32px] bg-[#ff6b00]">
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-xl">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
                Event Printing
              </span>

              <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                Planning an Event?
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/85">
                Flyers, banners, souvenirs, branded gifts, merchandise, and
                promotional materials delivered professionally and on time.
              </p>
            </div>

            <Link
              href="/quote"
              className="
        group
        inline-flex
        w-fit
        items-center
        gap-2
        rounded-full
        bg-black
        px-6
        py-3
        text-sm
        font-bold
        text-white
        transition
        hover:bg-white
        hover:text-black
      "
            >
              Request a Quote

              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
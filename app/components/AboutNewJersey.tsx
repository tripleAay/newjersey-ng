import Link from "next/link";

export default function AboutNewJersey() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ff6b00]">
              About NewJersey.ng
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-5xl">
              More Than Printing.
              <br />
              We Help Brands Stay Visible.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/65">
              NewJersey.ng was built to help businesses, creators, schools,
              churches, organizations, and growing brands transform ideas into
              physical products people can see, touch, and remember.
            </p>

            <p className="mt-5 text-base leading-8 text-black/65">
              From custom apparel and business stationery to event materials,
              merchandise, and promotional products, we combine quality
              production, thoughtful design, and reliable delivery to help
              brands show up professionally.
            </p>

            <p className="mt-5 text-base leading-8 text-black/65">
              Whether you're launching a business, planning an event, growing a
              community, or building a brand, our goal is simple:
            </p>

            <div className="mt-6 border-l-4 border-[#ff6b00] pl-5">
              <p className="text-xl font-bold text-black">
                Make your brand impossible to ignore.
              </p>
            </div>

            <Link
              href="/quote"
              className="mt-8 inline-flex rounded-full bg-[#ff6b00] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              Start Your Project
            </Link>
          </div>

          {/* Right */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-[#f7f3ee] p-8">
              <h3 className="text-4xl font-black text-[#ff6b00]">
                100+
              </h3>

              <p className="mt-3 text-sm font-semibold text-black/70">
                Products available for customization and branding.
              </p>
            </div>

            <div className="rounded-[28px] bg-black p-8">
              <h3 className="text-4xl font-black text-[#ff6b00]">
                Fast
              </h3>

              <p className="mt-3 text-sm font-semibold text-white/70">
                Production timelines and nationwide delivery.
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-8 ring-1 ring-black/10">
              <h3 className="text-4xl font-black text-black">
                Design
              </h3>

              <p className="mt-3 text-sm font-semibold text-black/70">
                Professional design support when you need it.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#ff6b00] p-8">
              <h3 className="text-4xl font-black text-white">
                Quality
              </h3>

              <p className="mt-3 text-sm font-semibold text-white/80">
                Clean finishing and premium print production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
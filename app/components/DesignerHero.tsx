import Image from "next/image";
import Link from "next/link";

export default function DesignerHero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-8">
      <div className="mx-auto max-w-7xl px-8 lg:px-16">
        <div className="grid items-center gap-8 rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          {/* Left */}
          <div className="max-w-lg">
            <span className="inline-flex rounded-full bg-[#ff6b00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b00]">
              Design Service
            </span>

            <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-[#111] md:text-4xl">
              Professional Designs
              <span className="block text-[#ff6b00]">Ready For Print</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-black/60">
              Work with our design team to create clean, print-ready artwork for
              flyers, business cards, banners, apparel, and brand materials.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Fast turnaround", "3 revisions", "Print-ready files"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 bg-[#fafafa] px-3 py-1 text-[10px] font-semibold text-black/65"
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/hire-designer/request"
                className="rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#ff6b00]"
              >
                Start Design Request
              </Link>

              <span className="text-xs text-black/45">
                Usually replies within 1 hour
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="relative flex items-center justify-center rounded-[26px]   p-4">
            <div className="absolute right-6 top-6 h-32 w-32 rounded-full bg-[#ff6b00]/10 blur-3xl" />

            <Image
              src="/images/newjersey-hire-a-designer.png"
              alt="Designer"
              width={460}
              height={320}
              priority
              className="relative h-auto w-full max-w-[380px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.10)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
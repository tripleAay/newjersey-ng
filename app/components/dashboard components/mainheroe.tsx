import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function NewJerseyHero() {
  return (
    <section
      aria-labelledby="storefront-heading"
      className="border-b border-black/10 bg-[#F4F1E9] text-[#181818]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#625D55]">
              NewJersey.ng · Print, branding & merchandise
            </p>

            <h1
              id="storefront-heading"
              className="mt-6 max-w-[760px] text-[clamp(2.75rem,6.5vw,6rem)] font-bold leading-[1.02] tracking-[-0.055em]"
            >
              Everything with
              <br />
              your name on it.
            </h1>
          </div>

          <div className="min-w-0 max-w-lg">
            <p className="text-base leading-7 text-[#625D55] sm:text-lg sm:leading-8">
              Business cards, branded clothing, packaging and merchandise
              for your business, team or event.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/print"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636]"
              >
                Browse print products
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <Link
                href="/custom"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-black/20 px-6 text-sm font-semibold transition-colors hover:bg-white/70"
              >
                Request a custom job
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#625D55]">
              Need help with the design? Include that in your request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
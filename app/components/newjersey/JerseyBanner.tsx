import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function JerseyBanner() {
  return (
    <section
      aria-labelledby="jersey-banner-title"
      className="bg-[#FCFBF8] px-5 py-7 sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid max-w-[1344px] overflow-hidden rounded-xl bg-[#F0EFEB] md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start justify-center px-6 py-7 sm:px-9 sm:py-9 lg:px-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#625D55]">
            NewJersey.ng / Jerseys
          </p>

          <h2
            id="jersey-banner-title"
            className="mt-3 max-w-lg text-4xl font-black uppercase leading-[0.95] tracking-[-0.045em] text-[#B51F2A] sm:text-5xl"
          >
            Your team.
            <br />
            Your name.
            <br />
            Your jersey.
          </h2>

          <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-[#494540]">
            Find your team, choose your size and make it personal
            with a name and number.
          </p>

          <Link
            href="/shop/jerseys"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-5 rounded-full bg-[#B51F2A] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#941923] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B51F2A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F0EFEB]"
          >
            Choose your jersey
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>

          <Link
            href="/shop/quote"
            className="mt-3 inline-flex min-h-11 items-center rounded-sm text-xs font-medium text-[#625D55] underline decoration-black/20 underline-offset-4 hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B51F2A] focus-visible:ring-offset-4"
          >
            Buying for a whole team?
          </Link>
        </div>

        <div className="relative h-56 min-w-0 sm:h-64 md:h-auto md:min-h-80">
          <Image
            src="/images/deb0fe301917f85f14b42fdcad7e1299.jpg"
            alt="Jersey design and personalisation"
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
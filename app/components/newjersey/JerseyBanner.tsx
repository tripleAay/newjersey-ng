"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Shirt } from "lucide-react";
export default function JerseyBanner({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <section
      aria-labelledby="jersey-banner-title"
      className={
        embedded ? "py-7 sm:py-10" : "bg-[#FCFBF8] px-5 py-7 sm:px-8 lg:px-12"
      }
    >
      <div className="mx-auto grid max-w-[1344px] overflow-hidden rounded-2xl border border-black/5 bg-[#F0EFEB] md:grid-cols-[1.1fr_.9fr]">
        <div className="flex flex-col items-start justify-center px-6 py-8 sm:px-9 sm:py-10 lg:px-12">
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#625D55]">
            NewJersey.ng / Jerseys
          </p>
          <h1
            id="jersey-banner-title"
            className="mt-4 max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-.045em] text-[#181818] sm:text-5xl"
          >
            Your team.
            <br />
            Your name.
            <br />
            <span className="text-[#B94700]">Your jersey.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#625D55]">
            Home, away or third kit. Choose your team and size, then make it
            personal with a name and number.
          </p>
          {embedded ? (
            <a
              href="#jersey-kits"
              className="mt-6 inline-flex min-h-11 items-center gap-5 rounded-full bg-[#FF6B00] px-5 text-xs font-semibold text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4"
            >
              Explore the kits
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          ) : (
            <Link
              href="/shop/jerseys"
              className="mt-6 inline-flex min-h-11 items-center gap-5 rounded-full bg-[#FF6B00] px-5 text-xs font-semibold text-[#181818]"
            >
              Choose your jersey
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("newjersey-open-support"))
            }
            className="mt-3 inline-flex min-h-11 items-center text-xs text-[#625D55] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
          >
            Need help with a team order?
          </button>
        </div>
        <div className="relative h-60 min-w-0 bg-[#E8E4DB] sm:h-72 md:h-auto md:min-h-96">
          {imageFailed ? (
            <div className="flex h-full min-h-60 items-center justify-center">
              <Shirt
                size={72}
                strokeWidth={1}
                aria-label="Jersey collection"
                className="text-[#A59C8F]"
              />
            </div>
          ) : (
            <Image
              src="/images/deb0fe301917f85f14b42fdcad7e1299.jpg"
              alt="Jersey design and personalisation"
              fill
              priority={embedded}
              sizes="(max-width: 767px) 100vw, 45vw"
              className="object-cover object-center"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

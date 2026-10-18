"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Printer,
  Shirt,
  Signpost,
} from "lucide-react";
type Department = "print" | "apparel" | "branding";
const content = {
  print: {
    label: "The print desk",
    title: (
      <>
        Small details.
        <br />
        Lasting impressions.
      </>
    ),
    description:
      "Business cards, flyers, stickers and packaging. Choose your quantity, specifications and finish.",
    action: "Explore print",
    secondary: "Prepare your artwork",
    href: "/print-guidelines",
    tags: ["Paper", "Packaging", "Print"],
  },
  apparel: {
    label: "The clothing edit",
    title: (
      <>
        Find your fit.
        <br />
        Wear your own way.
      </>
    ),
    description:
      "Ready-designed pieces for everyday wear. Choose an available size and colour, then add your favourite to the cart.",
    action: "Shop the collection",
    secondary: "Want your own design printed?",
    href: "/shop/custom",
    tags: ["Ready-designed", "Size & colour"],
  },
  branding: {
    label: "Your business, in view",
    title: (
      <>
        A name worth
        <br />
        putting out there.
      </>
    ),
    description:
      "Signage, vehicle graphics and branding for your space. Start with the application; we’ll confirm the scope with you.",
    action: "Explore branding",
    secondary: "Talk through your project",
    href: "/contact",
    tags: ["Signage", "Vehicles", "Spaces"],
  },
};
function BannerArtwork({
  department,
  src,
  name,
}: {
  department: Department;
  src?: string;
  name?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (src && !failed)
    return (
      <div
        className={`relative h-full min-h-64 ${department === "branding" ? "bg-[#F0ECE5]" : "bg-white/65"}`}
      >
        <Image
          src={src}
          alt={name || `${department} collection`}
          fill
          priority
          sizes="(max-width:767px) 100vw, 45vw"
          className="object-contain p-7 sm:p-10"
          onError={() => setFailed(true)}
        />
        {name && (
          <p className="absolute bottom-4 left-5 right-5 truncate text-center text-[10px] text-[#746E65]">
            {name}
          </p>
        )}
      </div>
    );
  if (department === "print")
    return (
      <div
        aria-hidden="true"
        className="relative flex h-full min-h-64 items-center justify-center overflow-hidden bg-[#E9E2D5] px-8 py-10"
      >
        <div className="absolute h-40 w-52 translate-x-4 translate-y-4 rotate-6 rounded-lg border border-black/10 bg-[#CDBFA7]" />
        <div className="relative w-56 -rotate-3 rounded-lg border border-black/10 bg-[#FCFBF8] px-7 py-8 shadow-[0_10px_30px_rgba(50,40,25,.08)]">
          <Printer size={23} strokeWidth={1.3} className="text-[#B94700]" />
          <p className="mt-7 text-xl font-semibold leading-tight tracking-tight">
            Good print.
            <br />
            Good impression.
          </p>
          <div className="mt-5 h-1 w-10 bg-[#FF6B00]" />
          <div className="mt-4 h-px w-full bg-black/10" />
          <div className="mt-2 h-px w-3/4 bg-black/10" />
        </div>
      </div>
    );
  if (department === "apparel")
    return (
      <div
        aria-hidden="true"
        className="relative flex h-full min-h-64 items-center justify-center overflow-hidden bg-[#DEDCD4] px-8 py-8"
      >
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/5" />
        <div className="relative flex h-52 w-48 items-center justify-center rounded-t-[80px] border border-white/70 bg-[#F9F8F4]">
          <Shirt size={116} strokeWidth={0.7} className="text-[#625D55]" />
          <span className="absolute bottom-5 text-[9px] uppercase tracking-[.2em] text-[#8A8379]">
            The everyday edit
          </span>
        </div>
        <span className="absolute right-7 top-7 h-3 w-3 rounded-full bg-[#FF6B00]" />
      </div>
    );
  return (
    <div
      aria-hidden="true"
      className="flex h-full min-h-64 flex-col justify-center bg-[#242321] px-8 py-9 sm:px-10"
    >
      <div className="flex items-center gap-3 text-white/45">
        <Signpost size={20} strokeWidth={1.2} />
        <span className="text-[9px] uppercase tracking-[.18em]">
          A presence that carries
        </span>
      </div>
      <div className="my-7 border-y border-white/15 py-6">
        <p className="text-[38px] font-semibold leading-none tracking-[-.055em] text-white sm:text-[44px]">
          YOUR
          <br />
          <span className="text-[#FF6B00]">BRAND.</span>
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[.18em] text-white/45">
          Made to be seen
        </span>
        <ArrowUpRight size={22} strokeWidth={1.2} className="text-[#FF6B00]" />
      </div>
    </div>
  );
}
export default function DepartmentBanner({
  department,
  image,
  imageName,
}: {
  department: Department;
  image?: string;
  imageName?: string;
}) {
  const page = content[department];
  return (
    <section
      aria-labelledby={`${department}-banner-title`}
      className="py-7 sm:py-9"
    >
      <div
        className={`grid overflow-hidden rounded-2xl border border-black/[.06] md:grid-cols-[1.1fr_.9fr] ${department === "print" ? "bg-[#F3EFE6]" : department === "apparel" ? "bg-[#EEEDE8]" : "bg-[#F0ECE5]"}`}
      >
        <div className="flex flex-col items-start justify-center px-6 py-8 sm:px-9 sm:py-10">
          <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-[#746E65]">
            NewJersey.ng / {page.label}
          </p>
          <h1
            id={`${department}-banner-title`}
            className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-.045em] sm:text-5xl"
          >
            {page.title}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#625D55]">
            {page.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={`#${department}-collection`}
              className="inline-flex min-h-11 items-center gap-4 rounded-full bg-[#FF6B00] px-5 text-xs font-semibold text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4"
            >
              {page.action}
              <ArrowDown size={15} aria-hidden="true" />
            </a>
            <Link
              href={page.href}
              className="inline-flex min-h-11 items-center gap-2 rounded text-xs text-[#625D55] underline decoration-black/20 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
            >
              {page.secondary}
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 text-[9px] font-medium uppercase tracking-[.16em] text-[#8A8379]">
            {page.tags.join(" / ")}
          </p>
        </div>
        <div className="min-w-0">
          <BannerArtwork
            key={image ?? department}
            department={department}
            src={image}
            name={imageName}
          />
        </div>
      </div>
    </section>
  );
}

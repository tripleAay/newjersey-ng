import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const brandLogos = [
  { name: "SANEF", image: "/images/brands/sanef.png" },
  { name: "ACCA", image: "/images/brands/acca.png" },
  { name: "Bosch", image: "/images/brands/bosch.png" },
  { name: "EDC", image: "/images/brands/edc.png" },
  { name: "Alpha Pharma", image: "/images/brands/alpha-pharma.png" },
  { name: "Brand", image: "/images/brands/brand-logo.png" },
];

export default function TrustedBrandsSection() {
  return (
    <section className="w-full bg-[#f7f3ee] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff6b00]">
              Trusted by growing brands
            </span>

            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight text-black md:text-4xl">
              Print materials that make your brand look ready.
            </h2>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-black hover:text-[#ff6b00]"
          >
            Start Printing
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white px-6 py-7 shadow-sm">
          <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {brandLogos.map((logo) => (
              <div
                key={logo.name}
                className="group flex h-16 items-center justify-center rounded-2xl transition hover:bg-[#f7f3ee]"
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={120}
                  height={50}
                  className="max-h-8 w-auto object-contain grayscale opacity-45 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Clean finish", "Sharp production for everyday business visibility."],
            ["Flexible orders", "Print small, print big, or request a custom quote."],
            ["Brand-first support", "We help you choose what fits your purpose."],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-2xl border border-black/10 bg-white/70 p-5"
            >
              <h3 className="text-sm font-black text-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/55">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
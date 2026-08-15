import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
    <section className="bg-[#2E1E0F] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        {/* MAIN CARD */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#FF6B00] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-7 lg:p-8">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/20" />

          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/15" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

          {/* HEADER */}
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />

                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-black/60">
                  Trusted Brands
                </span>
              </div>

              <h2 className="text-2xl font-black leading-none tracking-[-0.03em] text-black sm:text-3xl">
                Brands we’ve helped{" "}
                <span className="text-white">show up.</span>
              </h2>
            </div>

            <Link
              href="/shop"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition duration-300 hover:bg-white hover:text-black"
            >
              Start printing
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* LOGO WALL */}
          <div className="relative z-10 mt-5 overflow-hidden rounded-[20px] bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {brandLogos.map((logo, index) => (
                <div
                  key={logo.name}
                  className={`
                    group flex h-20 items-center justify-center
                    px-5
                    transition duration-300
                    hover:bg-[#f7f3ee]
                    sm:h-24
                    lg:h-28
                    ${index % 2 !== 1 ? "border-r border-black/5" : ""}
                    ${index < 4 ? "border-b border-black/5" : ""}
                    sm:border-r
                    sm:[&:nth-child(3n)]:border-r-0
                    sm:[&:nth-child(n+4)]:border-b-0
                    lg:border-r
                    lg:[&:nth-child(6n)]:border-r-0
                    lg:[&:nth-child(n+4)]:border-b-0
                  `}
                >
                  <Image
                    src={logo.image}
                    alt={logo.name}
                    width={130}
                    height={50}
                    className="max-h-7 w-auto object-contain opacity-50 grayscale transition duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-8"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* MICRO FOOTER */}
          <div className="relative z-10 mt-4 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/50">
              Selected clients
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">
              06 brands
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
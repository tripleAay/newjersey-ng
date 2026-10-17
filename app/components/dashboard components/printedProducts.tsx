"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  FileText,
  Layers3,
  Package,
  ReceiptText,
  Sticker,
} from "lucide-react";

type PrintCategory = {
  title: string;
  description: string;
  href: string;
  image: string;
  label: string;
};

type QuickProduct = {
  name: string;
  href: string;
  price: string;
  quantity: string;
  icon: React.ElementType;
};

const printCategories: PrintCategory[] = [
  {
    title: "Business Print",
    description:
      "The everyday materials that keep businesses visible, credible and ready to sell.",
    href: "/print",
    image: "/images/products/print/business-cards.webp",
    label: "Cards · Flyers · Letterheads",
  },
  {
    title: "Marketing Print",
    description:
      "Campaign materials for promotions, launches, events and physical advertising.",
    href: "/print",
    image: "/images/products/print/flyers.webp",
    label: "Flyers · Posters · Banners",
  },
  {
    title: "Packaging & Labels",
    description:
      "Product-facing print for packaging, stickers, labels and branded presentation.",
    href: "/print/packaging",
    image: "/images/products/print/packaging.webp",
    label: "Packaging · Stickers · Labels",
  },
];

const quickProducts: QuickProduct[] = [
  {
    name: "Brochures",
    href: "/print/brochures",
    price: "₦20,000",
    quantity: "100 copies",
    icon: BookOpen,
  },
  {
    name: "Letterheads",
    href: "/print/letterheads",
    price: "₦12,000",
    quantity: "100 copies",
    icon: FileText,
  },
  {
    name: "Receipt Books",
    href: "/print/receipt-books",
    price: "₦15,000",
    quantity: "10 books",
    icon: ReceiptText,
  },
  {
    name: "Booklets",
    href: "/print/booklets",
    price: "₦25,000",
    quantity: "50 copies",
    icon: Layers3,
  },
  {
    name: "Labels",
    href: "/print/labels",
    price: "₦8,000",
    quantity: "50 pieces",
    icon: Sticker,
  },
];

export default function PrintProductsSection() {
  return (
    <section className="relative overflow-hidden bg-[#181818] py-16 text-white sm:py-20 lg:py-24">
      {/* =====================================================
          BACKGROUND PRINT DETAIL
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-130px] top-[-130px] h-[390px] w-[390px] rounded-full border border-white/[0.04]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-70px] top-[-70px] h-[270px] w-[270px] rounded-full border border-white/[0.05]"
      />

      <div className="relative mx-auto w-[92%] max-w-[1440px]">
        {/* =====================================================
            SECTION INTRO
        ===================================================== */}

        <div className="grid gap-8 border-b border-white/10 pb-9 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7 bg-[#FF6B00]" />

              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                The print department
              </span>
            </div>

            <h2 className="mt-4 text-[36px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[46px] lg:text-[52px]">
              Print that has
              <br />
              a job to do.
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <p className="max-w-[570px] text-[13px] leading-6 text-white/50 sm:text-sm">
              From the card you hand to a new client to the packaging
              carrying your product, we produce the physical pieces
              people actually interact with.
            </p>

            <Link
              href="/print"
              className="group inline-flex w-fit items-center gap-3 text-[10px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:text-[#FF6B00]"
            >
              Browse the full print catalogue

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white">
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>
        </div>

        {/* =====================================================
            PRINT CATEGORY STORIES
        ===================================================== */}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {printCategories.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative min-h-[430px] overflow-hidden rounded-[22px] bg-[#262626]"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 1024px) 92vw, 31vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* image treatment */}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5" />

              {/* number */}

              <span className="absolute left-5 top-5 text-[9px] font-black tracking-[0.16em] text-white/55">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* arrow */}

              <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#181818] transition-all duration-300 group-hover:bg-[#FF6B00] group-hover:text-white">
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              {/* content */}

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#FF6B00]">
                  {category.label}
                </p>

                <h3 className="mt-3 text-[25px] font-black tracking-[-0.035em] text-white">
                  {category.title}
                </h3>

                <p className="mt-3 max-w-[340px] text-[11px] leading-5 text-white/55">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* =====================================================
            QUICK PRODUCTS
        ===================================================== */}

        <div className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">
                More from print
              </p>

              <h3 className="mt-2 text-xl font-black tracking-[-0.025em]">
                Everyday production.
              </h3>
            </div>

            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.12em] text-white/30 sm:block">
              Made to order
            </span>
          </div>

          <div className="grid overflow-hidden rounded-[20px] border border-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {quickProducts.map((product, index) => {
              const Icon = product.icon;

              return (
                <Link
                  key={product.name}
                  href={product.href}
                  className={`
                    group
                    relative
                    min-h-[185px]
                    bg-white/[0.025]
                    p-5
                    transition-colors
                    hover:bg-white/[0.06]

                    ${
                      index !== 0
                        ? "border-t border-white/10 sm:border-l"
                        : ""
                    }

                    ${
                      index === 2
                        ? "sm:border-l-0 lg:border-l"
                        : ""
                    }

                    ${
                      index >= 2
                        ? "sm:border-t lg:border-t-0"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.07] text-white/65 transition-colors group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon size={16} />
                    </div>

                    <ArrowUpRight
                      size={14}
                      className="text-white/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF6B00]"
                    />
                  </div>

                  <div className="mt-8">
                    <h4 className="text-[13px] font-bold">
                      {product.name}
                    </h4>

                    <p className="mt-2 text-[15px] font-black tracking-[-0.02em] text-white">
                      {product.price}
                    </p>

                    <p className="mt-1 text-[9px] text-white/35">
                      {product.quantity}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            CUSTOM PRINT BAND
        ===================================================== */}

        <div className="mt-8 grid overflow-hidden rounded-[22px] bg-[#F2EFE7] text-[#181818] lg:grid-cols-[1fr_auto]">
          <div className="flex gap-4 p-6 sm:items-center sm:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white">
              <Package size={18} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                Custom print
              </p>

              <h3 className="mt-2 text-[20px] font-black tracking-[-0.025em]">
                Invitations, certificates, calendars and packaging.
              </h3>

              <p className="mt-2 max-w-[670px] text-[11px] leading-5 text-[#77736C]">
                Some jobs depend on size, material, finish and quantity.
                Tell us what you need and we&apos;ll build the production
                specification around it.
              </p>
            </div>
          </div>

          <Link
            href="/custom"
            className="group flex min-h-[88px] items-center justify-between gap-8 bg-[#FF6B00] px-7 text-white transition-colors hover:bg-[#E96000] lg:min-w-[245px]"
          >
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.12em]">
                Request custom print
              </span>

              <span className="mt-1 block text-[9px] text-white/65">
                Tell us about the job
              </span>
            </div>

            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* =====================================================
            PRODUCTION NOTE
        ===================================================== */}

        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Boxes size={13} className="text-[#FF6B00]" />

            <p className="text-[9px] font-semibold text-white/40">
              Larger quantity? Production pricing changes with volume.
            </p>
          </div>

          <Link
            href="/shop/quote"
            className="text-[9px] font-black uppercase tracking-[0.12em] text-white/60 transition hover:text-[#FF6B00]"
          >
            Request bulk pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
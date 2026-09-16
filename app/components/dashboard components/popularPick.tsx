"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Product = {
  name: string;
  image: string;
  href: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  quantity?: string;
  status?: "Available Now" | "Made to Order" | "Custom" | "Pre-Order";
};

const products: Product[] = [
  {
    name: "Premium Business Cards",
    image: "/images/products/business-cards.jpg",
    href: "/print/business-cards",
    price: "₦15,000",
    oldPrice: "₦18,000",
    discount: "-17%",
    quantity: "100 copies",
    status: "Made to Order",
  },
  {
    name: "Premium Flyers",
    image: "/images/products/flyers.jpg",
    href: "/print/flyers",
    price: "₦12,000",
    oldPrice: "₦15,000",
    discount: "-20%",
    quantity: "100 copies",
    status: "Made to Order",
  },
  {
    name: "Large Format Posters",
    image: "/images/products/posters.jpg",
    href: "/print/posters",
    price: "₦5,000",
    oldPrice: "₦7,000",
    discount: "-29%",
    quantity: "10 copies",
    status: "Made to Order",
  },
  {
    name: "Premium Banners",
    image: "/images/products/banners.jpg",
    href: "/print/banners",
    price: "₦8,000",
    quantity: "1 piece",
    status: "Made to Order",
  },
  {
    name: "Branded Stickers",
    image: "/images/products/stickers.jpg",
    href: "/print/stickers",
    price: "₦8,000",
    oldPrice: "₦10,000",
    discount: "-20%",
    quantity: "50 pieces",
    status: "Made to Order",
  },
  {
    name: "Custom Packaging",
    image: "/images/products/packaging.jpg",
    href: "/print/packaging",
    price: "Get a quote",
    quantity: "From 50",
    status: "Custom",
  },
  {
    name: "Branded Jerseys",
    image: "/images/products/jerseys.jpg",
    href: "/apparel/jerseys",
    price: "From ₦18,000",
    quantity: "1 piece",
    status: "Custom",
  },
  {
    name: "Branded T-Shirts",
    image: "/images/products/tshirts.jpg",
    href: "/apparel/t-shirts",
    price: "From ₦8,500",
    quantity: "1 piece",
    status: "Made to Order",
  },
];

const statusStyles: Record<
  NonNullable<Product["status"]>,
  string
> = {
  "Available Now": "bg-emerald-50 text-emerald-700",
  "Made to Order": "bg-[#fff1e7] text-[#e66000]",
  Custom: "bg-neutral-100 text-neutral-600",
  "Pre-Order": "bg-purple-50 text-purple-700",
};

export default function TopProducts() {
  return (
    <section className="w-full bg-[#FF6B00] py-7 sm:py-8 md:py-10">
      <div className="mx-auto w-[94%] max-w-[1440px]">

        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
          <div>
            <h2 className="text-[24px] font-bold tracking-tight text-white sm:text-[28px] md:text-[30px]">
              Popular at NewJersey
            </h2>

            <p className="mt-0.5 text-sm text-white/75">
              The products businesses, events and brands order most.
            </p>
          </div>

          <Link
            href="/shop"
            className="group flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#FF6B00] transition hover:bg-white/90 sm:px-5 sm:text-sm"
          >
            See all

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Product carousel */}
        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-1
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            sm:gap-4
          "
        >
          {products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="
                group
                w-[190px]
                min-w-[190px]
                overflow-hidden
                rounded-[14px]
                bg-white
                sm:w-[205px]
                sm:min-w-[205px]
                md:w-[215px]
                md:min-w-[215px]
              "
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-[#f4f4f4]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 190px, (max-width: 768px) 205px, 215px"
                  className="object-cover transition duration-500 group-hover:scale-[1.035]"
                />
              </div>

              {/* Details */}
              <div className="p-3">

                {product.status && (
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-wide ${statusStyles[product.status]}`}
                  >
                    {product.status}
                  </span>
                )}

                <h3 className="mt-2 line-clamp-2 min-h-[36px] text-[13px] font-medium leading-[18px] text-[#363636]">
                  {product.name}
                </h3>

                {product.quantity && (
                  <p className="mt-1 text-[10px] text-[#999]">
                    {product.quantity}
                  </p>
                )}

                <div className="mt-2.5">
                  <p className="text-[15px] font-bold tracking-tight text-[#222]">
                    {product.price}
                  </p>

                  {(product.oldPrice || product.discount) && (
                    <div className="mt-0.5 flex items-center gap-2">

                      {product.oldPrice && (
                        <span className="text-[10px] text-[#aaa] line-through">
                          {product.oldPrice}
                        </span>
                      )}

                      {product.discount && (
                        <span className="rounded bg-[#008f5a] px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {product.discount}
                        </span>
                      )}

                    </div>
                  )}
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Product = {
  name: string;
  href: string;
  image: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  quantity: string;
};

const printProducts: Product[] = [
  { name: "Business Cards", href: "/print/business-cards", image: "/images/products/print/business-cards.webp", price: "₦15,000", oldPrice: "₦18,000", discount: "-17%", quantity: "100 copies" },
  { name: "Flyers", href: "/print/flyers", image: "/images/products/print/flyers.webp", price: "₦12,000", oldPrice: "₦15,000", discount: "-20%", quantity: "100 copies" },
  { name: "Posters", href: "/print/posters", image: "/images/products/print/posters.webp", price: "₦5,000", oldPrice: "₦7,000", discount: "-29%", quantity: "10 copies" },
  { name: "Banners", href: "/print/banners", image: "/images/products/print/banners.webp", price: "₦8,000", quantity: "1 piece" },
  { name: "Brochures", href: "/print/brochures", image: "/images/products/print/brochures.webp", price: "₦20,000", quantity: "100 copies" },
  { name: "Stickers", href: "/print/stickers", image: "/images/products/print/stickers.webp", price: "₦8,000", quantity: "50 pieces" },
  { name: "Labels", href: "/print/labels", image: "/images/products/print/labels.webp", price: "₦8,000", quantity: "50 pieces" },
  { name: "Letterheads", href: "/print/letterheads", image: "/images/products/print/letterheads.webp", price: "₦12,000", quantity: "100 copies" },
  { name: "Booklets", href: "/print/booklets", image: "/images/products/print/booklets.webp", price: "₦25,000", quantity: "50 copies" },
  { name: "Receipt Books", href: "/print/receipt-books", image: "/images/products/print/receipt-books.webp", price: "₦15,000", quantity: "10 books" },
];

const customProducts: Product[] = [
  { name: "Invitations", href: "/print/invitations", image: "/images/products/print/invitations.webp", price: "Custom quote", quantity: "From 10" },
  { name: "Certificates", href: "/print/certificates", image: "/images/products/print/certificates.webp", price: "Custom quote", quantity: "From 10" },
  { name: "Packaging", href: "/print/packaging", image: "/images/products/print/packaging.webp", price: "Custom quote", quantity: "From 50" },
  { name: "Calendars", href: "/print/calendars", image: "/images/products/print/calendars.webp", price: "Custom quote", quantity: "From 10" },
];

function ProductTile({ product }: { product: Product }) {
  return (
    <Link href={product.href} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f5f5f3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {product.discount && (
          <span className="absolute left-1.5 top-1.5 rounded bg-[#008f5a] px-1.5 py-0.5 text-[9px] font-bold text-white">
            {product.discount}
          </span>
        )}
      </div>

      <div className="mt-1.5">
        <p className="truncate text-[12px] font-medium text-[#292929]">
          {product.name}
        </p>

        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-[#222]">
            {product.price}
          </span>

          {product.oldPrice && (
            <span className="text-[10px] text-[#aaa] line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

        <p className="text-[10px] text-[#999]">{product.quantity}</p>
      </div>
    </Link>
  );
}

export default function PrintProductsSection() {
  return (
    <section className="w-full bg-[#fafafa] py-8 md:py-10">
      <div className="mx-auto w-[92%] max-w-[1440px]">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-[#222] md:text-xl">
            Print products
          </h2>

          <Link
            href="/print"
            className="group flex items-center gap-1 text-xs font-medium text-[#333] transition hover:text-[#ff6b00]"
          >
            Explore print
            <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Made to order */}
        <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {printProducts.map((product) => (
            <ProductTile key={product.name} product={product} />
          ))}
        </div>

        {/* Custom print — second row */}
        <div className="mt-7">
          <p className="mb-3 text-xs font-medium text-[#999]">Custom print</p>

          <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {customProducts.map((product) => (
              <ProductTile key={product.name} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
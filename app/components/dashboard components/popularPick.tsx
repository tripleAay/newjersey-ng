import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type FeaturedProduct = {
  id: string;
  name: string;
  image: string;
  href: string;
  startingPrice: number;
  priceBasis: string;
  category: string;
};

const products: FeaturedProduct[] = [
  {
    id: "business-cards",
    name: "Business Cards",
    image: "/images/products/business-cards.jpg",
    href: "/print/business-cards",
    startingPrice: 15000,
    priceBasis: "100 copies",
    category: "Print",
  },
  {
    id: "flyers",
    name: "Flyers",
    image: "/images/products/flyers.jpg",
    href: "/print/flyers",
    startingPrice: 12000,
    priceBasis: "100 copies",
    category: "Print",
  },
  {
    id: "t-shirts",
    name: "Branded T-Shirts",
    image: "/images/products/tshirts.jpg",
    href: "/apparel/t-shirts",
    startingPrice: 8500,
    priceBasis: "1 piece",
    category: "Apparel",
  },
  {
    id: "jerseys",
    name: "Branded Jerseys",
    image: "/images/products/jerseys.jpg",
    href: "/apparel/jerseys",
    startingPrice: 18000,
    priceBasis: "1 piece",
    category: "Apparel",
  },
];

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function ProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <article className="min-w-0">
      <Link href={product.href} className="group block rounded-xl">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#EFEDE7]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1023px) 50vw, (max-width: 1440px) 25vw, 320px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transform-none"
          />
        </div>

        <div className="pt-4">
          <p className="text-xs font-medium text-[#625D55]">
            {product.category}
          </p>

          <div className="mt-1.5 flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-6 text-[#181818] sm:text-base">
              {product.name}
            </h3>

            <ArrowUpRight
              size={17}
              aria-hidden="true"
              className="mt-1 shrink-0 text-[#625D55]"
            />
          </div>

          <p className="mt-3 text-sm leading-6 text-[#181818] sm:text-base">
            <span className="mr-1 text-xs text-[#625D55]">From</span>
            <span className="font-semibold">
              {currency.format(product.startingPrice)}
            </span>
          </p>

          <p className="mt-0.5 text-xs leading-5 text-[#625D55] sm:text-sm">
            For {product.priceBasis}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function TopProducts() {
  return (
    <section
      aria-labelledby="featured-products-heading"
      className="bg-[#F4F1E9] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
              Featured products
            </p>

            <h2
              id="featured-products-heading"
              className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl"
            >
              Start with the essentials.
            </h2>
          </div>

          <Link
            href="/print"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Browse print products
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <p className="mt-8 max-w-2xl border-t border-black/10 pt-5 text-sm leading-6 text-[#625D55]">
          Prices vary with your selected specifications and quantity.
          Design assistance and delivery are quoted separately.
        </p>
      </div>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    title: "Paper Bag",
    min: "100 units",
    image: "/images/paper-bag.jpg",
    price: "₦18,000",
    badge: "Popular",
    rating: "4.8",
    orders: "92",
    delivery: "3–5 days",
  },
  {
    title: "Large Format & Banner",
    min: "1 unit",
    image: "/images/banner.jpg",
    price: "₦7,500",
    badge: "Event Ready",
    rating: "4.9",
    orders: "64",
    delivery: "24–72 hrs",
  },
  {
    title: "Business Card",
    min: "100 units",
    image: "/images/business-card.jpg",
    price: "₦12,500",
    badge: "Best Seller",
    rating: "5.0",
    orders: "124",
    delivery: "2–3 days",
  },
  {
    title: "Souvenir",
    min: "1 unit",
    image: "/images/souvenir.jpg",
    price: "₦5,000",
    badge: "Gift Item",
    rating: "4.7",
    orders: "48",
    delivery: "3–5 days",
  },
  {
    title: "T-Shirt",
    min: "1 unit",
    image: "/images/t-shirt.jpg",
    price: "₦8,500",
    badge: "Apparel",
    rating: "4.9",
    orders: "138",
    delivery: "2–4 days",
  },
  {
    title: "Polo Shirts",
    min: "1 unit",
    image: "/images/polo-shirts.jpg",
    price: "₦12,000",
    badge: "Corporate",
    rating: "4.8",
    orders: "76",
    delivery: "3–5 days",
  },
  {
    title: "Flyer & Handbills",
    min: "100 units",
    image: "/images/flyer-handbills.jpg",
    price: "₦15,000",
    badge: "Promo",
    rating: "4.9",
    orders: "101",
    delivery: "2–3 days",
  },
  {
    title: "Letterhead",
    min: "100 units",
    image: "/images/letterhead.jpg",
    price: "₦10,000",
    badge: "Office",
    rating: "4.7",
    orders: "57",
    delivery: "3–5 days",
  },
];

export default function ProductsGrid() {
  return (
    <section className="bg-[#f7f7f7] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const slug = product.title
              .toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("&", "and");

            return (
              <div
                key={product.title}
                className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ff6b00]/30 hover:shadow-[0_25px_60px_rgba(255,107,0,0.12)]"
              >
                <Link href={`/products/${slug}`} className="block">
                  <div className="relative h-[200px] overflow-hidden bg-zinc-100">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase text-black shadow-sm">
                      {product.badge}
                    </span>

                    <span className="absolute bottom-3 left-3 rounded-full bg-[#ff6b00] px-3 py-1 text-[10px] font-black uppercase text-white">
                      Min {product.min}
                    </span>

                    <div className="absolute bottom-3 right-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm shadow-lg transition hover:bg-[#ff6b00] hover:text-white"
                      >
                        ♥
                      </button>

                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm text-white shadow-lg transition hover:bg-[#ff6b00]"
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/products/${slug}`}>
                      <h3 className="line-clamp-2 text-[15px] font-black leading-tight text-black transition group-hover:text-[#ff6b00]">
                        {product.title}
                      </h3>
                    </Link>

                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/45 transition hover:border-[#ff6b00] hover:bg-[#ff6b00] hover:text-white"
                    >
                      →
                    </button>
                  </div>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-lg font-black text-black">
                      {product.price}
                    </span>

                    <span className="pb-0.5 text-[11px] font-medium text-black/40">
                      starting price
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[12px] text-[#ff6b00]">★★★★★</span>

                    <span className="text-[11px] font-medium text-black/45">
                      {product.rating} • {product.orders}+ orders
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-green-600">
                      🚚 {product.delivery}
                    </span>

                    <span className="rounded-full bg-[#f7f3ee] px-2.5 py-1 text-[10px] font-bold text-black/55">
                      Customizable
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-xl bg-black py-2.5 text-xs font-bold text-white transition hover:bg-[#ff6b00]"
                    >
                      Add to Cart
                    </button>

                    <Link
                      href="/quote"
                      className="rounded-xl border border-black/10 py-2.5 text-center text-xs font-bold text-black transition hover:border-[#ff6b00] hover:text-[#ff6b00]"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
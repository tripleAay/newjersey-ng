import Link from "next/link";

const categories = [
  "All Products",
  "Business Stationery",
  "T-Shirts & Clothing",
  "Events",
];

const filters = [
  "Paper Bag",
  "Large Format & Banner",
  "Business Card",
  "Souvenir",
  "T-Shirt",
  "Polo Shirts",
  "Flyer & Handbills",
  "Letterhead",
  "Plastic ID Cards",
  "Custom Mug",
  "Calendar",
  "Wall Art",
  "Branded Envelopes",
  "Hoodies & Sweatshirts",
];

export default function ProductFilterHeader() {
  return (
    <section className="bg-[#f7f7f7] px-6 pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff6b00]">
              Shop NewJersey.ng
            </span>
            <h1 className="mt-1 text-xl font-black text-black">
              Our Products
            </h1>
          </div>

          <div className="hidden text-[11px] font-semibold text-black/50 md:block">
            Home <span className="mx-2">›</span> All Products
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-5 border-b border-black/5 pb-4 text-[13px] font-semibold text-black/70">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`transition hover:text-[#ff6b00] ${
                  index === 0 ? "text-[#ff6b00]" : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <Link
                key={filter}
                href={`/products?category=${encodeURIComponent(filter)}`}
                className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
                  index === 0
                    ? "bg-[#ff6b00] text-white"
                    : "bg-black text-white hover:bg-[#ff6b00]"
                }`}
              >
                {filter}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f6f1e8]">
      {/* Background Effects */}
      <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#ff6b00]/10 blur-3xl" />
      <div className="absolute right-20 bottom-10 h-64 w-64 rounded-full bg-black/5 blur-3xl" />

      <div className="mx-auto grid min-h-[520px] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
        {/* LEFT CONTENT */}
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ff6b00]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ff6b00] shadow-sm">
            ✦ Custom Printing & Branding
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-tight text-[#1f2f46] md:text-4xl">
            Print Materials
            <span className="block text-[#ff6b00]">
              That Get Attention
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-[#6f7785]">
            Apparel, business cards, mugs, jerseys, and merchandise designed
            to help brands stand out and stay memorable.
          </p>

          {/* Search */}
          <div className="mt-9">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#1f2f46]">
              What would you like to print today?
            </p>

            <div className="flex h-16 max-w-2xl items-center rounded-2xl bg-white px-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
              <input
                type="text"
                placeholder="Search business cards, jerseys, mugs..."
                className="w-full bg-transparent text-[15px] text-gray-700 outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                className="ml-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff6b00] text-lg font-bold text-white transition-all duration-300 hover:bg-black hover:scale-105"
              >
                ⌕
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Apparel",
              "Jerseys",
              "Business Cards",
              "Mugs & Caps",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#1f2f46] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative hidden h-[430px] lg:block">
          {/* Orange Glow */}
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#ff6b00]/20 blur-3xl" />

          {/* Glass Background Card */}
          <div className="absolute right-10 top-12 h-[310px] w-[310px] rounded-[40px] border border-white/60 bg-white/30 backdrop-blur-md" />

          {/* Floating Card 1 */}
          <div className="absolute left-0 top-14 z-20 rounded-2xl bg-white px-5 py-4 shadow-[0_25px_50px_rgba(0,0,0,0.12)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff6b00]">
              Fast Delivery
            </p>

            <p className="mt-1 text-sm font-semibold text-black">
              Nationwide Shipping
            </p>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute bottom-8 right-0 z-20 rounded-2xl bg-black px-5 py-4 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff6b00]">
              Flexible Orders
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Starting from 1 Unit
            </p>
          </div>

          {/* Main Image */}
          <div className="absolute inset-0 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03]">
            <Image
              src="/images/newjersey.ng_card.png"
              alt="NewJersey.ng Business Card"
              fill
              priority
              className="
                object-contain
                object-right
                drop-shadow-[0_40px_60px_rgba(0,0,0,0.28)]
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
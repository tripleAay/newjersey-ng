import Link from "next/link";

export default function EmptyCartPanel() {
  return (
    <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-[#ff6b00]/10 px-5 py-4">
        <span className="text-xl">🚚</span>

        <div className="h-7 w-px bg-[#ff6b00]/25" />

        <p className="text-sm font-bold text-black">
          Free delivery on selected orders
        </p>
      </div>

      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa] text-4xl">
          🛒
        </div>

        <h1 className="mt-5 text-lg font-black text-black">
          Your shopping cart is empty
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Add your favorite print items to continue.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#ff6b00] px-8 py-3 text-sm font-bold text-white transition hover:bg-black"
          >
            Sign in / Register
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-black/20 px-8 py-3 text-sm font-bold text-black transition hover:border-[#ff6b00] hover:text-[#ff6b00]"
          >
            Start shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
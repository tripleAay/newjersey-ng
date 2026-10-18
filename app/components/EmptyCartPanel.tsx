import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCartPanel() {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white px-6 py-14 text-center sm:py-20">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6B00]/5 text-[#FF6B00]">
        <ShoppingBag size={28} aria-hidden="true" />
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight">
        Your order is empty.
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#777]">
        Choose a product and configure your specifications
        to start an order.
      </p>

      <Link
        href="/shop"
        className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#FF6B00] px-7 py-3.5 text-sm font-semibold text-[#181818] transition hover:bg-[#54142A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
      >
        Explore the shop
      </Link>
    </section>
  );
}
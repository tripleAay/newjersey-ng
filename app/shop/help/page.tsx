import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { helpTopics } from "@/app/lib/newjersey/help/navigation";
export const metadata: Metadata = {
  title: "Help Centre | NewJersey.ng",
  description:
    "Help with NewJersey apparel, custom printing, jerseys, artwork, bank-transfer payments, delivery and order updates.",
};
export default function HelpCentre() {
  return (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8379]">
        NewJersey.ng / Help
      </p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
        Let’s get it sorted.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-[#625D55]">
        From choosing your jersey to sending artwork or checking a payment. Find
        the next step for your NewJersey order.
      </p>
      <Link
        href="/shop/order"
        className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#181818] px-5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
      >
        <ClipboardList size={16} aria-hidden="true" />
        View my orders
        <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
      <section aria-labelledby="help-topics-heading" className="mt-10">
        <h2 id="help-topics-heading" className="text-sm font-semibold">
          What do you need help with?
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {helpTopics.map((topic, index) => (
            <Link
              key={topic.slug}
              href={`/shop/help/${topic.slug}`}
              className="group flex flex-col rounded-xl border border-black/10 bg-white p-5 transition-colors hover:border-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tabular-nums text-[#8A8379]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="text-[#8A8379] group-hover:text-[#F58220]"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {topic.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-[#625D55]">
                {topic.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

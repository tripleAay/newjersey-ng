import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function StoreSection({
  id,
  eyebrow,
  title,
  description,
  href,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id + "-heading"}
      className="min-w-0 scroll-mt-40 py-7 sm:py-10"
    >
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-[#8A8379]">
            {eyebrow}
          </p>
          <h2
            id={id + "-heading"}
            className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-lg text-xs leading-6 text-[#625D55]">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-semibold text-[#FF6B00]"
        >
          View all
          <ArrowUpRight size={15} />
        </Link>
      </div>
      {children}
    </section>
  );
}

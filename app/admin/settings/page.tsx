import Link from "next/link";
import { ArrowUpRight, Landmark } from "lucide-react";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireStoreAdmin();

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Settings.
      </h1>

      <p className="mt-3 text-sm leading-7 text-[#625D55]">
        Manage how your store operates.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/settings/payments"
          className="group rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <div className="flex items-center justify-between gap-4">
            <Landmark
              size={22}
              strokeWidth={1.6}
              aria-hidden="true"
              className="text-[#625D55]"
            />

            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="text-[#625D55] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Payments
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#625D55]">
            Update your bank details, customer instructions,
            and bank transfer availability.
          </p>
        </Link>
      </div>
    </main>
  );
}
import Link from "next/link";
import Header from "@/components/dashboard components/mainheader";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <Header />

      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
        {/* soft ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full bg-[#d6cc6d]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shop
            </Link>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7 sm:p-10">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 className="h-7 w-7" />
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                Payment successful
              </p>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Order confirmed.
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-[15px]">
                Your payment was completed successfully and your order has been
                received. We’ll begin processing it shortly.
              </p>
            </div>

            {ref ? (
              <div className="mx-auto mt-8 max-w-2xl rounded-[22px] border border-white/8 bg-black/20 p-4 sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                  Payment reference
                </p>
                <p className="mt-2 break-all text-sm font-medium leading-6 text-[#e7db9b] sm:text-[15px]">
                  {ref}
                </p>
              </div>
            ) : null}

            <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[#d6cc6d] px-6 py-3 text-sm font-semibold text-black transition duration-200 hover:scale-[1.01] hover:brightness-[0.98]"
              >
                Continue shopping
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/[0.06]"
              >
                Go home
              </Link>
            </div>

            <div className="mx-auto mt-10 max-w-2xl border-t border-white/8 pt-6 text-center">
              <p className="text-sm leading-7 text-white/45">
                For bulk, custom, or branded orders, further delivery or
                production details may follow after confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
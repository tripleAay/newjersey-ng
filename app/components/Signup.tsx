import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6">
      <section className="mx-auto flex min-h-screen  max-w-6xl items-center justify-center">
        <div className="grid w-full py-10 items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-md">
            <span className="inline-flex rounded-full bg-[#ff6b00]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ff6b00]">
              NewJersey.ng
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-[#111]">
              Create your account.
            </h1>

            <p className="mt-4 text-base leading-7 text-black/60">
              Join NewJersey.ng to request quotes, manage print orders,
              track deliveries, and access your customer dashboard.
            </p>
          </div>

          <form className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-10">
            <div className="mb-7">
              <h2 className="text-2xl font-black text-black">
                Sign Up
              </h2>
              <p className="mt-2 text-sm text-black/50">
                Fill in your details to get started.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="First name" placeholder="Adeshina" />
              <Field label="Last name" placeholder="Adedokun" />
            </div>

            <div className="mt-5 space-y-5">
              <Field label="Phone number" placeholder="08012345678" />
              <Field label="Email Address" placeholder="you@example.com" />

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="Create password"
                    className="h-13 w-full rounded-xl border border-black/10 px-5 pr-12 text-sm outline-none transition placeholder:text-black/35 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                  >
                    👁
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-black/60">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#ff6b00] hover:text-black"
                >
                  Login
                </Link>
              </p>

              <button
                type="submit"
                className="flex h-12 items-center justify-center rounded-full bg-black px-7 text-sm font-bold text-white transition hover:bg-[#ff6b00]"
              >
                Create account →
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="h-13 w-full rounded-xl border border-black/10 px-5 text-sm outline-none transition placeholder:text-black/35 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
      />
    </div>
  );
}
export default function NewsletterSection() {
  return (
    <section className="bg-white px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[24px] bg-[#FF6B00] px-5 py-9 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:rounded-[28px] sm:px-10 sm:py-12 lg:px-16 lg:py-14">

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full border border-white/20" />

          <div className="pointer-events-none absolute -bottom-28 -left-24 h-52 w-52 rounded-full bg-black/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 mx-auto w-full max-w-2xl">

            {/* Label */}
            <span className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-black/70 sm:text-[9px] sm:tracking-[0.22em]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
              Stay in the loop
            </span>

            {/* Heading */}
            <h2 className="mx-auto mt-4 max-w-[280px] text-[27px] font-black leading-[0.98] tracking-[-0.045em] text-black sm:max-w-none sm:text-4xl lg:text-5xl">
              Good prints.
              <span className="block text-white">
                Better updates.
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-[290px] text-[12px] leading-[1.55] text-black/65 sm:max-w-md sm:text-sm sm:leading-6">
              Get occasional updates, new products and printing offers
              straight to your inbox.
            </p>

            {/* Form */}
            <form className="mx-auto mt-6 w-full max-w-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:rounded-2xl sm:bg-white sm:p-1.5">

                <input
                  type="email"
                  placeholder="Your email address"
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-[13px] text-black outline-none placeholder:text-black/35 focus:border-black/20 sm:h-12 sm:border-0 sm:text-sm"
                />

                <button
                  type="submit"
                  className="h-11 w-full shrink-0 rounded-xl bg-black px-6 text-xs font-black text-white transition duration-300 hover:bg-[#171717] sm:h-12 sm:w-auto sm:px-7"
                >
                  Subscribe
                </button>

              </div>
            </form>

            {/* Footer note */}
            <p className="mt-3 text-[8px] font-medium uppercase tracking-[0.12em] text-black/40 sm:text-[9px] sm:tracking-[0.15em]">
              No spam · Just useful updates
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
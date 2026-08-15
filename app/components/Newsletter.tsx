export default function NewsletterSection() {
  return (
    <section className="bg-white px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[28px] bg-[#FF6B00] px-6 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12 lg:px-16">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/20" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-black/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-black/70">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Stay in the loop
            </span>

            <h2 className="mt-5 text-3xl font-black leading-[0.95] tracking-[-0.04em] text-black sm:text-4xl lg:text-5xl">
              Good prints.
              <span className="block text-white">
                Better updates.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/65">
              Get occasional updates, new products and printing offers
              straight to your inbox.
            </p>

            {/* Form */}
            <form className="mx-auto mt-7 flex max-w-xl flex-col gap-2 sm:flex-row sm:rounded-2xl sm:bg-white sm:p-1.5">
              <input
                type="email"
                placeholder="Your email address"
                className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/20 sm:h-12 sm:border-0"
              />

              <button
                type="submit"
                className="h-12 shrink-0 rounded-xl bg-black px-6 text-xs font-black text-white transition duration-300 hover:bg-[#171717] sm:px-7"
              >
                Subscribe
              </button>
            </form>

            <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.15em] text-black/40">
              No spam · Just useful updates
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
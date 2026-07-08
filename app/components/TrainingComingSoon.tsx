export default function TrainingComingSoon() {
  const trainingTopics = [
    "Screen printing",
    "Heat press branding",
    "Vinyl cutting",
    "Mug & cap branding",
  ];

  const highlights = [
    "Beginner friendly",
    "Hands-on practice",
    "Small class size",
    "Business-ready skills",
  ];

  return (
    <section className="bg-[#fafafa] py-10">
      <div className="mx-auto max-w-7xl px-8 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          {/* Left Summary */}
          <aside className="space-y-4">
            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <span className="inline-flex rounded-full bg-[#ff6b00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b00]">
                Training
              </span>

              <h3 className="mt-4 text-xl font-black leading-tight text-black">
                Practical print training is coming soon.
              </h3>

              <p className="mt-2 text-xs leading-5 text-black/50">
                Learn real printing, branding, and production skills from
                practical projects.
              </p>

              <div className="mt-5 space-y-2.5">
                {trainingTopics.map((item) => (
                  <div
                    key={item}
                    className="group flex items-center justify-between rounded-2xl border border-black/5 bg-[#fafafa] px-4 py-3 transition hover:border-[#ff6b00]/25 hover:bg-[#ff6b00]/5"
                  >
                    <span className="text-xs font-bold text-black/65">
                      {item}
                    </span>

                    <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase text-[#ff6b00]">
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-black p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                Status
              </p>

              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-white">
                    Coming Soon
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Enrollment is not open yet.
                  </p>
                </div>

                <span className="h-3 w-3 rounded-full bg-[#ff6b00]" />
              </div>
            </div>
          </aside>

          {/* Right Details */}
          <div>
            <div className="mb-4 rounded-2xl border border-[#ff6b00]/20 bg-[#ff6b00]/10 px-5 py-4">
              <p className="text-xs leading-5 text-black/65">
                <span className="font-black text-[#ff6b00]">Notice:</span>{" "}
                Join the early interest list and get notified first when the
                training schedule, fee, location, and requirements are ready.
              </p>
            </div>

            <form className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="grid gap-5 md:grid-cols-[1fr_0.85fr]">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/60">
                    What do you want to learn?
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Example: screen printing, heat press, vinyl cutting, mug branding, cap branding, or how to start a print business..."
                    className="h-full w-full resize-none rounded-2xl border border-black/10 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-black/35 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                  />
                </div>

                <div className="rounded-3xl border border-dashed border-black/15 bg-[#fafafa] p-5 transition hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/5">
                  <p className="text-sm font-bold text-black">
                    Join the waitlist
                  </p>

                  <p className="mt-2 text-xs leading-5 text-black/50">
                    Leave your details. No payment required.
                  </p>

                  <div className="mt-5 space-y-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      className="h-11 w-full rounded-full border border-black/10 px-4 text-sm outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                    />

                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="h-11 w-full rounded-full border border-black/10 px-4 text-sm outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                    />

                    <input
                      type="email"
                      placeholder="Email address"
                      className="h-11 w-full rounded-full border border-black/10 px-4 text-sm outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-black text-black/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-[11px] text-black/45">
                    Training details will be announced soon.
                  </p>
                </div>

                <a
                  href="/contact"
                  className="text-xs font-semibold text-black/55 underline decoration-black/20 underline-offset-4 transition hover:text-[#ff6b00]"
                >
                  Ask about training
                </a>
              </div>
            </form>

            <button className="mt-5 h-12 w-full rounded-full bg-black text-sm font-bold text-white transition hover:bg-[#ff6b00]">
              Join Training Waitlist →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
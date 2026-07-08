export default function HireDesignerForm() {
  return (
    <section className="bg-[#fafafa] py-8">
      <div className="mx-auto max-w-7xl px-8 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Left Summary */}
          <aside className="space-y-4">
            <div className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="mb-5">
                <span className="inline-flex rounded-full bg-[#ff6b00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b00]">
                  Design Order
                </span>

                <h3 className="mt-3 text-xl font-black text-black">
                  What do you want to design?
                </h3>

                <p className="mt-2 text-xs leading-5 text-black/50">
                  Choose the print item you need artwork for.
                </p>
              </div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/60">
                Product
              </label>

              <select className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10">
                <option>Throw Pillow (A3)</option>
                <option>T-Shirt Design</option>
                <option>Business Card</option>
                <option>Flyer / Handbill</option>
                <option>Banner Design</option>
              </select>
            </div>

            <div className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-black/45">
                    Subtotal
                  </p>
                  <p className="mt-1 text-xs text-black/50">
                    Design service fee
                  </p>
                </div>

                <p className="text-xl font-black text-[#ff6b00]">₦5,000</p>
              </div>
            </div>
          </aside>

          {/* Right Form */}
          <div>
            <div className="mb-4 rounded-2xl border border-[#ff6b00]/20 bg-[#ff6b00]/10 px-5 py-4">
              <p className="text-xs leading-5 text-black/65">
                <span className="font-black text-[#ff6b00]">Important:</span>{" "}
                Please proof-read your design information and upload the correct
                assets. Production mistakes from wrong files may not be reversed.
              </p>
            </div>

            <form className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/60">
                  Design Information
                </label>

                <textarea
                  rows={4}
                  placeholder="Tell us your preferred colours, text, fonts, style, brand direction, sizes, and any special instructions..."
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-black/35 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                />
              </div>

              <div className="mt-6 rounded-3xl border border-dashed border-black/15 bg-[#fafafa] px-5 py-8 text-center transition hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/5">
                <p className="mx-auto max-w-xl text-sm leading-6 text-black/60">
                  Upload your logo, sample images, sketches, brand guide, or any
                  material that will help us design better.
                </p>

                <label className="mx-auto mt-5 inline-flex cursor-pointer items-center rounded-full bg-black px-6 py-3 text-xs font-bold text-white transition hover:bg-[#ff6b00]">
                  Upload Files
                  <input type="file" multiple className="hidden" />
                </label>

                <p className="mt-4 text-xs text-black/45">
                  Multiple files allowed. Max 10MB per upload.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {["AI", "PDF", "PSD", "CDR", "PNG", "JPG"].map((format) => (
                      <span
                        key={format}
                        className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-black text-black/60"
                      >
                        {format}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-[11px] text-black/45">
                    Acceptable file formats
                  </p>
                </div>

                <a
                  href="#"
                  className="text-xs font-semibold text-black/55 underline decoration-black/20 underline-offset-4 transition hover:text-[#ff6b00]"
                >
                  What makes a printable document?
                </a>
              </div>
            </form>

            <button className="mt-5 h-12 w-full rounded-full bg-black text-sm font-bold text-white transition hover:bg-[#ff6b00]">
              Continue →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
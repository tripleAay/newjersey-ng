export default function QuoteForm() {
  return (
    <section className="min-h-screen bg-[#f7f7f7] px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-black md:text-4xl">
            Get Custom Print Quote Quickly.
          </h1>
          <p className="mt-2 text-sm font-medium text-black/60">
            Fill the details of your order below.
          </p>
        </div>

        <form className="rounded-2xl bg-white px-8 py-10 shadow-sm md:px-12">
          <div className="space-y-7">
            <FormRow
              label="Fullname"
              hint="Your first and last names"
              type="input"
              placeholder="Fullname"
            />

            <FormRow
              label="Phone number"
              hint="Your phone number"
              type="input"
              placeholder="Phone number"
            />

            <FormRow
              label="Email Address"
              hint="Your email address"
              type="input"
              placeholder="Email Address"
            />

            <FormRow
              label="What would you like to Print?"
              hint="Tell us the name and the quantity"
              type="textarea"
              placeholder="e.g. 200 Notepads and 500 t-shirts"
            />

            <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
              <div>
                <label className="block text-sm font-black text-black">
                  How about the design <br />
                  Artwork?
                </label>
                <p className="mt-1 text-[10px] font-medium leading-4 text-black/70">
                  Let us know if you have the artwork for the print job.
                </p>
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs font-semibold text-black">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="artwork"
                    defaultChecked
                    className="accent-[#ff6b00]"
                  />
                  Yes, I have a design
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="artwork"
                    className="accent-[#ff6b00]"
                  />
                  No, I don&apos;t have one
                </label>
              </div>
            </div>

            <FormRow
              label="Your Delivery Address"
              hint="Kindly give us the full delivery address"
              type="textarea"
              placeholder="Your preferred delivery address"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-black px-7 py-3 text-xs font-bold text-white transition hover:bg-[#ff6b00]"
            >
              Submit Request →
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

type FormRowProps = {
  label: string;
  hint: string;
  placeholder: string;
  type: "input" | "textarea";
};

function FormRow({ label, hint, placeholder, type }: FormRowProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
      <div>
        <label className="block text-sm font-black text-black">{label}</label>
        <p className="mt-1 text-[10px] font-medium leading-4 text-black/70">
          {hint}
        </p>
      </div>

      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={4}
          className="w-full resize-y border border-black/25 px-4 py-3 text-sm outline-none transition placeholder:text-black/40 focus:border-[#ff6b00]"
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="h-11 w-full border border-black/25 px-4 text-sm outline-none transition placeholder:text-black/40 focus:border-[#ff6b00]"
        />
      )}
    </div>
  );
}
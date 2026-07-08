export default function OrderSummary() {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
      <h2 className="text-xl font-black text-black">Order Summary</h2>

      <div className="mt-6 flex items-center justify-between border-b border-black/10 pb-5">
        <span className="text-sm font-bold text-black/70">Total</span>
        <span className="text-2xl font-black text-black">₦0</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-black/55">
        Review your final amount before checkout.
      </p>

      <button className="mt-5 h-12 w-full rounded-full bg-[#ff6b00] text-sm font-bold text-white transition hover:bg-black">
        Checkout (0)
      </button>

      <div className="mt-8 space-y-5">
        <div className="rounded-2xl bg-[#fafafa] p-4">
          <p className="text-sm leading-6 text-black/65">
            🔒 You will not be charged until you review this order on the next
            page.
          </p>
        </div>

        <div className="rounded-2xl bg-[#fafafa] p-4">
          <h3 className="text-sm font-black text-black">
            🛡 Safe Payment Options
          </h3>

          <p className="mt-2 text-sm leading-6 text-black/55">
            NewJersey.ng protects your payment information with secure checkout
            and trusted payment methods.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">
            Payment methods
          </p>

          <div className="flex flex-wrap gap-2">
            {["Verve", "Visa", "Mastercard", "Transfer", "Opay"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-black/10 px-3 py-2 text-[11px] font-bold text-black/55"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
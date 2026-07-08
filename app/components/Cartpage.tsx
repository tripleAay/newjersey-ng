import Image from "next/image";
import Link from "next/link";


const picks = [
  { title: "Custom Earbuds", image: "/images/cart/earbuds.jpg" },
  { title: "Branded Hoodie", image: "/images/cart/hoodie.jpg" },
  { title: "Corporate Wristwatch", image: "/images/cart/watch.jpg" },
  { title: "LED Strip Light", image: "/images/cart/led-light.jpg" },
];

export default function CartPage() {
  return (
    <main className="min-h-screen bg-white px-8 py-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.4fr_0.7fr]">
        {/* Left */}
        <section>
          <div className="mb-12 flex items-center gap-4 rounded-lg bg-[#fff1e5] px-5 py-4">
            <span className="text-2xl">🚚</span>
            <div className="h-8 w-px bg-[#ff6b00]/20" />
            <p className="text-lg font-bold text-black">
              Free delivery on selected orders
            </p>
          </div>

          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <div className="text-7xl text-black/20">🛒</div>

            <h1 className="mt-5 text-xl font-black text-black">
              Your shopping cart is empty
            </h1>

            <p className="mt-2 text-base text-black/50">
              Add your favorite print items to continue.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/login"
                className="rounded-full bg-[#ff6b00] px-20 py-4 text-base font-bold text-white transition hover:bg-black"
              >
                Sign in / Register
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-black/30 px-20 py-4 text-base font-bold text-black transition hover:border-[#ff6b00] hover:text-[#ff6b00]"
              >
                Start shopping
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-5 text-2xl font-black text-black">
              Explore NewJersey.ng picks
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {picks.map((item) => (
                <Link
                  href="/products"
                  key={item.title}
                  className="group overflow-hidden rounded-2xl bg-[#f7f7f7] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative h-[210px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-4 py-3">
                    <h3 className="text-sm font-bold text-black">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Right */}
        <aside className="h-fit rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black text-black">Order Summary</h2>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-lg font-bold text-black">Total</span>
            <span className="text-2xl font-black text-black">₦0</span>
          </div>

          <p className="mt-4 text-sm leading-6 text-black/55">
            Please review your final payment amount before checkout.
          </p>

          <button className="mt-6 h-14 w-full rounded-full bg-[#ff6b00] text-base font-bold text-white transition hover:bg-black">
            Checkout (0)
          </button>

          <div className="mt-10 space-y-6">
            <div className="flex gap-3">
              <span className="text-green-600">🔒</span>
              <p className="text-sm leading-6 text-black/65">
                You will not be charged until you review this order on the next
                page.
              </p>
            </div>

            <div>
              <div className="mb-2 flex gap-3">
                <span className="text-green-600">🛡</span>
                <h3 className="text-base font-black text-black">
                  Safe Payment Options
                </h3>
              </div>

              <p className="text-sm leading-6 text-black/60">
                NewJersey.ng protects your payment information with secure
                checkout and trusted payment methods.
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-black">
                Payment methods
              </p>

              <div className="flex flex-wrap gap-2">
                {["Verve", "VISA", "Mastercard", "Bank Transfer", "Opay"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-md border border-black/10 px-3 py-2 text-xs font-bold text-black/60"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
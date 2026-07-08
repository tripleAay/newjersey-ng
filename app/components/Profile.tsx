import Link from "next/link";

const menuItems = [
  { label: "My Profile", sub: "Account Information", href: "/dashboard/profile", active: true },
  { label: "Delivery Address", sub: "Saved delivery locations", href: "/dashboard/address" },
  { label: "My Orders", sub: "Order History", href: "/dashboard/orders" },
  { label: "Pending Ratings", sub: "2", href: "/dashboard/ratings" },
  { label: "My Wallet", sub: "Wallet", href: "/dashboard/wallet" },
  { label: "Delete Account", sub: "Delete Account", href: "/dashboard/delete-account", danger: true },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-8 py-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-xs font-semibold text-black/45">
          <Link href="/" className="hover:text-[#ff6b00]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/dashboard" className="hover:text-[#ff6b00]">My Account</Link>
          <span className="mx-2">›</span>
          <span className="text-black">My Profile</span>
        </div>

        <div className="mb-8">
          <span className="inline-flex rounded-full bg-[#ff6b00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b00]">
            Account Information
          </span>

          <h1 className="mt-3 text-2xl font-black text-black">
            My Profile
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          <aside className="h-fit rounded-[28px] border border-black/5 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`mb-2 block rounded-2xl px-4 py-4 transition ${
                  item.active
                    ? "bg-[#ff6b00] text-white"
                    : item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-black hover:bg-[#fafafa]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black">{item.label}</p>
                    <p
                      className={`mt-1 text-xs ${
                        item.active
                          ? "text-white/70"
                          : item.danger
                          ? "text-red-400"
                          : "text-black/45"
                      }`}
                    >
                      {item.sub}
                    </p>
                  </div>

                  {item.label === "Pending Ratings" && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                      2
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </aside>

          <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] md:p-8">
            <div className="mb-7 flex items-center justify-between border-b border-black/10 pb-5">
              <div>
                <h2 className="text-xl font-black text-black">
                  Account Information
                </h2>
                <p className="mt-1 text-sm text-black/45">
                  Update your personal details and password.
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#ff6b00]/10 text-sm font-black text-[#ff6b00] md:flex">
                AA
              </div>
            </div>

            <form>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="First Name" defaultValue="adeshina" />
                <Field label="Last Name" defaultValue="adeniyi" />
              </div>

              <div className="mt-5">
                <Field label="Email Address" defaultValue="adeshina93@gmail.com" type="email" />
              </div>

              <div className="my-8 h-px bg-black/10" />

              <div className="mb-5">
                <h3 className="text-sm font-black text-black">
                  Password Settings
                </h3>
                <p className="mt-1 text-xs text-black/45">
                  Leave password fields empty if you do not want to change it.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Current Password" type="password" placeholder="Current password" />
                <Field label="New Password" type="password" placeholder="New password" />
                <Field label="Confirm Password" type="password" placeholder="Confirm password" />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="h-12 rounded-full bg-black px-8 text-sm font-bold text-white transition hover:bg-[#ff6b00]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/55">
        {label}
      </label>

      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none transition placeholder:text-black/35 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
      />
    </div>
  );
}
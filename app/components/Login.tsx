import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          
          {/* Left Side */}
          <div className="max-w-md">
            <span className="inline-flex rounded-full bg-[#ff6b00]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ff6b00]">
              NewJersey.ng
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-[#111]">
              Welcome Back.
            </h1>

            <p className="mt-4 text-lg leading-8 text-black/60">
              Log in to manage your orders, track deliveries,
              request quotes, and access your printing dashboard.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-black">
                Sign In
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Enter your details below to continue.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-black/10
                    px-5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#ff6b00]
                    focus:ring-4
                    focus:ring-[#ff6b00]/10
                  "
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-black">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#ff6b00]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="
                      h-14
                      w-full
                      rounded-xl
                      border
                      border-black/10
                      px-5
                      pr-12
                      text-sm
                      outline-none
                      transition
                      focus:border-[#ff6b00]
                      focus:ring-4
                      focus:ring-[#ff6b00]/10
                    "
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                className="
                  mt-2
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-[#ff6b00]
                "
              >
                Login →
              </button>

              {/* Register */}
              <p className="text-center text-sm text-black/60">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#ff6b00]"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
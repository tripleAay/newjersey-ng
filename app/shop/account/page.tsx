import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Heart,
  MapPin,
  Package,
  Store,
  UserRound,
} from "lucide-react";

import Header from "@/app/components/dashboard components/mainheader";
import Footer from "@/app/components/Footer";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { signOut } from "./actions";

type Props = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

const navigation = [
  {
    label: "Overview",
    href: "/shop/account",
    icon: UserRound,
    active: true,
  },
  {
    label: "My orders",
    href: "/shop/order",
    icon: Package,
    active: false,
  },
  
  {
    label: "Explore the store",
    href: "/shop",
    icon: Store,
    active: false,
  },
  {
  label: "Delivery address",
  href: "/shop/account/address",
  icon: MapPin,
  active: false,
},
];

export default async function AccountPage({ searchParams }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=%2Fshop%2Faccount");
  }

  const params = await searchParams;

  const rawName = user.user_metadata?.full_name;

  const fullName =
    typeof rawName === "string" && rawName.trim()
      ? rawName.trim()
      : "Customer";

  const firstName = fullName.split(/\s+/)[0];

  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-9">
          <p className="text-xs font-medium text-[#625D55]">
            Your NewJersey account
          </p>

          <h1 className="mt-3 break-words text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#625D55]">
            Your account details and shortcuts to your purchases and saved
            pieces.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <aside>
            <nav
              aria-label="Account navigation"
              className="flex flex-wrap gap-2 lg:flex-col"
            >
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm ${item.active
                        ? "bg-[#F4F1E9] font-semibold text-[#181818]"
                        : "text-[#625D55] hover:bg-[#F4F1E9]"
                      }`}
                  >
                    <Icon
                      size={18}
                      aria-hidden="true"
                      className={
                        item.active ? "text-[#F58220]" : "text-[#625D55]"
                      }
                    />

                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <form
              action={signOut}
              className="mt-5 border-t border-black/10 pt-4"
            >
              <button
                type="submit"
                className="min-h-11 px-4 text-sm font-medium hover:underline"
              >
                Sign out
              </button>
            </form>
          </aside>

          <div className="min-w-0">
            {params.error === "signout" && (
              <p
                role="alert"
                className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800"
              >
                Unable to sign out. Please try again.
              </p>
            )}

            <section
              aria-labelledby="account-overview-heading"
              className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
            >
              <div className="flex items-center gap-4 border-b border-black/10 pb-6">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#181818] text-sm font-semibold text-white"
                >
                  {initials}
                </span>

                <div className="min-w-0">
                  <h2
                    id="account-overview-heading"
                    className="text-xl font-semibold tracking-tight"
                  >
                    Account overview
                  </h2>

                  <p className="mt-1 text-sm text-[#625D55]">
                    Your personal account information.
                  </p>
                </div>
              </div>

              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#625D55]">Full name</dt>
                  <dd className="mt-2 break-words text-base font-medium">
                    {fullName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#625D55]">Email address</dt>
                  <dd className="mt-2 break-words text-base font-medium">
                    {user.email || "Not provided"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#625D55]">
                    Email confirmation
                  </dt>
                  <dd className="mt-2 text-sm font-medium">
                    {user.email_confirmed_at ? "Confirmed" : "Pending"}
                  </dd>
                </div>
              </dl>
              <Link
                href="/shop/account/edit"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-[#F58220] underline-offset-4"
              >
                Edit your details
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </section>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Your orders",
                  text: "View your purchases and production requests.",
                  href: "/shop/order",
                },
                {
                  title: "Saved pieces",
                  text: "Return to the products in your wishlist.",
                  href: "/shop/wish-list",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between gap-5 rounded-xl border border-black/10 p-6 transition-colors hover:bg-[#F4F1E9]"
                >
                  <div>
                    <h2 className="text-base font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#625D55]">
                      {item.text}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-[#F58220]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
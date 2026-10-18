import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  ClipboardList,
  LogOut,
  Mail,
  MapPin,
  Settings,
  Store,
  UserRound,
} from "lucide-react";

import Header from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Account | NewJersey.ng",
  description:
    "Manage your NewJersey.ng orders, personal details and delivery address.",
};

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
  },
  {
    label: "My orders",
    href: "/shop/order",
    icon: ClipboardList,
  },
  {
    label: "Personal details",
    href: "/shop/account/edit",
    icon: Settings,
  },
  {
    label: "Delivery address",
    href: "/shop/account/address",
    icon: MapPin,
  },
  {
    label: "Back to shop",
    href: "/shop",
    icon: Store,
  },
];

const shortcuts = [
  {
    title: "My orders",
    description:
      "View order progress, payment instructions and updates.",
    href: "/shop/order",
    icon: ClipboardList,
  },
  {
    title: "Personal details",
    description:
      "Review and update your account information.",
    href: "/shop/account/edit",
    icon: Settings,
  },
  {
    title: "Delivery address",
    description:
      "Save or update the address you use for deliveries.",
    href: "/shop/account/address",
    icon: MapPin,
  },
];

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2";

export default async function AccountPage({
  searchParams,
}: Props) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
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
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] || "")
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <Header />
        </div>
      </header>

      <main className="mx-auto max-w-[1344px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8379]">
            NewJersey.ng / Your account
          </p>

          <h1 className="mt-3 break-words text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#625D55]">
            Manage your orders, personal details and delivery
            address.
          </p>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
          <aside className="min-w-0">
            <nav
              aria-label="Account navigation"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
            >
              {navigation.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/shop/account";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                      focus,
                      active
                        ? "bg-[#F0EFEB] font-semibold text-[#181818]"
                        : "text-[#625D55] hover:bg-[#F0EFEB]",
                    ].join(" ")}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.7}
                      aria-hidden="true"
                      className={
                        active ? "text-[#F58220]" : ""
                      }
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <form
              action={signOut}
              className="mt-4 border-t border-black/10 pt-3"
            >
              <button
                type="submit"
                className={`inline-flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm text-[#625D55] transition-colors hover:bg-[#F0EFEB] hover:text-[#181818] ${focus}`}
              >
                <LogOut
                  size={17}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                Sign out
              </button>
            </form>
          </aside>

          <div className="min-w-0">
            {params.error === "signout" && (
              <p
                role="alert"
                className="mb-5 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800"
              >
                Unable to sign out. Please try again.
              </p>
            )}

            <section
              aria-labelledby="account-details-title"
              className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
            >
              <div className="flex items-center gap-4 border-b border-black/10 pb-5">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#181818] text-sm font-semibold text-white"
                >
                  {initials}
                </span>

                <div className="min-w-0">
                  <h2
                    id="account-details-title"
                    className="text-lg font-semibold tracking-tight"
                  >
                    Account details
                  </h2>

                  <p className="mt-1 text-xs leading-6 text-[#625D55]">
                    Your registered name and email.
                  </p>
                </div>
              </div>

              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#7A7368]">
                    Full name
                  </dt>
                  <dd className="mt-2 break-words text-sm font-medium">
                    {fullName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#7A7368]">
                    Email address
                  </dt>
                  <dd className="mt-2 break-words text-sm font-medium">
                    {user.email || "Not provided"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#7A7368]">
                    Email status
                  </dt>
                  <dd className="mt-2">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                        user.email_confirmed_at
                          ? "bg-[#EDF3ED] text-[#426247]"
                          : "bg-amber-50 text-amber-800",
                      ].join(" ")}
                    >
                      {user.email_confirmed_at
                        ? "Confirmed"
                        : "Confirmation pending"}
                    </span>
                  </dd>
                </div>
              </dl>

              <Link
                href="/shop/account/edit"
                className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold underline underline-offset-4 ${focus}`}
              >
                Edit personal details
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                />
              </Link>
            </section>

            <section
              aria-labelledby="account-shortcuts-title"
              className="mt-7"
            >
              <h2
                id="account-shortcuts-title"
                className="mb-4 text-sm font-semibold"
              >
                Manage your account
              </h2>

              <div className="grid gap-3 sm:grid-cols-3">
                {shortcuts.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex min-w-0 flex-col rounded-xl border border-black/10 bg-white p-5 transition-colors hover:border-black/25 ${focus}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Icon
                          size={20}
                          strokeWidth={1.6}
                          aria-hidden="true"
                          className="text-[#625D55]"
                        />

                        <ArrowUpRight
                          size={15}
                          aria-hidden="true"
                          className="text-[#8A8379] transition-colors group-hover:text-[#F58220]"
                        />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-[#625D55]">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section
              aria-labelledby="account-support-title"
              className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center"
            >
              <div>
                <h2
                  id="account-support-title"
                  className="text-sm font-semibold"
                >
                  Need help with an order?
                </h2>

                <p className="mt-2 text-xs leading-6 text-[#625D55]">
                  Include your order reference when contacting us.
                </p>
              </div>

              <a
                href="mailto:hello@newjersey.ng"
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-black/15 px-4 text-xs font-semibold transition-colors hover:bg-[#F0EFEB] ${focus}`}
              >
                <Mail size={15} aria-hidden="true" />
                Contact support
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer showQuoteCTA={false} />
    </div>
  );
}
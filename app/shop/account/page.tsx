"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Header from "@/app/components/dashboard components/mainheader";
import Footer from "@/app/components/Footer";

import {
  UserRound,
  Package,
  Mail,
  Star,
  Ticket,
  Heart,
  Store,
  History,
  Pencil,
  Wallet,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Bell,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "My newjersey.ng Account",
    icon: UserRound,
    href: "/account",
    active: true,
  },
  {
    label: "Orders",
    icon: Package,
    href: "/account/orders",
  },
  {
    label: "Inbox",
    icon: Mail,
    href: "/account/inbox",
  },
  {
    label: "Pending Reviews",
    icon: Star,
    href: "/account/reviews",
  },
  {
    label: "Voucher",
    icon: Ticket,
    href: "/account/vouchers",
  },
  {
    label: "Wishlist",
    icon: Heart,
    href: "/account/wishlist",
  },
  {
    label: "Followed Sellers",
    icon: Store,
    href: "/account/followed-sellers",
  },
  {
    label: "Recently Viewed",
    icon: History,
    href: "/account/recently-viewed",
  },
];

export default function AccountPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#FF6B00]/30 text-neutral-900">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative z-50 w-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <Header />
      </div>

      {/* =====================================================
          ACCOUNT PAGE
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Breadcrumb */}

        <nav className="mb-5">
          <ol className="flex items-center gap-2 text-[11px] sm:text-xs">
            <li>
              <Link
                href="/"
                className="text-neutral-500 transition hover:text-[#f58220]"
              >
                Home
              </Link>
            </li>

            <ChevronRight
              size={13}
              className="text-neutral-400"
            />

            <li className="font-medium text-neutral-900">
              My Account
            </li>
          </ol>
        </nav>

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f58220]">
              My Account
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Manage your NewJersey.ng account, orders and preferences.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          {/* =====================================================
              SIDEBAR
          ====================================================== */}

          <aside className="w-full shrink-0 lg:w-[260px]">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
              <nav>
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`group flex items-center gap-3 border-b border-neutral-100 px-4 py-3 text-sm transition last:border-b-0 ${
                        link.active
                          ? "bg-[#fff5ed] font-semibold text-[#f58220]"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                          link.active
                            ? "bg-[#f58220] text-white"
                            : "bg-neutral-100 text-neutral-500 group-hover:bg-[#fff1e5] group-hover:text-[#f58220]"
                        }`}
                      >
                        <Icon size={16} strokeWidth={1.9} />
                      </span>

                      <span className="flex-1">
                        {link.label}
                      </span>

                      <ChevronRight
                        size={15}
                        className={`transition ${
                          link.active
                            ? "text-[#f58220]"
                            : "text-neutral-300 group-hover:text-neutral-500"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Account Management */}

              <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Account Management
                </p>
              </div>
            </div>
          </aside>

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <section className="min-w-0 flex-1">
            {loading ? (
              <AccountSkeleton />
            ) : (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
              >
                {/* Account Header */}

                <div className="border-b border-neutral-100 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1e5] text-[#f58220]">
                        <UserRound size={22} />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-neutral-900">
                          Account Overview
                        </h2>

                        <p className="mt-0.5 text-xs text-neutral-500">
                          Your personal NewJersey.ng account information.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/account/edit"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 transition hover:border-[#f58220] hover:bg-[#fff5ed] hover:text-[#f58220]"
                    >
                      <Pencil size={14} />
                      Edit profile
                    </Link>
                  </div>
                </div>

                {/* =====================================================
                    ACCOUNT CARDS
                ====================================================== */}

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                  {/* Account Details */}

                  <AccountCard
                    icon={
                      <UserRound
                        size={17}
                      />
                    }
                    title="Account Details"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-neutral-900">
                        Adeshina Adedokun
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        shinordaddie@gmail.com
                      </p>

                      <Link
                        href="/account/edit"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#f58220] transition hover:text-[#e87512]"
                      >
                        Edit account details
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </AccountCard>

                  {/* Address Book */}

                  <AccountCard
                    icon={
                      <MapPin
                        size={17}
                      />
                    }
                    title="Address Book"
                    action={
                      <Link
                        href="/account/address"
                        className="text-[#f58220] transition hover:text-[#e87512]"
                        aria-label="Edit address"
                      >
                        <Pencil size={15} />
                      </Link>
                    }
                  >
                    <div>
                      <p className="mb-2 text-xs font-medium text-neutral-700">
                        Default shipping address
                      </p>

                      <p className="text-sm leading-relaxed text-neutral-500">
                        Adeshina Adedokun
                        <br />
                        ABAELA-ILETUNTUN
                        <br />
                        IBADAN-ELEYELE, Oyo
                        <br />
                        +234 9167740076
                      </p>
                    </div>
                  </AccountCard>

                  {/* Store Credit */}

                  <AccountCard
                    icon={
                      <Wallet
                        size={17}
                      />
                    }
                    title="newjersey.ng Store Credit"
                  >
                    <Link
                      href="/account/store-credit"
                      className="group flex items-center justify-between rounded-xl bg-[#fff8f2] p-3 transition hover:bg-[#fff1e5]"
                    >
                      <div>
                        <p className="text-xs text-neutral-500">
                          Available balance
                        </p>

                        <p className="mt-1 text-lg font-bold text-neutral-900">
                          ₦0.00
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-[#f58220] transition group-hover:translate-x-0.5"
                      />
                    </Link>
                  </AccountCard>

                  {/* Newsletter */}

                  <AccountCard
                    icon={
                      <Bell
                        size={17}
                      />
                    }
                    title="Newsletter Preferences"
                  >
                    <div>
                      <p className="text-sm leading-relaxed text-neutral-500">
                        Manage your email preferences and choose the updates
                        and offers you would like to receive.
                      </p>

                      <Link
                        href="/account/newsletter"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#f58220] transition hover:text-[#e87512]"
                      >
                        Manage preferences
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </AccountCard>

                  {/* Account Security */}

                  <AccountCard
                    icon={
                      <ShieldCheck
                        size={17}
                      />
                    }
                    title="Account Security"
                  >
                    <div>
                      <p className="text-sm leading-relaxed text-neutral-500">
                        Keep your NewJersey.ng account secure by managing your
                        password and account security settings.
                      </p>

                      <Link
                        href="/account/security"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#f58220] transition hover:text-[#e87512]"
                      >
                        Security settings
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </AccountCard>

                  {/* Quick Account Info */}

                  <AccountCard
                    icon={
                      <Mail
                        size={17}
                      />
                    }
                    title="Communication"
                  >
                    <div>
                      <p className="text-sm leading-relaxed text-neutral-500">
                        Your account email is active and ready to receive
                        important updates about your NewJersey.ng activity.
                      </p>

                      <Link
                        href="/account/inbox"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#f58220] transition hover:text-[#e87512]"
                      >
                        View inbox
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </AccountCard>
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

/* =========================================================
   ACCOUNT CARD
========================================================= */

function AccountCard({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-[#f58220]/30 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]">
      {/* Card Header */}

      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#fff1e5] text-[#f58220]">
            {icon}
          </div>

          <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-500">
            {title}
          </h3>
        </div>

        {action}
      </div>

      {/* Card Content */}

      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function AccountSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] sm:p-6">
      <div className="mb-6 flex items-center gap-3 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-neutral-100" />

        <div className="space-y-2">
          <div className="h-5 w-40 rounded-full bg-neutral-100" />
          <div className="h-3 w-56 rounded-full bg-neutral-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-neutral-100"
          >
            <div className="flex items-center gap-2 border-b border-neutral-100 p-4">
              <div className="h-7 w-7 rounded-md bg-neutral-100" />

              <div className="h-3 w-32 rounded-full bg-neutral-100" />
            </div>

            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded-full bg-neutral-100" />

              <div className="h-3 w-full rounded-full bg-neutral-100" />

              <div className="h-3 w-2/3 rounded-full bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
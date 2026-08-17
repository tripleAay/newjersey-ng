// app/web-service/page.tsx
"use client";

import Link from "next/link";
import { motion, type Variants, type MotionProps } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  MonitorSmartphone,
  LayoutDashboard,
  CalendarClock,
  ShoppingBag,
  Building2,
  Sparkles,
} from "lucide-react";

/**
 * Simple fade-in-up helper for individual blocks
 */
const fadeInUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

/**
 * Parent container with staggered children
 */
const staggerParent: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/**
 * Card animation for grid items
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function WebServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 text-neutral-50">
      {/* ===== HEADER ===== */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-neutral-800/70 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 text-xs font-bold text-neutral-950">
              F
            </div>
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              Fynaro
            </span>
          </Link>

          {/* Simple nav */}
          <nav className="hidden items-center gap-6 text-xs text-neutral-400 sm:flex">
            <Link href="/web-service" className="text-neutral-100">
              Web Services
            </Link>
            <Link
              href="/shop"
              className="hover:text-neutral-100 transition-colors"
            >
              Store
            </Link>
            <Link
              href="/order"
              className="hover:text-neutral-100 transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-neutral-700 px-3 py-1.5 text-[11px] hover:border-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              Talk to us
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-8 sm:pt-28">
        {/* =========================
         * 1️⃣ HERO
         * ========================= */}
        <section className="mb-14 sm:mb-16">
          <motion.div
            {...fadeInUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1 text-[11px] text-neutral-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Web Studio • Design + Build
          </motion.div>

          <motion.div
            {...fadeInUp(0.08)}
            className="mt-4 max-w-3xl space-y-3 sm:space-y-4"
          >
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-[34px]">
              Web experiences that feel{" "}
              <span className="bg-gradient-to-r from-neutral-50 via-emerald-200 to-amber-200 bg-clip-text text-transparent">
                expensive
              </span>{" "}
              — even when they weren’t.
            </h1>
            <p className="max-w-xl text-sm text-neutral-300 sm:text-base">
              Landing pages, dashboards, booking flows and full product builds —
              delivered quietly, on time, and without drama.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            {...fadeInUp(0.16)}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Link
              href="#start-project"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-medium text-neutral-950 shadow-[0_18px_40px_rgba(0,0,0,0.8)] hover:bg-white transition-colors"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#recent-work"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2 text-xs font-medium text-neutral-100 hover:border-neutral-100 hover:bg-neutral-900 transition-colors sm:text-sm"
            >
              View recent work
            </Link>
          </motion.div>
        </section>

        {/* =========================
         * 2️⃣ WHAT WE BUILD
         * ========================= */}
        <motion.section
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 rounded-3xl border border-neutral-800 bg-neutral-950/70 p-4 sm:p-6"
        >
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-50 sm:text-base">
                What we build
              </h2>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                From one focused launch page to full-blown products.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Landing Pages",
                desc: "For campaigns, launches and new offers.",
                icon: <MonitorSmartphone className="h-4 w-4" />,
              },
              {
                title: "SaaS Dashboards",
                desc: "Clean, modern product UI that looks like you mean business.",
                icon: <LayoutDashboard className="h-4 w-4" />,
              },
              {
                title: "Booking & Scheduling Systems",
                desc: "Customers book, pay, and track their projects effortlessly.",
                icon: <CalendarClock className="h-4 w-4" />,
              },
              {
                title: "eCommerce & Digital Stores",
                desc: "From 1 product to 10,000 — smooth shopping flows.",
                icon: <ShoppingBag className="h-4 w-4" />,
              },
              {
                title: "Business Websites",
                desc: "Corporate, portfolio, service-driven or personal.",
                icon: <Building2 className="h-4 w-4" />,
              },
              {
                title: "Custom Web Platforms",
                desc: "If it runs on the web — we can design it.",
                icon: <Sparkles className="h-4 w-4" />,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="group flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/70 p-3.5 sm:p-4 hover:border-neutral-100/70 hover:bg-neutral-900/90 transition-all"
              >
                <div className="mb-2 flex items-center gap-2 text-xs text-neutral-200 sm:text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-neutral-100">
                    {item.icon}
                  </div>
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <p className="text-[11px] text-neutral-400 sm:text-xs">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* =========================
         * 3️⃣ WHY FYNARO
         * ========================= */}
        <motion.section
          {...fadeInUp(0.1)}
          className="mb-14 grid gap-6 rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-900/90 p-4 sm:grid-cols-[1.1fr_minmax(0,1fr)] sm:p-6"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              Why Fynaro
            </p>
            <h2 className="mt-1 text-sm font-semibold sm:text-base">
              Quiet studio. Loud output.
            </h2>
            <p className="mt-2 text-xs text-neutral-400 sm:text-sm">
              We treat every project like it&apos;s the one you&apos;ll be
              judged by — because it is.
            </p>
          </div>

          <div className="space-y-3 text-xs text-neutral-200 sm:text-sm">
            <div className="flex gap-2">
              <span className="mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </span>
              <div>
                <p className="font-medium">No noise. Just execution.</p>
                <p className="text-neutral-400">
                  We don’t drown you in meetings. You share the requirements; we
                  handle the rest.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </span>
              <div>
                <p className="font-medium">Design that earns respect.</p>
                <p className="text-neutral-400">
                  Clean, minimal, bold — the kind of UI that says “This brand is
                  serious.”
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </span>
              <div>
                <p className="font-medium">Fast turnaround, high discipline.</p>
                <p className="text-neutral-400">
                  We work quietly but deliver loudly.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </span>
              <div>
                <p className="font-medium">Full-stack delivery.</p>
                <p className="text-neutral-400">
                  Strategy → UI/UX → Development → Deployment.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =========================
         * 4️⃣ HOW IT WORKS
         * ========================= */}
        <motion.section
          {...fadeInUp(0.05)}
          className="mb-14 rounded-3xl border border-neutral-800 bg-neutral-950/80 p-4 sm:p-6"
        >
          <div className="mb-5 flex items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold sm:text-base">
                How it works
              </h2>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                Four steps. No chaos.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              {
                step: 1,
                title: "You submit your brief",
                body: "Tell us what you want — or we can define it for you.",
              },
              {
                step: 2,
                title: "We scope & agree pricing",
                body: "Clear cost. No surprise billing. Ever.",
              },
              {
                step: 3,
                title: "Build begins",
                body: "Regular progress updates. No stress.",
              },
              {
                step: 4,
                title: "Launch & support",
                body: "Your product goes live — refined and ready to make money.",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                {...fadeInUp(0.05 + idx * 0.05)}
                className="relative rounded-2xl border border-neutral-800 bg-neutral-900/70 p-3.5 sm:p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-950">
                    {item.step}
                  </span>
                </div>
                <p className="text-xs font-medium text-neutral-50 sm:text-sm">
                  {item.title}
                </p>
                <p className="mt-1 text-[11px] text-neutral-400 sm:text-xs">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* =========================
         * 5️⃣ PACKAGES
         * ========================= */}
        <motion.section
          id="start-project"
          {...fadeInUp(0.05)}
          className="mb-14 rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 sm:p-6"
        >
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold sm:text-base">
                Packages that scale with your ambition
              </h2>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                Choose what matches your current move. We can always extend.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Starter
              </p>
              <h3 className="mt-1 text-sm font-semibold sm:text-base">
                For small but serious projects
              </h3>
              <ul className="mt-3 space-y-1.5 text-[11px] text-neutral-300 sm:text-xs">
                <li>• Landing page or simple website</li>
                <li>• 3–5 sections</li>
                <li>• Mobile optimized</li>
                <li>• Delivery: 5–10 days</li>
              </ul>
            </div>

            {/* Growth */}
            <div className="relative rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-neutral-950/90 to-neutral-950/90 p-4 shadow-[0_18px_45px_rgba(16,185,129,0.35)] sm:p-5">
              <span className="absolute right-4 top-4 rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-200 border border-emerald-400/40">
                Most picked
              </span>
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/80">
                Growth
              </p>
              <h3 className="mt-1 text-sm font-semibold sm:text-base">
                For businesses that want presence & results
              </h3>
              <ul className="mt-3 space-y-1.5 text-[11px] text-neutral-200 sm:text-xs">
                <li>• Websites, dashboards or booking flows</li>
                <li>• Custom design</li>
                <li>• Full development</li>
                <li>• CMS included</li>
              </ul>
            </div>

            {/* Elite */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Elite
              </p>
              <h3 className="mt-1 text-sm font-semibold sm:text-base">
                Full digital build
              </h3>
              <ul className="mt-3 space-y-1.5 text-[11px] text-neutral-300 sm:text-xs">
                <li>• Products, SaaS, platforms</li>
                <li>• Web app architecture</li>
                <li>• Advanced logic</li>
                <li>• Launch & rollout planning</li>
              </ul>
            </div>
          </div>

          {/* Package CTAs */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">
            <Link
              href="/contact?type=quote"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-5 py-2 font-medium text-neutral-950 hover:bg-white transition-colors"
            >
              👉 Request a quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-600 px-5 py-2 font-medium text-neutral-100 hover:border-neutral-100 hover:bg-neutral-900 transition-colors"
            >
              👉 Ask questions
            </Link>
          </div>
        </motion.section>

        {/* =========================
         * 6️⃣ WORK SHOWCASE
         * ========================= */}
        <motion.section
          id="recent-work"
          {...fadeInUp(0.05)}
          className="mb-14 rounded-3xl border border-neutral-800 bg-neutral-950/80 p-4 sm:p-6"
        >
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold sm:text-base">
                Work showcase
              </h2>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                Even internal builds count — what matters is execution.
              </p>
            </div>
            <p className="text-[11px] text-neutral-500 sm:text-xs">
              These can start as concept pieces and evolve into real products.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Booking Dashboard for Auto Service Brand",
                tag: "Booking & Scheduling",
                body: "A clean dashboard for customers to book, pay and track vehicle service without calling anyone.",
              },
              {
                title: "Minimal Landing Page for a Financial Startup",
                tag: "Landing Page",
                body: "Sharp copy, confident layout and a frictionless lead form for a fintech testing new markets.",
              },
              {
                title: "SaaS Dashboard for Fleet Analysis",
                tag: "SaaS UI",
                body: "A dense data view, simplified into a readable interface for operations teams and executives.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden"
              >
                {/* Fake image / preview block */}
                <div className="relative h-32 w-full bg-gradient-to-tr from-neutral-900 via-emerald-900/30 to-amber-900/40">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16)_0,_transparent_56%)] opacity-70" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] text-neutral-100">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/40 border border-white/10">
                      <MonitorSmartphone className="h-3.5 w-3.5" />
                    </span>
                    <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px]">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
                  <h3 className="text-sm font-medium text-neutral-50">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-neutral-400 sm:text-xs">
                    {item.body}
                  </p>
                  <button className="mt-3 inline-flex w-fit items-center gap-1 text-[11px] text-neutral-300 hover:text-neutral-100 transition-colors">
                    See the thinking behind this
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* =========================
         * 7️⃣ STANDING GUARANTEES
         * ========================= */}
        <motion.section
          {...fadeInUp(0.05)}
          className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-4 sm:p-6"
        >
          <div className="mb-4">
            <h2 className="text-sm font-semibold sm:text-base">
              Standing guarantees
            </h2>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Premium promises you can actually hold us to.
            </p>
          </div>

          <div className="grid gap-3 text-[11px] text-neutral-200 sm:grid-cols-2 sm:text-xs">
            {[
              "Clear timelines",
              "Transparent pricing",
              "Clean revisions",
              "No chaotic communication",
              "Delivery that makes your brand look bigger",
            ].map((line) => (
              <div key={line} className="flex items-start gap-2">
                <CheckCircle2 className="mt-[2px] h-3.5 w-3.5 text-emerald-400" />
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs sm:text-sm">
            <Link
              href="/contact?type=web-project"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-5 py-2 font-medium text-neutral-950 hover:bg-white transition-colors"
            >
              Start a web project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-600 px-5 py-2 font-medium text-neutral-100 hover:border-neutral-100 hover:bg-neutral-900 transition-colors"
            >
              Ask us anything first
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

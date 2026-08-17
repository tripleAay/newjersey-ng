"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

type HowItWorksSectionProps = {
  isLoading: boolean;
};

export default function HowItWorksSection({ isLoading }: HowItWorksSectionProps) {
  const router = useRouter();
  const [activePath, setActivePath] = useState<string | null>(null);

  const steps = [
    {
      icon: "🛒",
      title: "Browse Products",
      desc: "Explore curated web, print and brand solutions tailored to how you operate.",
      href: "/shop",
      cta: "Start browsing",
    },
    {
      icon: "➕",
      title: "Add to Wishlist",
      desc: "Shortlist what fits your next move and keep everything in one place.",
      href: "/shop/wish-list",
      cta: "Open wishlist",
    },
    {
      icon: "📦",
      title: "Delivery / Access",
      desc: "We deliver print, assets or live links with clean documentation.",
      href: "/shop/order", // adjust if your orders/track route is different
      cta: "View orders",
    },
  ];

  const handleNavigate = (href: string) => {
    // avoid double-clicks
    if (activePath) return;
    setActivePath(href);
    router.push(href);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-10">
      {isLoading ? (
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-6 w-48 bg-neutral-800/80 rounded-full mx-auto mb-8" />
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/80 rounded-2xl border border-neutral-800/80 p-6 sm:p-7"
              >
                <div className="h-10 w-10 bg-neutral-800/80 rounded-full mb-3 mx-auto" />
                <div className="h-4 w-28 bg-neutral-800/80 rounded-full mb-2 mx-auto" />
                <div className="h-3 w-40 bg-neutral-800/70 rounded-full mb-1.5 mx-auto" />
                <div className="h-3 w-36 bg-neutral-800/60 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 text-center mx-auto max-w-5xl">
            {steps.map((step, idx) => {
              const isActive = activePath === step.href;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="bg-white text-neutral-900 rounded-2xl shadow-lg/60 p-6 sm:p-7 flex flex-col items-center"
                >
                  <span className="text-4xl mb-3">{step.icon}</span>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mb-4">
                    {step.desc}
                  </p>

                  {/* CTA button with smooth loader */}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => handleNavigate(step.href)}
                    disabled={!!activePath}
                    className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium
                      transition-all ${
                        isActive
                          ? "bg-neutral-900 text-white cursor-wait"
                          : "bg-neutral-900 text-white hover:bg-neutral-800"
                      }`}
                  >
                    {isActive ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Opening…</span>
                      </>
                    ) : (
                      <span>{step.cta}</span>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

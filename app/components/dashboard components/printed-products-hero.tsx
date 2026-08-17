"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Package, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";

function useTypewriter(text: string, speed = 28, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let interval: NodeJS.Timeout | null = null;

    setDisplayed("");

    timeout = setTimeout(() => {
      let index = 0;

      interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length && interval) {
          clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return displayed;
}

export default function PrintedProductsHero() {
  const titleText =
    "Printed products that make your brand feel real, refined, and impossible to ignore.";

  const bodyText =
    "From packaging and business cards to branded merchandise and rollout materials, this is where identity leaves the screen and enters the real world beautifully.";

  const typedTitle = useTypewriter(titleText, 20, 300);
  const typedBody = useTypewriter(bodyText, 16, 1700);

  const titleDone = typedTitle.length === titleText.length;
  const bodyReady = typedTitle.length > Math.floor(titleText.length * 0.55);

  return (
    <section className="relative overflow-hidden px-4 pb-6 pt-6 sm:px-6 md:px-8 md:pb-8 md:pt-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-white/10 bg-[#0b0b0d] shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:rounded-[36px]">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/tote-bag.jpg"
            alt="Printed products hero background"
            fill
            priority
            className="object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/62 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,204,109,0.18),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(214,204,109,0.10),transparent_32%)]" />
        </div>

        {/* subtle framing */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/10" />

        <div className="relative grid min-h-[520px] grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left content */}
          <div className="flex items-center px-5 py-10 sm:px-8 md:px-10 lg:px-12 lg:py-14">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#d6cc6d]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                  Printed Products
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.08, ease: "easeOut" }}
                className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-4xl md:text-5xl lg:text-[3.6rem]"
              >
                {typedTitle}
                {!titleDone && (
                  <span className="ml-1 inline-block h-[1em] w-[1px] translate-y-[3px] animate-pulse bg-[#d6cc6d]" />
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: bodyReady ? 1 : 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-[15px]"
              >
                {typedBody}
                {bodyReady && typedBody.length < bodyText.length && (
                  <span className="ml-1 inline-block h-[1em] w-[1px] translate-y-[3px] animate-pulse bg-white/70" />
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: bodyReady ? 1 : 0, y: bodyReady ? 0 : 18 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/shop/printed-products"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#d6cc6d] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Explore printed products
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-white/88 backdrop-blur-md transition hover:border-white/22 hover:bg-white/10"
                >
                  Request custom print work
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: bodyReady ? 1 : 0, y: bodyReady ? 0 : 18 }}
                transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
                className="mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {[
                  {
                    icon: <Package className="h-4 w-4" />,
                    title: "Packaging",
                    text: "Boxes, wraps, inserts and branded presentation.",
                  },
                  {
                    icon: <BadgeCheck className="h-4 w-4" />,
                    title: "Brand Collateral",
                    text: "Business cards, flyers, tags and premium print assets.",
                  },
                  {
                    icon: <Sparkles className="h-4 w-4" />,
                    title: "Merch & Rollout",
                    text: "Branded materials made to travel into the real world well.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md"
                  >
                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d6cc6d]/12 text-[#d6cc6d]">
                      {item.icon}
                    </div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/62">{item.text}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right visual panel */}
          <div className="relative hidden lg:flex">
            <div className="absolute inset-y-0 left-0 w-px bg-white/10" />

            <div className="relative flex w-full items-end justify-end p-6 xl:p-8">
              <motion.div
                initial={{ opacity: 0, x: 26, y: 18 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-[420px]"
              >
                <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-[#d6cc6d]/12 blur-2xl xl:block" />
                <div className="absolute -right-8 bottom-2 hidden h-28 w-28 rounded-full bg-[#d6cc6d]/10 blur-2xl xl:block" />

                <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                  <div className="overflow-hidden rounded-[22px] border border-white/10">
                    <Image
                      src="/images/jon-tyson-VHTjeOjHS9c-unsplash (1).jpg"
                      alt="Printed products showcase"
                      width={760}
                      height={860}
                      className="h-[420px] w-full object-cover"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                        Craft
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        Tangible brand presence
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                        Finish
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        Premium feel, real-world impact
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Globe, Layers3 } from "lucide-react";
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

export default function WebServicesHero() {
  const titleText =
    "Web experiences that feel premium, convert better, and represent your brand properly.";

  const bodyText =
    "From landing pages to full brand websites, this is where design, clarity, and execution come together for businesses that want more than something ordinary.";

  const typedTitle = useTypewriter(titleText, 20, 300);
  const typedBody = useTypewriter(bodyText, 16, 1700);

  const titleDone = typedTitle.length === titleText.length;
  const bodyReady = typedTitle.length > Math.floor(titleText.length * 0.55);

  return (
    <section className="relative overflow-hidden px-4 pb-6 pt-6 sm:px-6 md:px-8 md:pb-8 md:pt-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-white/10 bg-[#0b0b0d] shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:rounded-[36px]">
        {/* background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/edoardo-giudici-saraval-h-EmytKmWYc-unsplash.jpg"
            alt="Web services hero background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,204,109,0.18),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(214,204,109,0.12),transparent_28%)]" />
        </div>

        {/* soft accents */}
        <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#d6cc6d]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

        <div className="relative grid gap-8 px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-14 lg:px-12">
          {/* left */}
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#d6cc6d]/25 bg-[#d6cc6d]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#eadb97]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Web Services
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-[2.8rem]"
            >
              {typedTitle}
              <span
                className={`ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#d6cc6d] ${
                  titleDone ? "animate-pulse" : "animate-pulse"
                }`}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: bodyReady ? 1 : 0, y: bodyReady ? 0 : 18 }}
              transition={{ duration: 0.45 }}
              className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base min-h-[84px]"
            >
              {typedBody}
              {bodyReady ? (
                <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] bg-white/60 animate-pulse" />
              ) : null}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: typedBody.length > bodyText.length * 0.35 ? 1 : 0, y: typedBody.length > bodyText.length * 0.35 ? 0 : 18 }}
              transition={{ duration: 0.55 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#d6cc6d] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-105"
              >
                Explore Services
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition hover:border-[#d6cc6d]/35 hover:bg-white/[0.07]"
              >
                Start a Project
              </Link>
            </motion.div>
          </div>

          {/* right */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: bodyReady ? 1 : 0, y: bodyReady ? 0 : 22 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="flex items-end"
          >
            <div className="grid w-full gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: bodyReady ? 1 : 0, y: bodyReady ? 0 : 18 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d6cc6d]/12 text-[#d6cc6d]">
                  <Globe className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-white">Modern websites</p>
                <p className="mt-1 text-xs leading-6 text-white/55">
                  Clean, responsive, and built to elevate trust.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: typedBody.length > bodyText.length * 0.55 ? 1 : 0, y: typedBody.length > bodyText.length * 0.55 ? 0 : 18 }}
                transition={{ duration: 0.45 }}
                className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d6cc6d]/12 text-[#d6cc6d]">
                  <Layers3 className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-white">Brand-led layout</p>
                <p className="mt-1 text-xs leading-6 text-white/55">
                  Pages that look intentional, not random.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: typedBody.length > bodyText.length * 0.8 ? 1 : 0, y: typedBody.length > bodyText.length * 0.8 ? 0 : 18 }}
                transition={{ duration: 0.45 }}
                className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d6cc6d]/12 text-[#d6cc6d]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-white">Premium finish</p>
                <p className="mt-1 text-xs leading-6 text-white/55">
                  Built for brands that want to stand above average.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
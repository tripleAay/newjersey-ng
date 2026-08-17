"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DashboardHero() {
  const [visible, setVisible] = useState(true);
  const [isJourneying, setIsJourneying] = useState(false);

  const handleBeginJourney = () => {
    if (isJourneying) return;
    setIsJourneying(true);

    setTimeout(() => {
      setVisible(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          key="hero"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.12, filter: "blur(10px)" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="relative mx-6 mt-20 h-[250px] overflow-hidden rounded-3xl text-[#111014] sm:h-[290px] md:h-[330px]"
          style={{
            backgroundImage: "url('/images/v2osk--LRuNvY8W7Q-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[6px]" />

          {/* Ambient shapes */}
          <div className="absolute left-0 top-0 h-56 w-56 -translate-x-1/3 -translate-y-1/3 rounded-full bg-[#111014]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-[#111014]/15 blur-3xl" />

          {/* Main content */}
          <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 py-6 text-center sm:py-8 md:py-10">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-[34px]"
            >
              Welcome to Your{" "}
              <span className="text-[#111014]/90">Creative Hub</span>
            </motion.h1>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="mx-auto mt-3 mb-6 max-w-xl text-sm text-neutral-700 sm:text-base"
            >
              Track your orders, manage requests and access everything in one
              space.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
              className="mt-[34px] flex justify-center"
            >
              <motion.button
                whileHover={!isJourneying ? { scale: 1.04, y: -1 } : {}}
                whileTap={!isJourneying ? { scale: 0.97 } : {}}
                onClick={handleBeginJourney}
                disabled={isJourneying}
                className="relative inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-[#111014] px-8 py-3 text-sm font-medium tracking-tight text-white shadow-[0_12px_30px_rgba(17,16,20,0.22)] transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-80 sm:min-w-[240px] sm:px-9 sm:py-3.5 sm:text-base"
              >
                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />

                <AnimatePresence mode="wait" initial={false}>
                  {isJourneying ? (
                    <motion.span
                      key="spinner"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white sm:h-5 sm:w-5"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          ease: "linear",
                        }}
                      />
                      <span className="text-xs sm:text-sm">
                        Preparing your space...
                      </span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      Begin Your Journey
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
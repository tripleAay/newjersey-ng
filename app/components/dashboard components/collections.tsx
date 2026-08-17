"use client";

import React, { useEffect, useState } from "react";
import Dashhead from "../../components/dashboard components/dashNav";
import ProductTileGrid from "../../components/dashboard components/productTile";
import { motion } from "framer-motion";

export default function Collections() {
  // 🔤 Typing / deleting animation state for subtitle
  const fullText = "Explore your print & design product catalog";
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [phase, setPhase] = useState<"typing" | "idle" | "deleting">("typing");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayedSubtitle.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedSubtitle(fullText.slice(0, displayedSubtitle.length + 1));
        }, 60); // typing speed
      } else {
        // Fully typed → chill for 3 mins, then start deleting
        setPhase("idle");
        timeout = setTimeout(() => setPhase("deleting"), 180000); // 3 minutes
      }
    } else if (phase === "deleting") {
      if (displayedSubtitle.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedSubtitle(fullText.slice(0, displayedSubtitle.length - 1));
        }, 40); // delete speed
      } else {
        // erased → start typing again
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedSubtitle, phase, fullText]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#000000] font-inter text-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden mt-10">
      {/* Sidebar - Dashboard Navigation */}
      <aside className="hidden lg:block w-1/4 flex-shrink-0 border-r border-gray-100 bg-[#000000] p-6">
        <Dashhead />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-10">
        {/* Header */}
        <header className="border-b border-gray-800 pb-5">
          <div className="relative inline-block">
            <motion.h2
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.65,
                ease: [0.25, 1, 0.35, 1],
              }}
              className="text-3xl font-bold text-white"
            >
              Fynaro Collections
            </motion.h2>

            {/* Golden animated underline */}
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
              className="absolute left-0 -bottom-1 h-[3px] bg-gradient-to-r from-[#F5B400] via-[#fcd98e] to-transparent rounded-full"
            />
          </div>

          {/* Animated subtitle: type → pause → erase → loop */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white mt-2 flex items-center gap-[3px]"
          >
            <span>{displayedSubtitle}</span>
            {/* soft cursor */}
            <motion.span
              className="inline-block w-[2px] h-[1em] bg-white/70"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.p>
        </header>

        {/* Product Catalog */}
        <section className="  shadow-sm">
          <ProductTileGrid />
        </section>
      </main>
    </div>
  );
}

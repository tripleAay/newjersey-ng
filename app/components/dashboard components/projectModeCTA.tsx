"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function ProjectModeCTA() {
  const fullText = "Ready when you are.";
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "idle" | "deleting" | "waiting">("waiting");

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Detect when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // Typing animation
  useEffect(() => {
    if (!visible || phase === "waiting") return;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (phase === "typing") {
      if (displayed.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayed(fullText.slice(0, displayed.length + 1));
        }, 80);
      } else {
        setPhase("idle");
        timeout = setTimeout(() => setPhase("deleting"), 180000);
      }
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(fullText.slice(0, displayed.length - 1));
        }, 50);
      } else {
        setPhase("typing");
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayed, phase, visible, fullText]);

  // Start typing once visible
  useEffect(() => {
    if (visible && phase === "waiting") {
      setPhase("typing");
    }
  }, [visible, phase]);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-5 bg-black text-white border-t border-neutral-900"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center space-y-5"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-50 flex items-center justify-center gap-1">
          <span>{displayed}</span>
          <motion.span
            className="inline-block w-[2px] h-6 sm:h-7 bg-neutral-500"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        </h2>

        <p className="text-sm sm:text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
          When it&apos;s time, submit your project and we handle everything quietly, cleanly and professionally.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/shop/requests/new"
            className="inline-flex items-center justify-center rounded-full bg-white text-black px-10 py-3 text-sm font-medium tracking-tight hover:bg-neutral-200 transition-colors"
          >
            Create project request
          </Link>
        </motion.div>

        <p className="text-[11px] text-neutral-600 mt-4">
          No pressure. No rush. When you&apos;re ready.
        </p>

        <p className="text-[10px] text-neutral-700 mt-1">
          Pricing and full details will be shared once your proposal is received.
        </p>
      </motion.div>
    </section>
  );
}

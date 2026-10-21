"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function PageScrollControls() {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      setCanScrollUp(scrollTop > 80);
      setCanScrollDown(maxScroll - scrollTop > 80);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(document.body);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const scrollTo = (destination: "top" | "bottom") => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top:
        destination === "top"
          ? 0
          : document.documentElement.scrollHeight,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  if (!canScrollUp && !canScrollDown) return null;

  const buttonClass =
    "flex h-11 w-11 items-center justify-center rounded-full " +
    "text-[#242424] transition duration-200 " +
    "hover:bg-[#181818] hover:text-white " +
    "focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[#968e68] focus-visible:ring-offset-2 " +
    "disabled:cursor-default disabled:opacity-25 " +
    "disabled:hover:bg-transparent disabled:hover:text-[#242424] " +
    "motion-reduce:transition-none";

  return (
    <nav
      aria-label="Page scroll controls"
      className="fixed right-4 z-40 sm:right-6 lg:right-8"
      style={{
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex flex-col items-center gap-1 rounded-full border border-black/[0.08] bg-white/95 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => scrollTo("top")}
          disabled={!canScrollUp}
          aria-label="Scroll to top"
          title="Back to top"
          className={buttonClass}
        >
          <ArrowUp
            aria-hidden="true"
            className="h-[18px] w-[18px]"
            strokeWidth={1.7}
          />
        </button>

        <span
          aria-hidden="true"
          className="h-px w-5 bg-black/[0.08]"
        />

        <button
          type="button"
          onClick={() => scrollTo("bottom")}
          disabled={!canScrollDown}
          aria-label="Scroll to bottom"
          title="Go to bottom"
          className={buttonClass}
        >
          <ArrowDown
            aria-hidden="true"
            className="h-[18px] w-[18px]"
            strokeWidth={1.7}
          />
        </button>
      </div>
    </nav>
  );
}
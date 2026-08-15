"use client";

import { useEffect, useRef, useState } from "react";

export default function TopBar() {
  const items = [
    "Custom Printing",
    "Branding",
    "Apparel",
    "Merchandise",
    "Nationwide Delivery",
  ];

  const marqueeItems = [...items, ...items];

  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const animate = () => {
      if (!isPaused) {
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }

        container.scrollLeft += 0.35;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  const handleClick = (item: string) => {
    setActiveItem(item);

    window.setTimeout(() => {
      setActiveItem(null);
    }, 380);
  };

  return (
    <div className="relative h-9 overflow-hidden bg-black text-white">
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-10 bg-gradient-to-r from-black via-black/80 to-transparent sm:w-16" />

      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-10 bg-gradient-to-l from-black via-black/80 to-transparent sm:w-16" />

      {/* =========================================================
          DESKTOP
      ========================================================= */}
      <div className="mx-auto hidden h-full max-w-7xl items-center justify-center px-6 md:flex">
        <div className="flex items-center gap-4 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] lg:text-[11px]">
          {items.map((item, index) => (
            <div key={item} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleClick(item)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className={`
                  group relative select-none
                  rounded-full px-2 py-1
                  text-white/70
                  transition-all duration-300
                  ease-out
                  hover:bg-white/[0.04]
                  hover:text-white
                  hover:-translate-y-[1px]
                  active:scale-90
                  active:translate-y-[1px]
                  ${
                    activeItem === item
                      ? "scale-90 bg-[#FF6B00]/15 text-[#FF6B00]"
                      : ""
                  }
                `}
              >
                {/* subtle hover glow */}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-[#FF6B00]/0 blur-md transition duration-300 group-hover:bg-[#FF6B00]/10" />

                <span className="relative">
                  {item}
                </span>
              </button>

              {index !== items.length - 1 && (
                <span className="select-none text-[8px] text-[#FF6B00] transition-transform duration-300 hover:scale-125">
                  •
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          MOBILE MARQUEE
      ========================================================= */}
      <div
        ref={scrollRef}
        className="flex h-full items-center overflow-hidden whitespace-nowrap md:hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          window.setTimeout(() => setIsPaused(false), 700);
        }}
      >
        <div className="flex shrink-0 items-center">
          {marqueeItems.map((item, index) => (
            <button
              key={`${item}-${index}`}
              type="button"
              onClick={() => handleClick(item)}
              className={`
                group relative flex shrink-0 items-center gap-4
                px-3
                text-[9px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-white/70
                transition-all
                duration-300
                active:scale-90
                ${
                  activeItem === item
                    ? "text-[#FF6B00]"
                    : "hover:text-white"
                }
              `}
            >
              <span className="relative">
                {item}
              </span>

              <span className="text-[7px] text-[#FF6B00] transition-transform duration-300 group-hover:scale-125">
                •
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom micro-highlight */}
      <div
        className={`
          pointer-events-none absolute bottom-0 left-1/2 h-px
          -translate-x-1/2
          bg-[#FF6B00]
          transition-all duration-500
          ${
            activeItem
              ? "w-24 opacity-100"
              : "w-0 opacity-0"
          }
        `}
      />
    </div>
  );
}
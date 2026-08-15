"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * PALETTE LOGIC
 * bg      #D4C685  — warm gold/khaki backdrop
 * accent  #FF6B00  — signature orange: headings highlight, CTAs, active states, glows
 * ink     #1A1A1A  — near-black for primary text (white fails contrast on light gold)
 * surface #FFFFFF  — cards / glass panels
 * All interactive elements (pills, arrows, dots, progress, button) now route through
 * the same orange accent so the section reads as one intentional system, not a
 * repaint of a component built for a dark background.
 */

const slides = [
  {
    image: "/images/newjersey.ng_card.png",
    eyebrow: "Professional Branding",
    title: "Print Materials",
    highlight: "That Get Attention",
    description:
      "Business cards, flyers, packaging and premium print materials designed to make your brand impossible to ignore.",
    category: "Business Printing",
    floatingTitle: "Premium Quality",
    floatingText: "Sharp. Clean. Professional.",
  },
  {
    image: "/images/hoodie.png",
    eyebrow: "Custom Apparel",
    title: "Wear Your",
    highlight: "Brand With Pride",
    description:
      "Custom jerseys, shirts, caps and apparel created for teams, businesses, events and brands that want to stand out.",
    category: "Apparel & Jerseys",
    floatingTitle: "Custom Orders",
    floatingText: "Made for your brand.",
  },
  {
    image: "/images/merchandise.png",
    eyebrow: "Promotional Products",
    title: "Make Your Brand",
    highlight: "Memorable",
    description:
      "Branded mugs, merchandise and promotional products that keep your business in front of your customers every day.",
    category: "Mugs & Merchandise",
    floatingTitle: "Flexible Orders",
    floatingText: "Starting from 1 unit.",
  },
];

const SLIDE_DURATION = 5500;

export default function Hero() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const visualRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const slide = slides[active];

  const goTo = (index: number, dir: "next" | "prev") => {
    setDirection(dir);
    setActive((index + slides.length) % slides.length);
  };

  const next = () => goTo(active + 1, "next");
  const prev = () => goTo(active - 1, "prev");

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection("next");
      setActive((p) => (p + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    slides.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setParallax({ x, y });
  };

  const resetParallax = () => setParallax({ x: 0, y: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative min-h-[680px] overflow-hidden bg-[#D4C685] text-[#1A1A1A]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background atmosphere — orange-tinted glows tie the accent into the field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/10 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[600px] w-[600px] rounded-full bg-black/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,26,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,.8) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          {/* LEFT */}
          <div className="relative z-20 max-w-2xl">
            <div key={`eyebrow-${active}`} className="animate-[fadeUp_.6s_ease-out]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/30 bg-white/60 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF6B00] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,.6)]" />
                {slide.eyebrow}
              </span>
            </div>

            <div key={`heading-${active}`} className="mt-7 animate-[fadeUp_.7s_ease-out]">
              <h1 className="text-5xl font-black leading-[0.92] tracking-[-0.04em] text-[#1A1A1A] sm:text-6xl lg:text-7xl">
                {slide.title}
                <span className="mt-2 block text-[#FF6B00]">{slide.highlight}</span>
              </h1>
            </div>

            <p
              key={`description-${active}`}
              className="mt-7 max-w-xl animate-[fadeUp_.8s_ease-out] text-base leading-7 text-[#1A1A1A]/70 sm:text-lg"
            >
              {slide.description}
            </p>

            <div key={`search-${active}`} className="mt-9 max-w-2xl animate-[fadeUp_.9s_ease-out]">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#1A1A1A]">
                What would you like to print today?
              </p>

              <div className="flex h-16 items-center rounded-2xl bg-white p-2 shadow-[0_25px_70px_rgba(0,0,0,0.15)]">
                <input
                  type="text"
                  placeholder="Search business cards, jerseys, mugs..."
                  className="h-full w-full bg-transparent px-4 text-[15px] text-gray-800 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00] text-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#1A1A1A]"
                >
                  ⌕
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Apparel", "Jerseys", "Business Cards", "Mugs", "Caps"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full border border-[#1A1A1A]/10 bg-white/70 px-4 py-2 text-xs font-bold text-[#1A1A1A] backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div
            ref={visualRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetParallax}
            className="relative hidden h-[520px] lg:block"
          >
            <div
              className="absolute right-0 top-1/2 h-[430px] w-[430px] -translate-y-1/2 rounded-full bg-[#FF6B00]/25 blur-[100px] transition-transform duration-300 ease-out"
              style={{ transform: `translate(${parallax.x * 0.4}px, calc(-50% + ${parallax.y * 0.4}px))` }}
            />

            <div className="absolute right-8 top-1/2 h-[430px] w-[430px] -translate-y-1/2 rounded-full border border-[#1A1A1A]/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute right-20 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full border border-dashed border-[#1A1A1A]/10 animate-[spinReverse_55s_linear_infinite]" />

            <div className="absolute right-0 top-1/2 h-[410px] w-[410px] -translate-y-1/2 rounded-[50px] border border-white/60 bg-white/25 shadow-2xl backdrop-blur-md" />

            {/* Image with parallax + direction-aware slide */}
            <div
              key={`image-${active}`}
              className={`absolute inset-0 z-10 transition-transform duration-300 ease-out ${
                direction === "next" ? "animate-[imageInNext_.7s_ease-out]" : "animate-[imageInPrev_.7s_ease-out]"
              }`}
              style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={active === 0}
                className="object-contain object-right drop-shadow-[0_45px_70px_rgba(0,0,0,0.3)]"
              />
            </div>

            {/* Floating top card */}
            <div
              key={`floating-${active}`}
              className="absolute left-0 top-20 z-30 animate-[floatIn_.7s_ease-out] rounded-2xl border border-black/[0.06] bg-white px-5 py-4 shadow-[0_25px_60px_rgba(0,0,0,.15)]"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                {slide.category}
              </p>
              <p className="mt-1 text-sm font-bold text-[#1A1A1A]">{slide.floatingTitle}</p>
              <p className="mt-0.5 text-xs text-gray-500">{slide.floatingText}</p>
            </div>

            {/* Floating bottom card */}
            <div className="absolute bottom-16 right-0 z-30 rounded-2xl bg-[#1A1A1A] px-5 py-4 shadow-2xl">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">New Jersey</p>
              <p className="mt-1 text-sm font-bold text-white">Print & Branding</p>
            </div>

            {/* Slide number */}
            <div className="absolute bottom-2 left-0 z-30 flex items-center gap-3">
              <span className="text-4xl font-black text-[#FF6B00]">0{active + 1}</span>
              <span className="h-px w-14 bg-[#1A1A1A]/25" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50">
                0{slides.length}
              </span>
            </div>

            {/* Prev / Next arrows */}
            <div className="absolute -bottom-2 right-0 z-30 flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A]/15 bg-white/70 text-[#1A1A1A] backdrop-blur-sm transition hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A]/15 bg-white/70 text-[#1A1A1A] backdrop-blur-sm transition hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goTo(index, index > active ? "next" : "prev")}
            className="group relative h-1.5 overflow-hidden rounded-full bg-[#1A1A1A]/15 transition-all duration-300"
            style={{ width: active === index ? 70 : 28 }}
          >
            <span
              className={`absolute inset-y-0 left-0 rounded-full bg-[#FF6B00] transition-all ${
                active === index ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Progress line */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-[#1A1A1A]/10">
        <div
          key={active}
          className="h-full bg-[#FF6B00]"
          style={{
            animation: isPaused ? "none" : `progress ${SLIDE_DURATION}ms linear`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imageInNext {
          from { opacity: 0; transform: translateX(35px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes imageInPrev {
          from { opacity: 0; transform: translateX(-35px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(15px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: translateY(-50%) rotate(360deg); }
          to { transform: translateY(-50%) rotate(0deg); }
        }
      `}</style>
    </section>
  );
}
"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import HeroSearchResults from "./HeroSearchResults";

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

const suggestions = ["Apparel", "Jerseys", "Business Cards", "Mugs", "Caps"];

const SLIDE_DURATION = 5500;

const focusStyle =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#D4C685]";

export default function Hero() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const restoreSearchFocus = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const slide = slides[active];

  const isPaused =
    hovered || focused || pageHidden || reducedMotion || !!searchQuery;

  function goTo(index: number, nextDirection: "next" | "prev") {
    setDirection(nextDirection);
    setActive((index + slides.length) % slides.length);
    setParallax({ x: 0, y: 0 });
  }

  function next() {
    setDirection("next");
    setActive((previous) => (previous + 1) % slides.length);
    setParallax({ x: 0, y: 0 });
  }

  function prev() {
    setDirection("prev");
    setActive(
      (previous) => (previous - 1 + slides.length) % slides.length,
    );
    setParallax({ x: 0, y: 0 });
  }

  function searchProducts(value: string) {
    const query = value.trim().slice(0, 120);

    if (!query) {
      searchRef.current?.focus();
      return;
    }

    setSearchInput(query);
    setSearchQuery(query);
    setHovered(false);
    setFocused(false);
    setParallax({ x: 0, y: 0 });
  }

  function closeSearch() {
    restoreSearchFocus.current = true;
    setSearchQuery("");
    setSearchInput("");
    setHovered(false);
    setFocused(false);
  }

  useEffect(() => {
    if (searchQuery || !restoreSearchFocus.current) return;

    restoreSearchFocus.current = false;
    searchRef.current?.focus({ preventScroll: true });
  }, [searchQuery]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateMotion() {
      setReducedMotion(media.matches);
    }

    function updateVisibility() {
      setPageHidden(document.hidden);
    }

    updateMotion();
    updateVisibility();

    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setTimeout(() => {
      setDirection("next");
      setActive((previous) => (previous + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [active, isPaused]);

  useEffect(() => {
    slides.forEach((item) => {
      const image = new window.Image();
      image.src = item.image;
    });
  }, []);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !visualRef.current) return;

    const rect = visualRef.current.getBoundingClientRect();

    setParallax({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 14,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 14,
    });
  }

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target.closest("input, button, a, textarea, select")
    ) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];

    if (touch) {
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStart.current;
    const touch = event.changedTouches[0];

    touchStart.current = null;

    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) <= 50 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) prev();
    else next();
  }

  if (searchQuery) {
    return (
      <HeroSearchResults
        query={searchQuery}
        onSearch={searchProducts}
        onClose={closeSearch}
      />
    );
  }

  return (
    <section
      ref={heroRef}
      aria-label="NewJersey.ng featured products and search"
      className="hero relative min-h-[680px] overflow-hidden bg-[#D4C685] text-[#1A1A1A]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setParallax({ x: 0, y: 0 });
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setFocused(false);
        }
      }}
      onKeyDown={(event) => {
        const target = event.target;

        if (
          target instanceof HTMLElement &&
          (target.closest("input, textarea, select") ||
            target.isContentEditable)
        ) {
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          prev();
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
      }}
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/10 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-[600px] w-[600px] rounded-full bg-black/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,26,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,.8) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 pb-24 pt-14 sm:pt-16 lg:px-10 lg:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          {/* Copy and search */}
          <div className="relative z-20 min-w-0 max-w-2xl">
            <div key={`eyebrow-${active}`} className="hero-enter">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/30 bg-white/60 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#984000] backdrop-blur-md">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[#FF6B00]"
                />
                {slide.eyebrow}
              </span>
            </div>

            <div
              key={`heading-${active}`}
              className="hero-enter mt-7"
            >
              <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#1A1A1A] sm:text-6xl lg:text-7xl">
                {slide.title}
                <span className="mt-2 block text-[#FF6B00]">
                  {slide.highlight}
                </span>
              </h1>
            </div>

            <p
              key={`description-${active}`}
              className="hero-enter mt-7 max-w-xl text-base leading-7 text-[#1A1A1A]/75 sm:text-lg"
            >
              {slide.description}
            </p>

            {/* Stable input: does not remount when slides change */}
            <div className="mt-9 max-w-2xl">
              <label
                htmlFor="hero-product-query"
                className="mb-3 block text-xs font-black uppercase tracking-[0.18em]"
              >
                What would you like to print today?
              </label>

              <form
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  searchProducts(searchInput);
                }}
                className="flex h-16 items-center rounded-2xl bg-white p-2 shadow-[0_25px_70px_rgba(0,0,0,0.15)]"
              >
                <input
                  ref={searchRef}
                  id="hero-product-query"
                  name="q"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search business cards, jerseys, mugs..."
                  required
                  maxLength={120}
                  enterKeyHint="search"
                  className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-3 text-base text-gray-800 outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#FF6B00] sm:px-4"
                />

                <button
                  type="submit"
                  aria-label="Search products"
                  className={`ml-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00] text-[#1A1A1A] transition-colors hover:bg-[#E85F00] ${focusStyle}`}
                >
                  <Search size={22} aria-hidden="true" />
                </button>
              </form>
            </div>

            <div
              aria-label="Popular searches"
              className="mt-6 flex flex-wrap gap-2"
            >
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => searchProducts(item)}
                  className={`min-h-10 rounded-full border border-[#1A1A1A]/10 bg-white/70 px-4 py-2 text-xs font-bold text-[#1A1A1A] backdrop-blur-sm transition-colors hover:border-[#FF6B00] hover:bg-[#FF6B00] ${focusStyle}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop visual */}
          <div
            ref={visualRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setParallax({ x: 0, y: 0 })}
            className="relative hidden h-[520px] min-w-0 lg:block"
          >
            <div
              aria-hidden="true"
              className="absolute right-0 top-1/2 h-[430px] w-[430px] rounded-full bg-[#FF6B00]/25 blur-[100px] transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${parallax.x * 0.4}px, calc(-50% + ${parallax.y * 0.4}px))`,
              }}
            />

            <div
              aria-hidden="true"
              className="absolute right-8 top-1/2 h-[430px] w-[430px] -translate-y-1/2"
            >
              <div className="hero-orbit h-full w-full rounded-full border border-[#1A1A1A]/10" />
            </div>

            <div
              aria-hidden="true"
              className="absolute right-20 top-1/2 h-[350px] w-[350px] -translate-y-1/2"
            >
              <div className="hero-orbit-reverse h-full w-full rounded-full border border-dashed border-[#1A1A1A]/10" />
            </div>

            <div
              aria-hidden="true"
              className="absolute right-0 top-1/2 h-[410px] w-[410px] -translate-y-1/2 rounded-[50px] border border-white/60 bg-white/25 shadow-2xl backdrop-blur-md"
            />

            <div
              className="absolute inset-0 z-10 transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform: `translate(${parallax.x}px, ${parallax.y}px)`,
              }}
            >
              <div
                key={`image-${active}`}
                className={`relative h-full w-full ${
                  direction === "next"
                    ? "hero-image-next"
                    : "hero-image-prev"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={`${slide.title} ${slide.highlight}`}
                  fill
                  priority={active === 0}
                  sizes="(min-width: 1024px) 48vw, 1px"
                  className="object-contain object-right drop-shadow-[0_45px_70px_rgba(0,0,0,0.3)]"
                />
              </div>
            </div>

            <div
              key={`floating-${active}`}
              className="hero-enter absolute left-0 top-20 z-30 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 shadow-[0_25px_60px_rgba(0,0,0,.15)]"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#984000]">
                {slide.category}
              </p>
              <p className="mt-1 text-sm font-bold">
                {slide.floatingTitle}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {slide.floatingText}
              </p>
            </div>

            <div className="absolute bottom-16 right-0 z-30 rounded-2xl bg-[#1A1A1A] px-5 py-4 shadow-2xl">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                New Jersey
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                Print & Branding
              </p>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-2 left-0 z-30 flex items-center gap-3"
            >
              <span className="text-4xl font-black text-[#FF6B00]">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-14 bg-[#1A1A1A]/25" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="absolute -bottom-2 right-0 z-30 flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#1A1A1A]/15 bg-white/70 transition-colors hover:border-[#FF6B00] hover:bg-[#FF6B00] ${focusStyle}`}
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#1A1A1A]/15 bg-white/70 transition-colors hover:border-[#FF6B00] hover:bg-[#FF6B00] ${focusStyle}`}
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div
        aria-label="Choose featured slide"
        className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
      >
        {slides.map((item, index) => (
          <button
            key={item.image}
            type="button"
            aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() =>
              goTo(index, index > active ? "next" : "prev")
            }
            className={`flex h-11 items-center justify-center rounded-full px-1 ${focusStyle}`}
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                active === index
                  ? "w-16 bg-[#FF6B00]"
                  : "w-6 bg-[#1A1A1A]/20"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Restarts with the timer after a pause */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-full bg-[#1A1A1A]/10"
      >
        <div
          key={`${active}-${isPaused}`}
          className="hero-progress h-full bg-[#FF6B00]"
          style={{
            width: isPaused ? "0%" : undefined,
            animation: isPaused
              ? "none"
              : `heroProgress ${SLIDE_DURATION}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        .hero-enter {
          animation: heroFadeUp 0.65s ease-out both;
        }

        .hero-image-next {
          animation: heroImageNext 0.7s ease-out both;
        }

        .hero-image-prev {
          animation: heroImagePrev 0.7s ease-out both;
        }

        .hero-orbit {
          animation: heroSpin 40s linear infinite;
        }

        .hero-orbit-reverse {
          animation: heroSpin 55s linear infinite reverse;
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroImageNext {
          from {
            opacity: 0;
            transform: translateX(35px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes heroImagePrev {
          from {
            opacity: 0;
            transform: translateX(-35px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes heroProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes heroSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-enter,
          .hero-image-next,
          .hero-image-prev,
          .hero-orbit,
          .hero-orbit-reverse,
          .hero-progress {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
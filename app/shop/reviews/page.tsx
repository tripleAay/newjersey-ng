"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

type Review = {
  id: number;
  name: string;
  role: string;
  company?: string;
  rating: number;
  quote: string;
  highlight?: string;
};

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Tola A.",
    role: "Brand & Marketing Lead",
    company: "Lagos Streetwear Collective",
    rating: 5,
    highlight: "“Our drops finally look as premium as they feel.”",
    quote:
      "We used Fynaro for our last merch run and it was the first time our tees, hoodies and caps felt fully aligned with the brand. Prints sat clean, colors didn’t fade after wash day, and the unboxing felt intentional.",
  },
  {
    id: 2,
    name: "Kelechi N.",
    role: "Creative Director",
    company: "Studio Nwando",
    rating: 5,
    quote:
      "Clients expect a certain standard when they hear ‘studio merch’. Fynaro gave us that. The crewnecks and tote bags have become part of our visual identity.",
  },
  {
    id: 3,
    name: "Esther J.",
    role: "Founder",
    company: "Everyday Faith Collective",
    rating: 4.8,
    quote:
      "I needed something that didn’t feel like ‘church merch’. Fynaro helped us hit that sweet spot: minimal, thoughtful, wearable anywhere.",
  },
  {
    id: 4,
    name: "Daniel O.",
    role: "Head of People",
    company: "Growthstack Africa",
    rating: 5,
    quote:
      "For our offsite, we wanted kits that didn’t feel generic. The polos and caps from Fynaro looked like something you’d actually buy – not just another giveaway.",
  },
];

const StarRow = ({ rating = 5 }: { rating?: number }) => {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={`${
            i < full ? "fill-[#f5e4b5] text-[#f5e4b5]" : "text-neutral-500"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  // You can later pull this from the URL / product detail
  const productName = "Fynaro Classic White Tee";

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quote.trim()) return;

    setSubmitting(true);

    // 🔌 hook your API here (POST to /api/reviews etc)
    const newReview: Review = {
      id: Date.now(),
      name: name.trim() || "Anonymous",
      role: role.trim() || "Buyer",
      company: company.trim() || undefined,
      rating,
      quote: quote.trim(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setRole("");
    setCompany("");
    setRating(5);
    setQuote("");
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Halo background */}
      <section className="relative pt-20 pb-10 sm:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0,transparent_55%)]"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-400">
                Product review
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Rate your{" "}
                <span className="text-[#f5e4b5]">{productName}</span>.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl">
                Share what it really felt like to buy and wear this piece — fit,
                fabric, print quality, delivery, everything. Your review guides
                the next buyer.
              </p>
            </div>

            {/* Stats block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#3a3124] bg-[radial-gradient(circle_at_top,#1b1917_0,#0b0a09_55%,#050505_100%)] px-4 py-4 sm:px-5 sm:py-5 w-full md:w-auto"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-[#f5e4b5]">
                  {averageRating.toFixed(1)}
                </span>
                <div>
                  <StarRow rating={averageRating} />
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Average from {reviews.length} review
                    {reviews.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] sm:text-xs text-neutral-500">
                We don’t publish fake reviews. Everything here is written by
                real buyers.
              </p>
            </motion.div>
          </div>

          {/* Divider line */}
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/60 to-transparent" />

          {/* Main: left = featured + list, right = write a review */}
          <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_minmax(0,1.1fr)] items-start">
            {/* LEFT: Highlight review + mini list */}
            <div className="space-y-6">
              {/* Highlight review */}
              {reviews[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative rounded-[26px] border border-[#3a3124] bg-[radial-gradient(circle_at_top,#1b1917_0,#0b0a09_55%,#050505_100%)] px-5 py-6 sm:px-7 sm:py-7 shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden"
                >
                  <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 border-t border-l border-[#c8a96a]/60 rounded-tr-full rounded-bl-full opacity-60" />
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 border-b border-r border-[#c8a96a]/60 rounded-tl-full rounded-br-full opacity-60" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                        Spotlight review
                      </p>
                      <h2 className="mt-1 text-xl sm:text-2xl font-semibold">
                        “{reviews[0].quote.slice(0, 70)}…”
                      </h2>
                    </div>
                    <Quote className="h-6 w-6 text-[#f5e4b5]/80" />
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <StarRow rating={reviews[0].rating} />
                    <span className="text-[11px] text-neutral-400">
                      Verified buyer
                    </span>
                  </div>

                  <p className="mt-4 text-sm sm:text-base text-neutral-200 leading-relaxed">
                    {reviews[0].quote}
                  </p>

                  <div className="mt-5 text-[11px] sm:text-xs text-neutral-400">
                    <span className="font-medium text-white">
                      {reviews[0].name}
                    </span>{" "}
                    · {reviews[0].role}
                    {reviews[0].company && ` · ${reviews[0].company}`}
                  </div>
                </motion.div>
              )}

              {/* Small vertical strip of other reviews */}
              <div className="space-y-3 sm:space-y-4">
                {reviews.slice(1, 4).map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="rounded-2xl border border-[#2c2620] bg-[#0a0907] px-4 py-4 sm:px-5 sm:py-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{review.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          {review.role}
                          {review.company && ` · ${review.company}`}
                        </p>
                      </div>
                      <StarRow rating={review.rating} />
                    </div>

                    <p className="mt-3 text-[11px] sm:text-sm text-neutral-200 leading-relaxed line-clamp-4">
                      {review.quote}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT: Form for buyer to leave review */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[24px] border border-[#3a3124] bg-[#080706] px-4 py-5 sm:px-6 sm:py-6 space-y-4"
            >
              <h2 className="text-base sm:text-lg font-semibold">
                Leave a review for this product
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                3–4 honest lines are perfect. Talk about fit, feel, print,
                delivery, and if you’d buy again.
              </p>

              {/* Rating selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs text-neutral-300">
                  Your rating
                </label>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    const active = value <= rating;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="p-0.5"
                      >
                        <Star
                          size={22}
                          className={
                            active
                              ? "fill-[#f5e4b5] text-[#f5e4b5]"
                              : "text-neutral-600"
                          }
                        />
                      </button>
                    );
                  })}
                  <span className="ml-1 text-[11px] text-neutral-400">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Name / role */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-xs text-neutral-300">
                    Your name{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-full border border-[#34302a] bg-[#050505] px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#f5e4b5] transition-colors"
                    placeholder="e.g. Tola A."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-xs text-neutral-300">
                    Role / how you use it
                  </label>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-full border border-[#34302a] bg-[#050505] px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#f5e4b5] transition-colors"
                    placeholder="e.g. Brand lead, Student, Creator"
                  />
                </div>
              </div>

              {/* Company (optional) */}
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs text-neutral-300">
                  Brand / company{" "}
                  <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-full border border-[#34302a] bg-[#050505] px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#f5e4b5] transition-colors"
                  placeholder="e.g. Lagos Streetwear Collective"
                />
              </div>

              {/* Review text */}
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs text-neutral-300">
                  Your review
                </label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-[#34302a] bg-[#050505] px-3 py-2.5 text-xs sm:text-sm outline-none focus:border-[#f5e4b5] transition-colors resize-none"
                  placeholder="What did you love? Anything that could be better? Would you recommend it?"
                />
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                disabled={submitting || !quote.trim()}
                className="w-full rounded-full bg-white text-[#111014] text-xs sm:text-sm font-semibold py-2.5 mt-2 tracking-wide hover:bg-[#f5e4b5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </motion.button>

              <p className="text-[10px] sm:text-[11px] text-neutral-500">
                By submitting, you agree we can show this on our site. We may
                lightly edit for spelling, not for meaning.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Horizontal strip – more voices, single row */}
      <section className="relative pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-7">
            <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-neutral-500">
              All reviews
            </p>
            <span className="text-[11px] sm:text-xs text-neutral-400">
              Scroll sideways to see more.
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/60 to-transparent opacity-80" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/60 to-transparent opacity-80" />

            <div className="mt-4 flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
              {reviews.map((review, index) => (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.6 }}
                  className="snap-center shrink-0 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[32%] rounded-[22px] border border-[#34302a] bg-[#0b0a08] px-4 py-5 sm:px-5 sm:py-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{review.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        {review.role}
                        {review.company && ` · ${review.company}`}
                      </p>
                    </div>
                    <Quote className="h-4 w-4 text-[#f5e4b5]/80" />
                  </div>

                  <div className="mt-2">
                    <StarRow rating={review.rating} />
                  </div>

                  {review.highlight && (
                    <p className="mt-3 text-[11px] sm:text-xs text-[#f5e4b5] font-medium leading-snug">
                      {review.highlight}
                    </p>
                  )}

                  <p className="mt-2 text-[11px] sm:text-sm text-neutral-200 leading-relaxed line-clamp-4">
                    {review.quote}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

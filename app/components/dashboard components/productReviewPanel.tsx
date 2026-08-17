"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";

type ProductReviewPanelProps = {
  productName: string;
  onBack: () => void;
  onSubmitReview?: (payload: {
    name: string;
    rating: number;
    review: string;
  }) => void;
};

export default function ProductReviewPanel({
  productName,
  onBack,
  onSubmitReview,
}: ProductReviewPanelProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRating || !reviewName.trim() || !reviewText.trim()) return;

    onSubmitReview?.({
      name: reviewName.trim(),
      rating: selectedRating,
      review: reviewText.trim(),
    });

    setSelectedRating(0);
    setReviewName("");
    setReviewText("");
  };

  return (
    <motion.div
      key="review-panel"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="rounded-[26px]  bg-[#f5f5f5]  px-5 py-5 shadow-[0_10px_35px_rgba(0,0,0,0.08)] sm:px-6 sm:py-6">
        <div className="space-y-5">
          {/* top */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#b79b46]">
                Review & Rating
              </p>
              <h2 className="text-lg font-semibold leading-tight text-[#111014] sm:text-xl">
                Leave a review
              </h2>
              <p className="max-w-md text-xs leading-6 text-slate-500 sm:text-sm">
                Share a quick experience for{" "}
                <span className="font-medium text-slate-700">{productName}</span>.
              </p>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#d6cc6d]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Rating
                </label>

                <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= selectedRating;

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        className="transition hover:scale-110"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${
                            active
                              ? "fill-[#F5B400] text-[#F5B400]"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 sm:text-sm">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Tell us what you think about this product..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#d6cc6d]"
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                {selectedRating > 0
                  ? `You selected ${selectedRating} star${
                      selectedRating > 1 ? "s" : ""
                    }.`
                  : "Select a rating from 1 to 5 stars."}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !selectedRating ||
                    !reviewName.trim() ||
                    !reviewText.trim()
                  }
                  className="rounded-full bg-[#111014] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  Submit review
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
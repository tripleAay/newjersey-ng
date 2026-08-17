"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Category = {
  id?: string | number;
  name: string;
  image: string;
  description?: string;
};

type DashboardCategoriesMinimalProps = {
  title?: string;
  subtitle?: string;
  categories: Category[];
  activeCategoryId?: string | number;
  onSelectCategory?: (category: Category) => void;
};

export default function DashboardCategoriesMinimal({
  title = "Categories",
  subtitle = "Services built for your workflow.",
  categories,
  activeCategoryId,
  onSelectCategory,
}: DashboardCategoriesMinimalProps) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">{title}</h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Category Grid */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {categories.map((cat, idx) => {
          const isActive = cat.id !== undefined && cat.id === activeCategoryId;

          return (
            <motion.button
              key={cat.id ?? idx}
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectCategory?.(cat)}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md border transition-all duration-200
                flex flex-col items-center w-44 sm:w-56 md:w-60 cursor-pointer px-5 py-6 sm:px-6 sm:py-7
                ${
                  isActive
                    ? "border-emerald-500/70 shadow-[0_0_0_2px_rgba(16,185,129,0.15)]"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                width={120}
                height={120}
                className="mb-4 object-contain"
              />

              {/* Category Name */}
              <h3 className="text-sm sm:text-base font-medium text-neutral-900 text-center">
                {cat.name}
              </h3>

              {/* Optional description */}
              {cat.description && (
                <p className="mt-2 text-[11px] sm:text-xs text-neutral-500 text-center line-clamp-2">
                  {cat.description}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Boxes,
  BriefcaseBusiness,
  MonitorSmartphone,
  Package,
} from "lucide-react";

export type Category = {
  id: string | number;
  name: string;
  icon?: ReactNode;
  description?: string;
};

type ExploreByCategorySectionProps = {
  isLoading?: boolean;
  categories: Category[];
  activeCategoryId?: string | number;
  onSelectCategory?: (category: Category) => void;
};

// ✅ Brand-correct icon mapping
const defaultIcons: Record<string, ReactNode> = {
  "Web & Mobile App": <MonitorSmartphone size={24} />,
  "Services": <BriefcaseBusiness size={24} />,
  "Printed Products": <Package size={24} />,

  "web-services": <MonitorSmartphone size={24} />,
  services: <BriefcaseBusiness size={24} />,
  "printed-products": <Package size={24} />,
};

// ✅ Route mapping
const categoryRoutes: Record<string, string> = {
  "web-services": "/shop/web-services",
  "Web & Mobile App": "/shop/web-services",

  services: "/shop/services",
  Services: "/shop/services",

  "printed-products": "/shop/printed-products",
  "Printed Products": "/shop/printed-products",
};

function getCategoryPath(cat: Category): string {
  if (typeof cat.id === "string" && categoryRoutes[cat.id]) {
    return categoryRoutes[cat.id];
  }

  if (categoryRoutes[cat.name]) {
    return categoryRoutes[cat.name];
  }

  const slug = cat.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `/shop/${slug}`;
}

// ✅ Active keys per category
const WEB_APP_KEYS = [
  "web-services",
  "Web & Mobile App",
  "web-mobile-app",
  "web",
];

const SERVICES_KEYS = [
  "services",
  "Services",
  "pricing-offers",
  "service",
];

const PRINT_KEYS = [
  "printed-products",
  "Printed Products",
  "print",
  "printed",
];

export default function ExploreByCategorySection({
  isLoading,
  categories,
  activeCategoryId,
  onSelectCategory,
}: ExploreByCategorySectionProps) {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | number | null>(null);

  const activeKey = activeCategoryId != null ? String(activeCategoryId) : "";

  if (isLoading) {
    return (
      <section className="mt-10 mb-6 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-4 h-6 w-56 rounded-full bg-neutral-800/70" />
          <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-neutral-800/80 bg-neutral-900/70"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 mb-6 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto mb-8 flex max-w-6xl flex-col items-center text-center sm:mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c8a96a]" />
          <span className="text-[11px] font-medium tracking-tight text-neutral-200 sm:text-xs">
            Web & Mobile · Services · Printed Products
          </span>
        </div>

        <h2 className="mb-2 text-2xl font-semibold sm:text-3xl">
          Explore your Fynaro workspace
        </h2>

        <p className="max-w-lg text-xs text-neutral-400 sm:text-sm">
          Three pillars, one ecosystem — explore digital builds, service offers
          and printed brand materials from one refined space.
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {categories.map((cat) => {
            const key = cat.id;

            let isActive = false;

            if (
              WEB_APP_KEYS.includes(String(cat.id)) ||
              WEB_APP_KEYS.includes(cat.name)
            ) {
              isActive = WEB_APP_KEYS.includes(activeKey);
            } else if (
              SERVICES_KEYS.includes(String(cat.id)) ||
              SERVICES_KEYS.includes(cat.name)
            ) {
              isActive = SERVICES_KEYS.includes(activeKey);
            } else if (
              PRINT_KEYS.includes(String(cat.id)) ||
              PRINT_KEYS.includes(cat.name)
            ) {
              isActive = PRINT_KEYS.includes(activeKey);
            }

            const isLoadingThis = loadingKey === key;

            const handleClick = () => {
              if (isLoadingThis) return;

              onSelectCategory?.(cat);
              setLoadingKey(key);

              const target = getCategoryPath(cat);

              setTimeout(() => {
                router.push(target);
              }, 800);
            };

            return (
              <motion.button
                key={String(key)}
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClick}
                disabled={isLoadingThis}
                className={`
                  relative overflow-hidden cursor-pointer
                  w-[46%] xs:w-[44%] sm:w-[15rem] lg:w-[15.5rem]
                  rounded-2xl border bg-gradient-to-b from-white/95 to-neutral-50
                  px-4 py-5 text-center shadow-sm transition-all duration-200
                  dark:from-neutral-900 dark:to-neutral-950 sm:px-5 sm:py-6
                  flex flex-col items-center
                  ${
                    isActive
                      ? "border-[#c8a96a] shadow-[0_0_0_1px_rgba(200,169,106,0.45)]"
                      : "border-neutral-200/80 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 hover:shadow-md"
                  }
                  ${isLoadingThis ? "opacity-80" : ""}
                `}
              >
                <div className="pointer-events-none absolute inset-x-0 -top-6 h-12 bg-gradient-to-b from-[#c8a96a]/22 to-transparent" />

                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f3e8d0] text-[#c8a96a] dark:bg-[#c8a96a]/12">
                  {cat.icon ??
                    defaultIcons[String(cat.id)] ??
                    defaultIcons[cat.name] ?? <Boxes size={22} />}
                </div>

                <h3
                  className={`flex items-center justify-center gap-2 text-sm font-medium tracking-tight sm:text-[0.95rem]
                  ${
                    isActive
                      ? "text-[#c8a96a]"
                      : "text-neutral-900 dark:text-neutral-50"
                  }`}
                >
                  {isLoadingThis && (
                    <motion.span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full border-[2px] border-[#c8a96a] border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "linear",
                      }}
                    />
                  )}
                  <span>{cat.name}</span>
                </h3>

                {cat.description && (
                  <p className="mt-2 line-clamp-2 text-[11px] text-neutral-500 dark:text-neutral-400 sm:text-xs">
                    {cat.description}
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Layers3,
  Sparkles,
} from "lucide-react";
import ProductCheckoutSection from "@/components/dashboard components/ProductCheckoutSection";

type ProjectData = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  year: string;
  client_name: string;
  services: string[];
  overview: string;
  challenge: string;
  approach: string;
  outcome: string;
  cover_image: string;
  gallery_images: string[];
  link?: string;
  status?: "Published" | "Draft" | "Archived";
  price?: string | number | null;
};

type Props = {
  project: ProjectData;
};

function formatPrice(price?: string | number | null) {
  if (price === null || price === undefined || price === "") {
    return "Custom quote";
  }

  if (typeof price === "number") {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  }

  const raw = String(price).trim();
  const numeric = Number(raw.replace(/[^0-9.]/g, ""));

  if (!Number.isNaN(numeric) && numeric > 0) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return raw;
}

export default function ProjectDetailInteractive({ project }: Props) {
  const gallery = useMemo(() => {
    const all = [
      ...(project.cover_image ? [project.cover_image] : []),
      ...((project.gallery_images || []).filter(Boolean) as string[]),
    ];

    const unique = Array.from(new Set(all)).filter(Boolean);

    return unique.length > 0 ? unique : ["/images/tote-bag.jpg"];
  }, [project.cover_image, project.gallery_images]);

  const [activeImage, setActiveImage] = useState(gallery[0]);

  const displayPrice = formatPrice(project.price);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,204,109,0.10),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />

        <div className="relative grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4 p-4 sm:p-6">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
              <div className="relative min-h-[380px] sm:min-h-[520px] lg:min-h-[640px]">
                <Image
                  src={activeImage}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
              </div>
            </div>

            {gallery.length > 1 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {gallery.map((img, index) => {
                  const isActive = img === activeImage;

                  return (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-square overflow-hidden rounded-[22px] border transition ${
                        isActive
                          ? "border-[#d6cc6d] ring-1 ring-[#d6cc6d]/40"
                          : "border-white/10 hover:border-white/25"
                      } bg-white/[0.03]`}
                    >
                      <Image
                        src={img}
                        alt={`${project.title} preview ${index + 1}`}
                        fill
                        className="object-cover transition duration-500 hover:scale-[1.03]"
                      />
                      <div
                        className={`absolute inset-0 ${
                          isActive
                            ? "bg-black/10"
                            : "bg-black/25 hover:bg-black/10"
                        } transition`}
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                  {project.category || "Web Service"}
                </span>

                {project.status ? (
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${
                      project.status === "Published"
                        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                        : project.status === "Draft"
                        ? "border border-amber-400/20 bg-amber-400/10 text-amber-200"
                        : "border border-white/10 bg-white/[0.05] text-white/70"
                    }`}
                  >
                    {project.status}
                  </span>
                ) : null}

                <span className="inline-flex items-center gap-1 rounded-full border border-[#eadb97]/25 bg-[#eadb97]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#eadb97]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Project Case
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                {project.title}
              </h1>

              <p className="mt-4 text-sm leading-8 text-white/68 sm:text-base">
                {project.subtitle ||
                  "A premium digital build crafted for clarity, performance, and visual confidence."}
              </p>

              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                  Starting Price
                </p>
                <p className="mt-2 text-lg font-medium text-[#eadb97]">
                  {displayPrice}
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                    <BriefcaseBusiness className="h-4 w-4" />
                    Client
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/82">
                    {project.client_name || "Confidential Client"}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                    <CalendarDays className="h-4 w-4" />
                    Year
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/82">
                    {project.year || "—"}
                  </p>
                </div>
              </div>

              {project.services?.length > 0 ? (
                <div className="mt-6">
                  <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                    <Layers3 className="h-4 w-4" />
                    Services Rendered
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {project.services.map((service, index) => (
                      <span
                        key={`${service}-${index}`}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/78"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-8">
              {project.link ? (
                <Link
                  href={project.link}
                  target="_blank"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d6cc6d] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Visit Project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <ProductCheckoutSection
                  product={{
                    id: project.id,
                    price: project.price ?? 0,
                  }}
                  title={project.title}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Overview
          </p>
          <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
            {project.overview || "No overview provided for this project yet."}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Challenge
          </p>
          <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
            {project.challenge ||
              "No challenge details provided for this project yet."}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Approach
          </p>
          <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
            {project.approach ||
              "No approach details provided for this project yet."}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
            <CheckCircle2 className="h-4 w-4 text-[#eadb97]" />
            Outcome
          </p>
          <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
            {project.outcome ||
              "No outcome details provided for this project yet."}
          </p>
        </div>
      </section>
    </div>
  );
}
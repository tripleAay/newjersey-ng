"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  X,
} from "lucide-react";

type ProjectViewShowcaseProps = {
  project: {
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
    gallery_images: string[];
    link?: string;
    status?: "Published" | "Draft" | "Archived";
  };
};

export default function ProjectViewShowcase({
  project,
}: ProjectViewShowcaseProps) {
  const gallery = useMemo(() => {
    return Array.isArray(project.gallery_images)
      ? project.gallery_images.filter(Boolean)
      : [];
  }, [project.gallery_images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = gallery[activeIndex] || "";

  const goPrev = () => {
    if (!gallery.length) return;
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (!gallery.length) return;
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, gallery.length]);

  const dossierStats = [
    { label: "Client", value: project.client_name || "Private" },
    { label: "Year", value: project.year || "—" },
    { label: "Status", value: project.status || "Published" },
    { label: "Category", value: project.category || "Project" },
  ];

  const detailBlocks = [
    {
      label: "Overview",
      value: project.overview || "No overview added yet.",
      wide: true,
    },
    {
      label: "Challenge",
      value: project.challenge || "No challenge added yet.",
    },
    {
      label: "Approach",
      value: project.approach || "No approach added yet.",
    },
    {
      label: "Outcome",
      value: project.outcome || "No outcome added yet.",
    },
  ];

  return (
    <>
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Image showcase stays intact */}
          <section className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
            <div className="relative">
              <div className="relative h-[420px] sm:h-[540px] lg:h-[680px]">
                {activeImage ? (
                  <>
                    <Image
                      src={activeImage}
                      alt={`${project.title} preview ${activeIndex + 1}`}
                      fill
                      className="object-cover transition duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/30 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/30 to-transparent" />

                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous image"
                      className="absolute left-5 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-xl transition hover:scale-[1.03] hover:bg-black/50"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next image"
                      className="absolute right-5 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-xl transition hover:scale-[1.03] hover:bg-black/50"
                    >
                      <ArrowRight className="h-6 w-6" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-black/55"
                    >
                      <Expand className="h-4 w-4" />
                      Open View
                    </button>

                    <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm text-white/85 backdrop-blur-xl">
                      {activeIndex + 1} / {gallery.length || 1}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-white/45">
                    No images available
                  </div>
                )}
              </div>

              {gallery.length > 1 ? (
                <div className="border-t border-white/10 bg-black/20 px-4 py-4 sm:px-6">
                  <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {gallery.map((image, index) => (
                      <button
                        key={image + index}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`relative h-24 min-w-[112px] overflow-hidden rounded-[18px] border transition ${
                          activeIndex === index
                            ? "border-white/40 ring-1 ring-white/25"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${project.title} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* Elevated infography side */}
          <section className="space-y-6">
            {/* Main dossier block */}
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%)] pointer-events-none" />
              <div className="relative">
                <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[1.15fr_0.85fr]">
                  {/* Left editorial intro */}
                  <div>
                    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/72">
                      {project.category || "Project Dossier"}
                    </div>

                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                      {project.title}
                    </h2>

                    <p className="mt-5 max-w-3xl text-sm leading-8 text-white/68 sm:text-base">
                      {project.subtitle || "A refined project presentation."}
                    </p>

                    {(project.services ?? []).length ? (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.services.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/85"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Right infography panel */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {dossierStats.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[24px] border border-white/10 bg-black/20 p-4 backdrop-blur-sm"
                      >
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                          {item.label}
                        </p>
                        <p className="mt-3 text-base font-medium text-white/82">
                          {item.value}
                        </p>
                      </div>
                    ))}

                    {project.link ? (
                      <Link
                        href={project.link}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-white/10 bg-white/[0.07] px-4 py-4 text-sm font-medium text-white transition hover:bg-white/[0.12] sm:col-span-2"
                      >
                        Visit Live Project
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Story sections */}
            <div className="grid gap-5 xl:grid-cols-2">
              {detailBlocks.map((item) => (
                <article
                  key={item.label}
                  className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] sm:p-8 ${
                    item.wide ? "xl:col-span-2" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_26%)] pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                        {item.label}
                      </p>
                      <div className="h-px w-16 bg-white/10 mt-2" />
                    </div>

                    <p className="mt-5 text-sm leading-8 text-white/68 sm:text-base">
                      {item.value}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-md">
          <div className="absolute right-5 top-5 z-10 flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
              {activeIndex + 1} / {gallery.length || 1}
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-6 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-6 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            <ArrowRight className="h-6 w-6" />
          </button>

          <div className="relative h-full w-full px-6 py-24">
            {activeImage ? (
              <div className="relative mx-auto h-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10">
                <Image
                  src={activeImage}
                  alt={`${project.title} expanded ${activeIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
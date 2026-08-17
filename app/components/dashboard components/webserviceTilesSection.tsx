"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type DbProject = {
  id: string;
  title: string;
  category: string | null;
  subtitle?: string | null;
  year: string | null;
  client_name: string | null;
  cover_image: string | null;
  gallery_images?: string[] | null;
  created_at?: string | null;
  status?: "Published" | "Draft" | "Archived" | null;
  link?: string | null;
};

type ProjectResponse = {
  projects: DbProject[];
};

function getProjectBadge(project: DbProject) {
  return project.category || "Project";
}

export default function ServiceTilesSection() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/projects", {
          method: "GET",
          cache: "no-store",
        });

        const text = await res.text();

        let data: ProjectResponse;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`Invalid server response: ${text}`);
        }

        if (!res.ok) {
          throw new Error(data ? "Failed to fetch projects" : "Failed to fetch projects");
        }

        setProjects(data.projects ?? []);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const publishedProjects = useMemo(() => {
  return projects.filter((project) => {
    const status = project.status?.toLowerCase();
    return status === "published" || !status;
  });
}, [projects]);

  return (
    <section className="relative py-18 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,#141416_0%,#0c0c0e_55%,#080809_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
              >
                <div className="h-35 animate-pulse bg-white/5" />
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-4/6 animate-pulse rounded-full bg-white/10" />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-9 flex-1 animate-pulse rounded-full bg-white/10" />
                    <div className="h-9 flex-1 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-red-400/20 bg-red-500/5 p-6 text-sm text-red-200">
            {error}
          </div>
        ) : !publishedProjects.length ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-sm text-white/55">No published projects available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {publishedProjects.map((project, index) => {
              const badge = getProjectBadge(project);

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="group overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,#141416_0%,#0c0c0e_55%,#080809_100%)] text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-[#d6cc6d]/30 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={project.cover_image || "/categories/web.png"}
                      alt={project.title || "Project image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full border border-[#d6cc6d]/35 bg-black/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#e8d78a] backdrop-blur-sm">
                      {badge}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-white">
                        {project.title || "Untitled Project"}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-[#eadb97]">
                        {project.client_name || "Private Client"}
                      </p>
                    </div>

                    <p className="line-clamp-4 text-sm leading-7 text-white/60">
                      {project.subtitle ||
                        "A premium project built with clarity, structure, and execution in mind."}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/35">
                      <span>{project.year || "—"}</span>
                      <span>{project.status || "Published"}</span>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <motion.div
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Link
                          href={`/shop/web-services/${project.id}`}
                          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#d6cc6d] px-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition duration-300 hover:bg-[#e5d98a]"
                        >
                          View Project
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>

                      {project.link ? (
                        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            href={project.link}
                            target="_blank"
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:border-[#d6cc6d]/35 hover:bg-[#171611]"
                          >
                            Live
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </motion.div>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import DashboardHeader from "@/components/dashboard components/mainheader";
import DashboardBreadcrumb from "@/components/dashboard components/breadcrumb";
import Footer from "@/components/footer";
import ProjectDetailInteractive from "@/components/dashboard components/ProjectDetailInteractive";

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

async function getProject(id: string): Promise<ProjectData | null> {
  try {
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) return null;

    const res = await fetch(`${protocol}://${host}/api/projects/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.project ?? null;
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050506] text-white">
        <DashboardHeader />

        <div className="border-b border-white/5 px-3 pb-4 pt-30">
          <DashboardBreadcrumb
            items={[
              { label: "Shop", href: "/shop" },
              { label: "Web Services", href: "/shop/web-services" },
              { label: "Project" },
            ]}
          />
        </div>

        <main className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/shop/web-services"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition hover:border-white/25 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
              <h1 className="text-2xl font-semibold tracking-tight">
                Project not found
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                The project you are trying to open does not exist or is no longer available.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <DashboardHeader />

      <div className="border-b border-white/5 px-3 pb-4 pt-30">
        <DashboardBreadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Web Services", href: "/shop/web-services" },
            { label: project.title || "Project" },
          ]}
        />
      </div>

      <main className="px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/shop/web-services"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="mt-8">
            <ProjectDetailInteractive project={project} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
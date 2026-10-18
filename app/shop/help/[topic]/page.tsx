import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { helpArticles } from "@/app/lib/newjersey/help/content";
type Props = { params: Promise<{ topic: string }> };
export function generateStaticParams() {
  return helpArticles.map((article) => ({ topic: article.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const article = helpArticles.find((x) => x.slug === topic);
  return {
    title: article
      ? `${article.title} | NewJersey.ng Help`
      : "Help | NewJersey.ng",
    description: article?.summary,
  };
}
export default async function HelpTopic({ params }: Props) {
  const { topic } = await params;
  const article = helpArticles.find((x) => x.slug === topic);
  if (!article) notFound();
  return (
    <>
      <Link
        href="/shop/help"
        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs text-[#625D55] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        All help topics
      </Link>
      <article className="mt-4 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8379]">
          NewJersey.ng / Help
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#625D55]">
          {article.summary}
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {article.links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-4 text-xs font-semibold hover:bg-[#F0EFEB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              {label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="mt-8 space-y-8 border-t border-black/10 pt-8">
          {article.sections.map(([heading, paragraphs], index) => (
            <section key={heading} aria-labelledby={`help-section-${index}`}>
              <h2
                id={`help-section-${index}`}
                className="text-lg font-semibold tracking-tight"
              >
                {heading}
              </h2>
              <div className="mt-3 space-y-3">
                {paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-[#625D55]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
      <nav
        aria-label="Other help topics"
        className="mt-10 border-t border-black/10 pt-6"
      >
        <p className="text-xs font-semibold">More help</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {helpArticles
            .filter((x) => x.slug !== topic)
            .map((x) => (
              <Link
                key={x.slug}
                href={`/shop/help/${x.slug}`}
                className="inline-flex min-h-11 items-center rounded-sm text-xs text-[#625D55] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
              >
                {x.title}
              </Link>
            ))}
        </div>
      </nav>
    </>
  );
}

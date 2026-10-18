import Link from "next/link";
import StickyNavigation from "@/app/components/StickyNavigation";
import Footer from "@/app/components/Footer";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { footerPages, type FooterTopic } from "@/app/lib/newjersey/footer/content";
export default function FooterPage({ topic }: { topic: FooterTopic }) {
 const page = footerPages[topic];
 return <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
 <StickyNavigation />
 <main className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 sm:py-12">
 <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#625D55] hover:text-[#181818]"><ArrowLeft size={15} aria-hidden="true"/>Back to home</Link>
 <div className="mb-10 mt-7 max-w-2xl"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#B94700]">NewJersey.ng / {topic === "terms" || topic === "privacy-policy" ? "Policies" : "Information"}</p><h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">{page.title}</h1><p className="mt-5 text-sm leading-7 text-[#625D55]">{page.intro}</p></div>
 <div className="grid items-start gap-10 lg:grid-cols-[210px_1fr] lg:gap-16">
 <nav aria-label="On this page" className="border-y border-black/10 py-4 lg:sticky lg:top-40"><p className="mb-2 text-xs font-semibold">On this page</p>{page.sections.map((section,index)=><a key={section.title} href={`#section-${index+1}`} className="block py-2 text-xs leading-5 text-[#625D55] hover:text-[#B94700]">{section.title}</a>)}</nav>
 <div>{page.sections.map((section,index)=><section key={section.title} id={`section-${index+1}`} className="scroll-mt-44 border-b border-black/10 pb-7 [&+section]:pt-7"><h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>{section.paragraphs.map(text=><p key={text} className="mt-3 max-w-2xl text-sm leading-7 text-[#625D55]">{text}</p>)}</section>)}</div></div>
 <aside className="mt-10 rounded-2xl border border-black/10 bg-white p-6"><h2 className="text-lg font-semibold">Speak with NewJersey.ng.</h2><div className="mt-4 flex flex-wrap gap-3"><a href="mailto:hello@newjersey.ng" className="inline-flex min-h-11 items-center rounded-full bg-[#FF6B00] px-5 text-xs font-semibold text-[#181818]">Email us</a><a href="https://wa.me/2348089570493" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-5 text-xs font-semibold">WhatsApp<span className="sr-only"> (opens in a new tab)</span><ArrowUpRight size={14} aria-hidden="true"/></a><Link href="/shop/order" className="inline-flex min-h-11 items-center px-3 text-xs font-semibold">My orders</Link></div></aside>
 <nav aria-label="Related information" className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#625D55]">{[["/terms","Terms"],["/privacy-policy","Privacy"],["/returns","Returns & refunds"],["/shipping","Delivery"],["/print-guidelines","Print guidelines"]].map(([href,label])=><Link key={href} href={href} className="underline underline-offset-4">{label}</Link>)}</nav>
 </main><Footer showQuoteCTA={false}/></div>;
}

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import StickyNavigation from "@/app/components/StickyNavigation";
import Footer from "@/app/components/Footer";
import { publicServices, type PublicService } from "@/app/lib/newjersey/footer/services";
export default function PublicServicePage({ topic }: { topic: PublicService }) {
 const page = publicServices[topic];
 return <div className="min-h-screen bg-[#FCFBF8] text-[#181818]"><StickyNavigation />
 <main className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 sm:py-14">
 <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#625D55]"><ArrowLeft size={15} aria-hidden="true"/>Back to home</Link>
 <section className="border-b border-black/10 pb-10 pt-8"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#B94700]">NewJersey.ng / Services</p><h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">{page.title}</h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#625D55]">{page.intro}</p><Link href={page.href} className="mt-7 inline-flex min-h-12 items-center gap-5 rounded-full bg-[#FF6B00] px-6 text-sm font-semibold">{page.label}<ArrowUpRight size={16} aria-hidden="true"/></Link></section>
 <div className="grid gap-8 py-10 md:grid-cols-3">{page.sections.map(([title,text])=><section key={title}><h2 className="text-lg font-semibold tracking-tight">{title}</h2><p className="mt-3 text-sm leading-7 text-[#625D55]">{text}</p></section>)}</div>
 <nav aria-label="Plan your order" className="flex flex-wrap gap-3 border-t border-black/10 pt-7">{[["/shop/custom","Custom orders"],["/hire-a-designer","Hire a designer"],["/contact","Discuss your project"],["/print-guidelines","Artwork guidelines"]].map(([href,label])=><Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-5 text-xs font-semibold hover:bg-white">{label}</Link>)}</nav>
 </main><Footer /></div>;
}

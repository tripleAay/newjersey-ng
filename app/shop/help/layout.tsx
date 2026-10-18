import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import Header from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
import { helpTopics } from "@/app/lib/newjersey/help/navigation";
export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>
        <div className="relative z-[100] bg-[#FCFBF8]/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <Header />
        </div>
      </header>
      <main className="mx-auto max-w-[1344px] px-5 pb-16 pt-5 sm:px-8 sm:pb-20 lg:px-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium text-[#625D55] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to shop
        </Link>
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:block">
            <nav aria-label="Help navigation" className="space-y-1">
              <Link
                href="/shop/help"
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-[#F0EFEB]"
              >
                Help centre
              </Link>
              {helpTopics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/shop/help/${topic.slug}`}
                  className="flex min-h-11 items-center rounded-lg px-3 text-xs leading-5 text-[#625D55] hover:bg-[#F0EFEB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                >
                  {topic.title}
                </Link>
              ))}
            </nav>
            <div className="mt-6 border-t border-black/10 pt-5">
              <p className="text-xs leading-6 text-[#625D55]">
                Have an order already? Keep its reference ready when contacting
                us.
              </p>
              <Link
                href="/shop/order"
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-semibold underline underline-offset-4"
              >
                My orders
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </aside>
          <div className="min-w-0">
            {children}
            <section
              aria-labelledby="help-contact-heading"
              className="mt-12 rounded-2xl border border-black/10 bg-[#F4F1E9] p-5 sm:p-7"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8379]">
                Talk to NewJersey
              </p>
              <h2
                id="help-contact-heading"
                className="mt-2 text-xl font-semibold tracking-tight"
              >
                Need help with your order?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
                Send your order reference and explain what you need. If you have
                not ordered yet, tell us the product, quantity and intended use.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/2348089570493"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 rounded-full bg-[#181818] px-5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
                >
                  WhatsApp support
                  <ArrowUpRight size={15} aria-hidden="true" />
                  <span className="sr-only">Opens in a new tab</span>
                </a>
                <a
                  href="mailto:hello@newjersey.ng"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                >
                  <Mail size={15} aria-hidden="true" />
                  Email support
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer showQuoteCTA={false} />
    </div>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Printer,
  Shirt,
  Signpost,
  PenTool,
} from "lucide-react";
import ShopActivity from "@/app/components/newjersey/experience/ShopActivity";
import StoreShell from "@/app/components/newjersey/storefront/StoreShell";
import ProductGrid from "@/app/components/newjersey/storefront/ProductGrid";
import StoreSection from "@/app/components/newjersey/storefront/Section";
import JerseyShowcase from "@/app/shop/jerseys/JerseyShowcase";
import {
  loadDepartment,
  loadApparel,
  loadJerseys,
} from "@/app/lib/newjersey/storefront/load";
export const dynamic = "force-dynamic";
export default async function ShopPage() {
  const [apparel, print, branding, jerseys] = await Promise.all([
    loadApparel(),
    loadDepartment("print"),
    loadDepartment("branding"),
    loadJerseys(),
  ]);
  return (
    <StoreShell>
      <main className="mx-auto w-full min-w-0 max-w-[1344px] px-4 pb-12 sm:px-8 lg:px-12">
        <div className="mt-16">
          <ShopHero />
        </div>
        <StoreSection
          id="apparel"
          eyebrow="The clothing edit"
          title="Find your everyday favourite."
          description="Ready-designed pieces. Pick your size and colour."
          href="/shop/apparel"
        >
          <ProductGrid
            products={apparel.slice(0, 12)}
            department="apparel"
            preview
          />
        </StoreSection>
        <div id="jerseys" className="scroll-mt-40 py-7 sm:py-9">
          <JerseyShowcase products={jerseys} preview />
        </div>
        <StoreSection
          id="print"
          eyebrow="Printed with purpose"
          title="The essentials, well made."
          description="Business cards, flyers, stickers and more. Your specifications, your finish."
          href="/shop/print"
        >
          <ProductGrid
            products={print.slice(0, 6)}
            department="print"
            preview
          />
        </StoreSection>
        <StoreSection
          id="branding"
          eyebrow="Your business, in view"
          title="A presence that carries."
          description="Signage, vehicle graphics and branding for the spaces you work in."
          href="/shop/branding"
        >
          <ProductGrid
            products={branding.slice(0, 6)}
            department="branding"
            preview
          />
        </StoreSection>
        <aside className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-black/10 px-5 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <PenTool size={20} strokeWidth={1.5} className="text-[#FF6B00]" />
            <div>
              <h2 className="text-sm font-semibold">
                An idea that needs a designer?
              </h2>
              <p className="mt-1 text-xs leading-6 text-[#625D55]">
                Choose INK or FORM and send a short brief.
              </p>
            </div>
          </div>
          <Link
            href="/hire-a-designer"
            className="inline-flex min-h-11 items-center gap-3 text-xs font-semibold text-[#FF6B00]"
          >
            Meet your designer
            <ArrowUpRight size={15} />
          </Link>
        </aside>
        <ShopActivity />
      </main>
    </StoreShell>
  );
}

const departments = [
  {
    name: "Apparel",
    href: "/shop/apparel",
    detail: "Ready-designed clothing",
    icon: Shirt,
  },
  {
    name: "Print",
    href: "/shop/print",
    detail: "Business cards to packaging",
    icon: Printer,
  },
  {
    name: "Jerseys",
    href: "/shop/jerseys",
    detail: "Your team, name and number",
    icon: Shirt,
  },
  {
    name: "Branding",
    href: "/shop/branding",
    detail: "Signs, vehicles and spaces",
    icon: Signpost,
  },
];
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4";

function ShopHero() {
  return (
    <section
      aria-labelledby="shop-title"
      className="my-5 overflow-hidden rounded-2xl border border-black/[.06] bg-[#F0ECE5] sm:my-8"
    >
      <div className="grid gap-7 p-5 sm:gap-9 sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-9 lg:py-10">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#FF6B00]">
            The NewJersey shop
          </p>
          <h1
            id="shop-title"
            className="mt-4 text-[32px] font-medium leading-[1.16] tracking-[-.035em] sm:text-[40px] lg:text-[44px]"
          >
            Clothing, print
            <br />
            and branding.
          </h1>
          <p className="mt-4 max-w-[390px] text-[13px] leading-6 text-[#625D55]">
            Shop ready-designed apparel and team jerseys, or create print and
            branding for your business.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="#apparel"
              className={`inline-flex min-h-11 items-center justify-center gap-5 rounded-full bg-[#FF6B00] px-5 text-xs font-semibold text-[#181818] transition-colors hover:bg-[#E85F00] ${focus}`}
            >
              Shop the collections
              <ArrowRight size={15} aria-hidden="true" />
            </a>
            <Link
              href="/shop/custom"
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium text-[#625D55] transition-colors hover:text-[#FF6B00] ${focus}`}
            >
              Start a custom order
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <nav
          aria-label="Shop departments"
          className="min-w-0 border-t border-black/10 pt-5 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0"
        >
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[.16em] text-[#8A8379]">
            Find what you need
          </p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1 sm:gap-x-6">
            {departments.map(({ name, href, detail, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`group flex min-w-0 min-h-[76px] flex-col justify-center border-b border-black/10 py-3 sm:min-h-[92px] ${focus}`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="shrink-0 text-[#FF6B00]"
                  />
                  <span className="flex-1 text-xs font-semibold sm:text-sm">
                    {name}
                  </span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="text-[#8A8379] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                  />
                </span>
                <span className="mt-2 text-[10px] leading-5 text-[#746E65]">
                  {detail}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
} from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import {
    products,
} from "@/app/data/newjersey/products";

export const dynamic = "force-dynamic";

const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);

const statusLabels = {
    available: "Available now",
    "made-to-order": "Made to order",
    custom: "Custom",
    "pre-order": "Pre-order",
} as const;

export default function PrintPage() {
    const printProducts = products.filter(
        (product) =>
            product.category === "print" &&
            product.published !== false
    );

    return (
        <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
            <header className="sticky top-0 z-[100] w-full">
                <div className="relative z-[110]">
                    <TopNav />
                </div>

                <div className="relative z-[100] bg-[#6D1A36]/95 shadow-[0_2px_12px_rgba(0,0,0,0.18)] backdrop-blur-md">
                    <DashboardHeader />
                </div>
            </header>

            <main>
                <div className="mx-auto w-[92%] max-w-[1440px] pb-16 sm:pb-24">
                    <nav
                        aria-label="Breadcrumb"
                        className="py-5 sm:py-7"
                    >
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#6D1A36]"
                        >
                            <ArrowLeft size={15} aria-hidden="true" />
                            Back to shop
                        </Link>
                    </nav>

                    <section
                        aria-labelledby="print-heading"
                        className="border-b border-[#181818]/10 pb-8 pt-3 sm:pb-12 sm:pt-6"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D1A36]">
                            NewJersey.ng / Print
                        </p>

                        <h1
                            id="print-heading"
                            className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
                        >
                            Good ideas.
                            <br />
                            Beautifully printed.
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-[#666] sm:text-base">
                            Business cards, packaging, event materials,
                            and everyday brand essentials. Choose your
                            product and configure the details.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[#666]">
                            <span>Choose your specifications</span>
                            <span>Supply artwork or request design</span>
                            <span>Select pickup or delivery</span>
                        </div>
                    </section>

                    <section
                        aria-labelledby="products-heading"
                        className="pt-8 sm:pt-10"
                    >
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <h2
                                id="products-heading"
                                className="text-lg font-semibold tracking-tight sm:text-xl"
                            >
                                Explore print products
                            </h2>

                            <span className="shrink-0 text-xs text-[#777]">
                                {printProducts.length}{" "}
                                {printProducts.length === 1
                                    ? "product"
                                    : "products"}
                            </span>
                        </div>

                        {printProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-x-6 gap-y-9 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {printProducts.map((product) => {
                                    const price = product.pricing.basePrice;

                                    const priceLabel =
                                        product.pricing.type === "quote" ||
                                            price == null
                                            ? "Request a quote"
                                            : `${product.pricing.type ===
                                                "starting-from"
                                                ? "From "
                                                : ""
                                            }${formatPrice(price)}`;

                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/print/${product.slug}`}
                                            className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#181818]/10 bg-white transition duration-200 hover:border-[#6D1A36]/30 hover:shadow-[0_8px_24px_rgba(24,24,24,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1A36] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FCFBF8]"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden bg-[#EEECE6]">
                                                {product.image ? (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        sizes="(max-width: 479px) 92vw, (max-width: 1023px) 46vw, (max-width: 1279px) 31vw, 340px"
                                                        className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-[#777]">
                                                        {product.name}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col p-5">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777]">
                                                    {statusLabels[product.status]}
                                                </p>

                                                <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#181818] transition group-hover:text-[#6D1A36]">
                                                    {product.name}
                                                </h3>

                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#777]">
                                                    {product.shortDescription || product.description}
                                                </p>

                                                <div className="mt-auto pt-6">
                                                    <p className="text-lg font-bold tracking-tight">
                                                        {priceLabel}
                                                    </p>

                                                    {product.pricing.type !== "quote" &&
                                                        price != null &&
                                                        product.pricing.baseQuantity != null && (
                                                            <p className="mt-1 text-xs text-[#777]">
                                                                For {product.pricing.baseQuantity}{" "}
                                                                {product.pricing.unit || "pieces"}
                                                            </p>
                                                        )}

                                                    {product.turnaround && (
                                                        <p className="mt-2 text-xs text-[#777]">
                                                            Turnaround: {product.turnaround}
                                                        </p>
                                                    )}

                                                    <div className="mt-5 flex items-center justify-between border-t border-[#181818]/10 pt-4 text-sm font-semibold text-[#6D1A36]">
                                                        <span>
                                                            {product.pricing.type === "quote"
                                                                ? "Request a quote"
                                                                : "Configure print"}
                                                        </span>

                                                        <ArrowUpRight
                                                            size={18}
                                                            aria-hidden="true"
                                                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-black/10 bg-white px-6 py-12 text-center">
                                <h3 className="text-lg font-semibold">
                                    Print products are coming soon.
                                </h3>

                                <p className="mt-2 text-sm text-[#777]">
                                    Explore our other products and services
                                    while we prepare this collection.
                                </p>

                                <Link
                                    href="/shop"
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6D1A36]"
                                >
                                    Explore the shop
                                    <ArrowUpRight size={16} />
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
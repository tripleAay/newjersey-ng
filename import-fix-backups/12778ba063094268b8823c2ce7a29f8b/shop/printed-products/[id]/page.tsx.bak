import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Flame,
  Star,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard components/mainheader";
import DashboardBreadcrumb from "@/components/dashboard components/breadcrumb";
import Footer from "@/components/footer";
import ProductCheckoutSection from "@/components/dashboard components/ProductCheckoutSection";

type ProductSpec = {
  label: string;
  value: string;
};

type ProductData = {
  id: string | number;
  name?: string | null;
  title?: string | null;
  category?: string | null;
  subtitle?: string | null;
  price?: string | number | null;
  status?: string | null;
  description?: string | null;
  image?: string | null;
  images?: string[] | null;
  material?: string | null;
  delivery?: string | null;
  stock?: string | number | null;
  tag?: string | null;
  link?: string | null;
  specs?: ProductSpec[] | string | null;
  rating?: number | null;
  reviewsCount?: number | null;
  isFulfilled?: boolean | null;
  isHotStuff?: boolean | null;
};

async function getProduct(id: string): Promise<ProductData | null> {
  try {
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) return null;

    const res = await fetch(`${protocol}://${host}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.product ?? data ?? null;
  } catch {
    return null;
  }
}

function formatPrice(price?: string | number | null) {
  if (price === null || price === undefined || price === "") {
    return "Price on request";
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

function parseSpecs(specs?: ProductSpec[] | string | null): ProductSpec[] {
  if (!specs) return [];

  if (Array.isArray(specs)) {
    return specs.filter(
      (item) =>
        item &&
        typeof item.label === "string" &&
        typeof item.value === "string"
    );
  }

  if (typeof specs === "string") {
    try {
      const parsed = JSON.parse(specs);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) =>
            item &&
            typeof item.label === "string" &&
            typeof item.value === "string"
        );
      }
      return [];
    } catch {
      return [];
    }
  }

  return [];
}

export default async function PrintedProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050506] text-white">
        <DashboardHeader />

        <div className="border-b border-white/5 px-3 pb-4 pt-30">
          <DashboardBreadcrumb
            items={[
              { label: "Shop", href: "/shop" },
              { label: "Printed Products", href: "/shop/printed-products" },
              { label: "Product" },
            ]}
          />
        </div>

        <main className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/shop/printed-products"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition hover:border-white/25 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
              <h1 className="text-2xl font-semibold tracking-tight">
                Product not found
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                The product you are trying to open does not exist or is no
                longer available.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const title = product.title || product.name || "Printed Product";
  const description =
    product.description ||
    product.subtitle ||
    "A refined printed product designed to carry your brand beautifully into the real world.";

  const primaryGallery = [
    ...(product.image ? [product.image] : []),
    ...((product.images || []).filter(Boolean) as string[]),
  ];

  const gallery = Array.from(new Set(primaryGallery)).filter(Boolean);
  const fallbackGallery =
    gallery.length > 0 ? gallery : ["/images/tote-bag.jpg"];
  const displayPrice = formatPrice(product.price);
  const parsedSpecs = parseSpecs(product.specs);

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <DashboardHeader />

      <div className="border-b border-white/5 px-3 pb-4 pt-30">
        <DashboardBreadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Printed Products", href: "/shop/printed-products" },
            { label: title },
          ]}
        />
      </div>

      <main className="px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <Link
            href="/shop/printed-products"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,204,109,0.10),transparent_35%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />

            <div className="relative grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="space-y-4 p-4 sm:p-6">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
                  <div className="relative min-h-[380px] sm:min-h-[520px] lg:min-h-[640px]">
                    <Image
                      src={fallbackGallery[0]}
                      alt={title}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                  </div>
                </div>

                {fallbackGallery.length > 1 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {fallbackGallery.slice(1).map((img, index) => (
                      <div
                        key={`${img}-${index}`}
                        className="relative aspect-square overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03]"
                      >
                        <Image
                          src={img}
                          alt={`${title} preview ${index + 2}`}
                          fill
                          className="object-cover transition duration-500 hover:scale-[1.03]"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                      {product.category || "Printed Product"}
                    </span>

                    {product.tag ? (
                      <span className="rounded-full border border-[#eadb97]/25 bg-[#eadb97]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#eadb97]">
                        {product.tag}
                      </span>
                    ) : null}

                    {product.isHotStuff ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-red-200">
                        <Flame className="h-3.5 w-3.5" />
                        Hot Stuff
                      </span>
                    ) : null}
                  </div>

                  <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                    {title}
                  </h1>

                  <p className="mt-3 text-lg font-medium text-[#eadb97]">
                    {displayPrice}
                  </p>

                  <p className="mt-5 text-sm leading-8 text-white/68 sm:text-base">
                    {description}
                  </p>

                  {(typeof product.rating === "number" ||
                    typeof product.reviewsCount === "number" ||
                    product.isFulfilled) && (
                    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
                      {typeof product.rating === "number" ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                          <Star className="h-4 w-4 text-[#eadb97]" />
                          <span className="text-white/85">{product.rating}</span>
                        </div>
                      ) : null}

                      {typeof product.reviewsCount === "number" ? (
                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                          {product.reviewsCount} reviews
                        </div>
                      ) : null}

                      {product.isFulfilled ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-200">
                          <CheckCircle2 className="h-4 w-4" />
                          Fulfilled by Fynaro
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Material
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/82">
                      {product.material || "Premium Finish"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Delivery
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/82">
                      {product.delivery || "Made to Order"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/82">
                      {product.status || "Available"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Stock
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/82">
                      {product.stock ?? "Available on request"}
                    </p>
                  </div>
                </div>

                {product.link ? (
                  <div className="mt-6">
                    <Link
                      href={product.link}
                      target="_blank"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d6cc6d] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                    >
                      View Product
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <ProductCheckoutSection
                    product={{
                      id: product.id,
                      price: product.price,
                    }}
                    title={title}
                  />
                )}
              </div>
            </div>
          </section>

          {parsedSpecs.length > 0 ? (
            <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                Product Specifications
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parsedSpecs.map((spec, index) => (
                  <div
                    key={`${spec.label}-${index}`}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      {spec.label}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-white/85">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
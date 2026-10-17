import Link from "next/link";
import { ArrowUpRight, Palette, Printer, Shirt, Sparkles } from "lucide-react";

const departments = [
  {
    label: "Print",
    description: "Business cards, flyers, banners, stickers and packaging.",
    href: "/shop/print",
    cta: "Explore print",
    icon: Printer,
  },
  {
    label: "Apparel",
    description: "Ready-designed clothing. Choose your size and colour.",
    href: "/shop/apparel",
    cta: "Explore apparel",
    icon: Shirt,
  },
  {
    label: "Branding",
    description:
      "Brand identity, signage and branding for vehicles and spaces.",
    href: "/shop/branding",
    cta: "Explore branding",
    icon: Palette,
  },
  {
    label: "Custom Printing",
    description: "Print your artwork on clothing or request design assistance.",
    href: "/shop/custom",
    cta: "Explore custom",
    icon: Sparkles,
  },
];

export default function ShopDepartments() {
  return (
    <section
      aria-labelledby="departments-heading"
      className="border-y border-black/10 bg-[#F4F1E9] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
            Explore NewJersey
          </p>

          <h2
            id="departments-heading"
            className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl"
          >
            What would you like to make?
          </h2>

          <p className="mt-4 text-base leading-7 text-[#625D55]">
            Browse a department or tell us about a custom project.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((department) => {
            const Icon = department.icon;

            return (
              <Link
                key={department.href}
                href={department.href}
                className="group flex min-w-0 flex-col rounded-xl border border-black/10 bg-[#FCFBF8] p-6 transition-colors hover:border-[#F58220] focus-visible:outline-[#181818]"
              >
                <Icon
                  size={25}
                  strokeWidth={1.7}
                  aria-hidden="true"
                  className="text-[#181818]"
                />

                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {department.label}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-[#625D55]">
                  {department.description}
                </p>

                <div className="mt-7 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
                  <span className="text-sm font-semibold">
                    {department.cta}
                  </span>

                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-[#F58220] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

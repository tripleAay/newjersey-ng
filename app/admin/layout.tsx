import type { ReactNode } from "react";
import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  FileImage,
  Images,
  LayoutDashboard,
  PackageCheck,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Truck,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    group: "Store",
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    group: "Store",
  },
  {
    name: "Collections",
    href: "/admin/collections",
    icon: Tags,
    group: "Store",
  },
  {
    name: "Art & Showcase",
    href: "/admin/showcase",
    icon: Images,
    group: "Store",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
    group: "Operations",
  },
  {
    name: "Customer Artwork",
    href: "/admin/artwork",
    icon: FileImage,
    group: "Operations",
  },
  {
    name: "Production",
    href: "/admin/production",
    icon: Boxes,
    group: "Operations",
  },
  {
    name: "Delivery",
    href: "/admin/delivery",
    icon: Truck,
    group: "Operations",
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-[#181818] text-white lg:flex">
          <div className="flex h-[78px] shrink-0 items-center border-b border-white/10 px-7">
            <Link
              href="/admin"
              aria-label="NewJersey.ng admin home"
              className="text-[22px] font-bold tracking-[-0.06em]"
            >
              <span>newjersey</span>
              <span className="text-[#F58220]">.ng</span>
            </Link>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
            {["Store", "Operations"].map((group) => (
              <div key={group} className="mb-7 last:mb-0">
                <p className="px-3 text-xs font-medium uppercase tracking-[0.12em] text-white/50">
                  {group}
                </p>

                <nav
                  aria-label={`${group} navigation`}
                  className="mt-3 space-y-1"
                >
                  {navigation
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <Icon
                            size={18}
                            strokeWidth={1.8}
                            aria-hidden="true"
                            className="shrink-0 text-white/50 group-hover:text-[#F58220]"
                          />

                          {item.name}
                        </Link>
                      );
                    })}
                </nav>
              </div>
            ))}
          </div>

          <div className="shrink-0 border-t border-white/10 p-5">
            <Link
              href="/admin/settings"
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <Settings size={18} aria-hidden="true" />
              Settings
            </Link>

            <Link
              href="/shop"
              className="mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <Store size={18} aria-hidden="true" />
              View storefront
            </Link>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1 lg:pl-[260px]">
          <header className="sticky top-0 z-30 border-b border-black/10 bg-[#FCFBF8]">
            <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div>
                <Link
                  href="/admin"
                  aria-label="NewJersey.ng admin home"
                  className="text-sm font-bold tracking-tight"
                >
                  <span>newjersey</span>
                  <span className="text-[#F58220]">.ng</span>
                </Link>

                <p className="mt-1 text-xs text-[#625D55]">
                  Store management
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/shop"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-3 text-xs font-semibold transition-colors hover:bg-[#F4F1E9] sm:px-4"
                >
                  <Store size={16} aria-hidden="true" />
                  View store
                </Link>

                <Link
                  href="/admin/orders"
                  className="hidden min-h-11 items-center gap-2 rounded-full bg-[#181818] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#363636] sm:inline-flex"
                >
                  <PackageCheck size={16} aria-hidden="true" />
                  Manage orders
                </Link>
              </div>
            </div>

            {/* Mobile and tablet navigation */}
            <div className="overflow-x-auto border-t border-black/10 lg:hidden">
              <nav
                aria-label="Admin navigation"
                className="flex w-max min-w-full gap-1 px-4 py-2"
              >
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-medium text-[#625D55] transition-colors hover:bg-[#F4F1E9] hover:text-[#181818]"
                    >
                      <Icon
                        size={16}
                        aria-hidden="true"
                        className="shrink-0"
                      />

                      {item.name}
                    </Link>
                  );
                })}

                <Link
                  href="/admin/settings"
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-medium text-[#625D55] transition-colors hover:bg-[#F4F1E9] hover:text-[#181818]"
                >
                  <Settings size={16} aria-hidden="true" />
                  Settings
                </Link>
              </nav>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
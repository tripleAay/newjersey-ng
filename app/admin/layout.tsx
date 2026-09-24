import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  FileImage,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Settings,
  Truck,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    name: "Artwork",
    href: "/admin/artwork",
    icon: FileImage,
  },
  {
    name: "Production",
    href: "/admin/production",
    icon: Boxes,
  },
  {
    name: "Delivery",
    href: "/admin/delivery",
    icon: Truck,
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#242424]">
      <div className="flex min-h-screen">
        {/* DESKTOP SIDEBAR */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-[#222] text-white lg:flex">
          {/* Brand */}
          <div className="flex h-[78px] items-center border-b border-white/10 px-7">
            <Link
              href="/admin"
              className="flex items-baseline"
            >
              <span className="text-[21px] font-black tracking-[-1px]">
                newjersey
              </span>

              <span className="ml-[2px] text-[11px] font-bold text-[#FF6B00]">
                .ng
              </span>
            </Link>
          </div>

          {/* Workspace */}
          <div className="px-5 pt-6">
            <p className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Operations
            </p>

            <nav className="mt-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      className="text-white/35 transition group-hover:text-[#FF6B00]"
                    />

                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom */}
          <div className="mt-auto border-t border-white/10 p-5">
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Settings size={16} />
              Settings
            </Link>

            <Link
              href="/shop"
              className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut size={16} />
              View storefront
            </Link>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="min-w-0 flex-1 lg:pl-[260px]">
          {/* TOP HEADER */}
          <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
            <div className="flex min-h-[70px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
                  NewJersey.ng
                </p>

                <p className="mt-0.5 text-sm font-bold">
                  Operations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/orders"
                  className="hidden items-center gap-2 rounded-full bg-[#222] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#FF6B00] sm:inline-flex"
                >
                  <PackageCheck size={14} />
                  Manage orders
                </Link>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6B00] text-xs font-black text-white">
                  NJ
                </div>
              </div>
            </div>

            {/* MOBILE NAVIGATION */}
            <div className="overflow-x-auto border-t border-black/[0.05] lg:hidden">
              <nav className="flex min-w-max gap-1 px-4 py-2">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold text-[#777] transition hover:bg-[#f4f4f2] hover:text-[#222]"
                    >
                      <Icon size={13} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
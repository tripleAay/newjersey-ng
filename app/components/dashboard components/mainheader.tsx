"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useLogout from "@/hooks/useLogout";
import {useAuth} from "@/hooks/useAuth";
import {
  FiShoppingBag,
  FiBell,
  FiHome,
  FiMessageSquare,
  FiPackage,
  FiCreditCard,
  FiMapPin,
  FiLogOut,
  FiStar,
  FiX,
  FiMenu,
  FiLayers,
  FiBox,
  FiMonitor,
  FiPhoneCall,
  FiChevronRight,
} from "react-icons/fi";
import { useCart } from "../../contexts/cartContext";
import NotificationPanel from "@/components/dashboard components/notificationPanel";
import Image from "next/image";

type CartItem = {
  id: number | string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type HeaderProps = {
  userName?: string;
  projectRequestJustCreated?: boolean;
};

type DrawerLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  sublabel?: string;
};


export default function Header({
  userName,
  projectRequestJustCreated = false,
}: HeaderProps) {
  const { items } = useCart();
  // ✅ FIX: Renamed destructured `loading` from useAuth to `authLoading`
  //         to avoid collision with the local `isLocalLoading` state below.
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  // ✅ FIX: Renamed from `loading` / `setLoading` to avoid duplicate identifier.
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
const logout = useLogout();
  useEffect(() => {
    if (userName) {
      setName(userName);
      setIsLocalLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      const stored =
        localStorage.getItem("fullName") ||
        localStorage.getItem("userName") ||
        localStorage.getItem("name");

      if (stored && stored.trim().length > 0) {
        setName(stored);
      }
    }

    setIsLocalLoading(false);
  }, [userName]);

  const cartCount = useMemo(() => {
    return (
      items?.reduce((total: number, item: CartItem) => {
        return total + (item.quantity ?? 1);
      }, 0) ?? 0
    );
  }, [items]);

  const initials = useMemo(() => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  }, [name]);

  const closeAllPanels = () => {
    setProfileOpen(false);
    setNotificationsOpen(false);
    setMessagesOpen(false);
  };

  const primaryLinks: DrawerLink[] = [
    {
      href: "/shop",
      label: "Dashboard",
      icon: <FiHome size={18} />,
      sublabel: "Go back to your main workspace",
    },
    {
      href: "/shop/web-services",
      label: "Web / Mobile App Service",
      icon: <FiMonitor size={18} />,
      sublabel: "Websites, apps and digital builds",
    },
    {
      href: "/shop/services",
      label: "Brand Design Service",
      icon: <FiLayers size={18} />,
      sublabel: "Brand, design and strategic offers",
    },
    {
      href: "/shop/printed-products",
      label: "Printed Product Service",
      icon: <FiBox size={18} />,
      sublabel: "Packaging, print and brand materials",
    },
  ];

  const secondaryLinks: DrawerLink[] = [
    {
      href: "/shop/order",
      label: "Orders",
      icon: <FiPackage size={18} />,
      sublabel: "Track your requests and purchases",
    },
    {
      href: "/shop/cart",
      label: "Cart",
      icon: <FiShoppingBag size={18} />,
      sublabel: "Review selected items",
    },
    {
      href: "/shop/billing",
      label: "Payments",
      icon: <FiCreditCard size={18} />,
      sublabel: "Billing and payment records",
    },
    {
      href: "/addresses",
      label: "Addresses",
      icon: <FiMapPin size={18} />,
      sublabel: "Delivery and contact addresses",
    },
    {
      href: "/shop/reviews",
      label: "Reviews",
      icon: <FiStar size={18} />,
      sublabel: "Feedback and rating history",
    },
    {
      href: "/contact",
      label: "Contact",
      icon: <FiPhoneCall size={18} />,
      sublabel: "Talk to Fynaro directly",
    },
  ];

  // ✅ FIX: Uses renamed `isLocalLoading` instead of the old `loading`
  if (isLocalLoading) return <HeaderSkeleton />;

  return (
    <>
      <header className="fixed left-0 top-0 z-40 w-full border-b border-white/10 bg-black/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/shop" className="flex items-center">
            <Image
              src="/images/fynaro-tech logo.png"
              alt="Fynaro Tech Logo"
              width={220}
              height={80}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:border-[#d6cc6d]/40 hover:bg-[#d6cc6d]/10 sm:flex"
            >
              <FiHome className="text-[17px]" />
            </Link>

            <button
              onClick={() => {
                closeAllPanels();
                setMessagesOpen(true);
              }}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:border-[#d6cc6d]/40 hover:bg-[#d6cc6d]/10 sm:flex"
            >
              <FiMessageSquare className="text-[17px]" />
            </button>

            <button
              onClick={() => {
                setProfileOpen(false);
                setMessagesOpen(false);
                setNotificationsOpen((prev) => !prev);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-[#d6cc6d]/10"
            >
              <FiBell className="text-[17px]" />
              {hasUnreadNotifications && !notificationsOpen && (
                <span className="absolute -right-1 -top-1 h-[10px] w-[10px] rounded-full bg-[#d6cc6d] shadow-[0_0_6px_#d6cc6d]" />
              )}
            </button>

            <Link
              href="/shop/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-[#d6cc6d]/10"
            >
              <FiShoppingBag className="text-[17px]" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#d6cc6d] px-1 text-[9px] font-semibold text-black">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                closeAllPanels();
                setProfileOpen(true);
              }}
              className="hidden items-center gap-2 rounded-full border border-[#d6cc6d]/30 bg-[#d6cc6d]/10 px-2 py-1 transition hover:bg-[#d6cc6d]/20 sm:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d6cc6d] text-[12px] font-semibold text-black">
                {initials}
              </div>
              <span className="max-w-[120px] truncate text-xs font-medium">
                {name}
              </span>
            </button>

            <button
              onClick={() => {
                closeAllPanels();
                setProfileOpen(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-[#d6cc6d]/10 sm:hidden"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      <SlideOver open={profileOpen} onClose={closeAllPanels}>
        <div className="flex h-full flex-col text-white">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d6cc6d] text-sm font-semibold text-black">
                {initials}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {name || "Fynaro Client"}
                </p>
                <p className="text-xs text-white/45">
                  Your workspace and service navigation
                </p>
              </div>
            </div>

            <SpinningCloseButton onDone={closeAllPanels} />
          </div>

          
          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/35">
                Core Services
              </p>

              <div className="space-y-2">
                {primaryLinks.map((item) => (
                  <RowLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    sublabel={item.sublabel}
                  />
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/35">
                Account & Activity
              </p>

              <div className="space-y-2">
                {secondaryLinks.map((item) => (
                  <RowLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    sublabel={item.sublabel}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
             onClick={logout}
            className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:border-[#d6cc6d]/30 hover:bg-[#d6cc6d]/10 hover:text-[#d6cc6d]"
          >
            <FiLogOut />
            Log out
          </button>
        </div>
      </SlideOver>

      <NotificationPanel
        open={notificationsOpen}
        onClose={closeAllPanels}
        userName={name || "Fynaro Client"}
        projectRequestJustCreated={projectRequestJustCreated}
        onUnreadChange={setHasUnreadNotifications}
      />
    </>
  );
}

function SlideOver({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close menu"
      />

      <aside
        className={`absolute right-0 top-0 h-full w-[88%] max-w-[420px] border-l border-white/10 bg-[#070708] px-5 py-6 shadow-[-24px_0_80px_rgba(0,0,0,0.45)] transition duration-300 sm:w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#d6cc6d]/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
        </div>

        <div className="relative h-full">{children}</div>
      </aside>
    </div>
  );
}

function SpinningCloseButton({ onDone }: { onDone: () => void }) {
  const [spin, setSpin] = useState(false);

  return (
    <button
      onClick={() => {
        setSpin(true);
        setTimeout(() => {
          setSpin(false);
          onDone();
        }, 200);
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition hover:border-[#d6cc6d]/30 hover:bg-[#d6cc6d]/10 hover:text-[#d6cc6d]"
      aria-label="Close panel"
    >
      <FiX className={spin ? "animate-spin" : ""} />
    </button>
  );
}

function RowLink({
  href,
  icon,
  label,
  sublabel,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-white transition hover:border-[#d6cc6d]/25 hover:bg-[#d6cc6d]/8"
    >
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-[#d6cc6d]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white group-hover:text-[#f1e7a0]">
          {label}
        </p>
        {sublabel ? (
          <p className="mt-1 text-xs leading-5 text-white/45">{sublabel}</p>
        ) : null}
      </div>

      <FiChevronRight className="mt-1 shrink-0 text-white/30 transition group-hover:text-[#d6cc6d]" />
    </Link>
  );
}

function HeaderSkeleton() {
  return <div className="h-16 w-full border-b border-white/10 bg-black" />;
}

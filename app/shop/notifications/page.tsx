// app/notification/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiTruck,
  FiAlertTriangle,
  FiTag,
  FiArrowLeft,
} from "react-icons/fi";

/* ---------- Types ---------- */

type NotificationType =
  | "order_status"
  | "payment"
  | "delivery"
  | "promotion"
  | "stock"
  | "support";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  unread?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

/* ---------- Mock feed (swap to API later) ---------- */

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "order_status",
    title: "Order #8847-229 confirmed",
    message: "We’re packing your Fynaro Classic White Tee and Urban Cap.",
    timeAgo: "2 min ago",
    unread: true,
    ctaLabel: "View order",
    ctaHref: "/shop/order/ORD-8847-229",
  },
  {
    id: "2",
    type: "delivery",
    title: "Rider is on the way 🚚",
    message:
      "Your package is leaving the hub. Estimated arrival: today, 4–6pm.",
    timeAgo: "45 min ago",
    unread: true,
    ctaLabel: "Track delivery",
    ctaHref: "/shop/order/ORD-8847-229?section=tracking",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment failed on Order #6623-918",
    message:
      "We couldn’t charge your card. Update your payment method to complete the order.",
    timeAgo: "Yesterday",
    unread: false,
    ctaLabel: "Fix payment",
    ctaHref: "/shop/order/ORD-6623-918?section=payment",
  },
  {
    id: "4",
    type: "stock",
    title: "Back in stock: Fynaro Studio Hoodie",
    message: "Your saved item is available again in selected sizes.",
    timeAgo: "2 days ago",
    unread: false,
    ctaLabel: "Shop now",
    ctaHref: "/shop?highlight=hoodie",
  },
  {
    id: "5",
    type: "promotion",
    title: "Print Week: 15% off bulk tees",
    message:
      "Perfect time to print for your team, crew or campaign. Ends Sunday night.",
    timeAgo: "3 days ago",
    unread: false,
    ctaLabel: "Get a quote",
    ctaHref: "/get-quote",
  },
  {
    id: "6",
    type: "support",
    title: "Support ticket updated",
    message: "Your request about size exchange has been updated by support.",
    timeAgo: "5 days ago",
    unread: false,
    ctaLabel: "View ticket",
    ctaHref: "/support/tickets/123",
  },
];

/* ---------- Helpers ---------- */

function iconForType(type: NotificationType) {
  switch (type) {
    case "order_status":
      return <FiCheckCircle className="text-emerald-400" />;
    case "delivery":
      return <FiTruck className="text-sky-400" />;
    case "payment":
      return <FiAlertTriangle className="text-amber-400" />;
    case "promotion":
      return <FiTag className="text-pink-400" />;
    case "stock":
      return <FiTag className="text-violet-300" />;
    case "support":
      return <FiAlertTriangle className="text-blue-300" />;
    default:
      return <FiCheckCircle className="text-neutral-300" />;
  }
}

// Rough grouping based on timeAgo label
function groupLabelFor(
  notif: NotificationItem
): "Today" | "Yesterday" | "This week" | "Earlier" {
  const t = notif.timeAgo.toLowerCase();
  if (t.includes("min ago") || t.includes("hour") || t.includes("today")) {
    return "Today";
  }
  if (t.includes("yesterday")) return "Yesterday";
  if (t.includes("day")) return "This week";
  return "Earlier";
}

type FilterTab = "All" | "Unread" | "Orders" | "Payments" | "Promos" | "Support";

/* ---------- Page ---------- */

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    let list = [...notifications];

    if (activeTab === "Unread") {
      list = list.filter((n) => n.unread);
    } else if (activeTab === "Orders") {
      list = list.filter((n) =>
        ["order_status", "delivery", "stock"].includes(n.type)
      );
    } else if (activeTab === "Payments") {
      list = list.filter((n) => n.type === "payment");
    } else if (activeTab === "Promos") {
      list = list.filter((n) => n.type === "promotion");
    } else if (activeTab === "Support") {
      list = list.filter((n) => n.type === "support");
    }

    return list;
  }, [notifications, activeTab]);

  // Group by time bucket
  const grouped = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {};
    for (const n of filteredNotifications) {
      const label = groupLabelFor(n);
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    }

    const order: Array<"Today" | "Yesterday" | "This week" | "Earlier"> = [
      "Today",
      "Yesterday",
      "This week",
      "Earlier",
    ];

    return order
      .filter((key) => groups[key]?.length)
      .map((key) => ({ label: key, items: groups[key] }));
  }, [filteredNotifications]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <main className="min-h-screen bg-[#050507] text-neutral-50">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* Top row: back + breadcrumb summary */}
        <div className="mb-4 flex items-center justify-between gap-3">
          {/* Back link (left) */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/shop" className="hover:text-neutral-100">
              <span className="inline-flex items-center gap-1">
                <FiArrowLeft className="h-3.5 w-3.5" />
                Back to shop
              </span>
            </Link>
          </div>

          {/* Small header breadcrumb (right, desktop only) */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Link href="/" className="hover:text-neutral-100">
                Home
              </Link>
              <span>/</span>
              <span className="hover:text-neutral-100">Account</span>
              <span>/</span>
              <span className="text-neutral-100">Notifications</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              {notifications.length} update
              {notifications.length === 1 ? "" : "s"} • {unreadCount} unread
            </p>
          </div>
        </div>

        {/* Page header */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              Fynaro
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Notification Center
            </h1>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Stay ahead of your orders, payments and drops — all in one stream.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1.5 text-[11px] text-neutral-200">
              {unreadCount > 0
                ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                : "All caught up ✨"}
            </span>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[11px] font-medium text-neutral-300 hover:text-white underline underline-offset-2"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filters strip */}
        <section className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full border border-neutral-800 bg-neutral-900/80 p-1 text-xs sm:text-sm">
            {(
              ["All", "Unread", "Orders", "Payments", "Promos", "Support"] as FilterTab[]
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  activeTab === tab
                    ? "bg-neutral-100 text-neutral-900 shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tiny stats */}
          <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
            <span className="rounded-full border border-neutral-800 bg-neutral-900/70 px-2.5 py-1">
              Total: {notifications.length}
            </span>
            <span className="rounded-full border border-neutral-800 bg-neutral-900/70 px-2.5 py-1">
              Orders:{" "}
              {
                notifications.filter((n) =>
                  ["order_status", "delivery", "stock"].includes(n.type)
                ).length
              }
            </span>
            <span className="rounded-full border border-neutral-800 bg-neutral-900/70 px-2.5 py-1">
              Payments: {notifications.filter((n) => n.type === "payment").length}
            </span>
          </div>
        </section>

        {/* Notifications list */}
        {filteredNotifications.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/70 px-6 py-10 text-center">
            <p className="text-sm font-medium text-neutral-100">
              No notifications here yet.
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              When your orders, payments or promos update, they’ll show up here.
            </p>
          </div>
        ) : (
          <section className="space-y-5">
            {grouped.map((group) => (
              <div key={group.label}>
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {group.label}
                </h2>

                <div className="space-y-2.5">
                  {group.items.map((notif) => (
                    <article
                      key={notif.id}
                      className={`rounded-2xl border px-3.5 py-3.5 sm:px-4 sm:py-4 text-xs sm:text-[13px] transition-all ${
                        notif.unread
                          ? "border-neutral-500/60 bg-neutral-900"
                          : "border-neutral-800 bg-neutral-950/70"
                      } hover:border-neutral-300/80 hover:bg-neutral-900/90`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/80">
                          {iconForType(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[12px] sm:text-[13px] font-semibold text-neutral-50">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                              {notif.timeAgo}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] sm:text-[12px] text-neutral-300 leading-relaxed">
                            {notif.message}
                          </p>

                          <div className="mt-2 flex items-center gap-3">
                            {notif.ctaHref && notif.ctaLabel && (
                              <Link
                                href={notif.ctaHref}
                                className="inline-flex items-center gap-1 rounded-full border border-neutral-600 bg-neutral-50/5 px-3 py-1.5 text-[11px] font-medium text-neutral-50 hover:border-neutral-100 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                                onClick={() => handleMarkOneRead(notif.id)}
                              >
                                {notif.ctaLabel}
                                <span>↗</span>
                              </Link>
                            )}

                            {notif.unread && (
                              <button
                                type="button"
                                onClick={() => handleMarkOneRead(notif.id)}
                                className="text-[10px] text-neutral-400 hover:text-neutral-200 underline underline-offset-2"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

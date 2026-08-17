"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  FiCheckCircle,
  FiTruck,
  FiAlertTriangle,
  FiTag,
  FiX,
} from "react-icons/fi";

export type NotificationType =
  | "order_status"
  | "payment"
  | "delivery"
  | "promotion"
  | "stock"
  | "support";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  unread?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "order_status",
    title: "Order #8847-229 confirmed",
    message: "We’re packing your Fynaro Classic White Tee and Urban Cap.",
    timeAgo: "2 min ago",
    unread: true,
    ctaLabel: "View order",
    ctaHref: "/order/ORD-8847-229",
  },
  {
    id: "2",
    type: "delivery",
    title: "Rider is on the way 🚚",
    message: "Your package is leaving the hub. Estimated arrival: today, 4–6pm.",
    timeAgo: "45 min ago",
    unread: true,
    ctaLabel: "Track delivery",
    ctaHref: "/order/ORD-8847-229?section=tracking",
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
    ctaHref: "/order/ORD-6623-918?section=payment",
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
];

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

type NotificationPanelProps = {
  open: boolean;
  onClose: () => void;
  userName?: string;
  /** Show alert strip when a project request has just been created */
  projectRequestJustCreated?: boolean;
  /** Notifies parent (header) when unread state changes */
  onUnreadChange?: (hasUnread: boolean) => void;
};

export default function NotificationPanel({
  open,
  onClose,
  userName = "Fynaro Client",
  projectRequestJustCreated = false,
  onUnreadChange,
}: NotificationPanelProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Tell the header whether we still have unread messages
  useEffect(() => {
    onUnreadChange?.(unreadCount > 0);
  }, [unreadCount, onUnreadChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Click-away backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            key="notif-panel"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed right-4 top-16 z-50 w-[320px] sm:w-[360px] rounded-2xl border border-neutral-800 bg-[#050507]/95 backdrop-blur-2xl shadow-[0_18px_48px_rgba(0,0,0,0.75)] overflow-hidden"
          >
            {/* Project Request Alert Strip */}
            {projectRequestJustCreated && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/40 flex items-center gap-2 text-[11px] text-emerald-100"
              >
                <FiCheckCircle className="text-emerald-300 shrink-0" />
                <span className="leading-snug">
                  Project request received. We’ll review your brief and send
                  updates here as things move.
                </span>
              </motion.div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/80">
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Notifications
                </p>
                <p className="text-sm text-neutral-100">
                  Hello, {userName.split(" ")[0]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] text-emerald-300 hover:text-emerald-200 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-neutral-300 border border-white/10">
                  {unreadCount > 0 ? `${unreadCount} new` : "All caught up ✨"}
                </span>
                {/* Cancel / close button */}
                <button
                  onClick={onClose}
                  aria-label="Close notifications"
                  className="ml-1 p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b border-neutral-800/70 text-xs text-neutral-200 last:border-b-0 ${
                    notif.unread ? "bg-white/5" : "bg-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10">
                      {iconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12px] font-semibold text-neutral-50">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                          {notif.timeAgo}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-300 leading-relaxed line-clamp-3">
                        {notif.message}
                      </p>

                      {notif.ctaHref && notif.ctaLabel && (
                        <Link
                          href={notif.ctaHref}
                          className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
                          onClick={onClose}
                        >
                          {notif.ctaLabel}
                          <span>↗</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-800/80 bg-black/30">
              <span className="text-[10px] text-neutral-500">
                You’ll see updates for orders, payments, delivery & projects
                here.
              </span>
              <Link
                href="/notifications"
                className="text-[10px] font-medium text-neutral-200 hover:text-white"
                onClick={onClose}
              >
                View all
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

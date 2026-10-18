"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Bell,
  ClipboardList,
  FileImage,
  Landmark,
  X,
} from "lucide-react";

import { useNotificationSound, NotificationSoundControl } from "@/app/components/newjersey/NotificationSound";

type Notification = {
  id: string;
  category: "order" | "artwork" | "payment";
  title: string;
  message: string;
  href: string;
  read_at: string | null;
  created_at: string;
};

const icons = {
  order: ClipboardList,
  artwork: FileImage,
  payment: Landmark,
};

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNotification(
  value: unknown
): value is Notification {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !["order", "artwork", "payment"].includes(
      String(value.category)
    ) ||
    typeof value.title !== "string" ||
    typeof value.message !== "string" ||
    typeof value.href !== "string" ||
    typeof value.created_at !== "string" ||
    (value.read_at !== null &&
      typeof value.read_at !== "string")
  ) {
    return false;
  }

  return (
    value.href === "/admin" ||
    value.href === "/admin/artworks?status=queue&page=1" ||
    value.href === "/admin/payments?status=submitted&page=1" ||
    /^\/admin\/orders\/[A-Za-z0-9-]+$/.test(value.href)
  );
}

export default function AdminNotifications() {
  const router = useRouter();
  const sound = useNotificationSound("admin");
  const { observe } = sound;
  const pathname = usePathname();
  const panelId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (busyRef.current) return;

    requestRef.current?.abort();

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch("/api/admin/notifications", {
        cache: "no-store",
        signal: controller.signal,
      });

      const result: unknown = await response.json();

      if (
        !response.ok ||
        !isRecord(result) ||
        !Array.isArray(result.notifications) ||
        !result.notifications.every(isNotification) ||
        typeof result.unreadCount !== "number" ||
        !Number.isSafeInteger(result.unreadCount) ||
        result.unreadCount < 0
      ) {
        throw new Error("Invalid response.");
      }

      if (controller.signal.aborted || !mountedRef.current) {
        return;
      }

      observe(result.notifications);
      setItems(result.notifications);
      setUnread(result.unreadCount);
      setError("");
    } catch {
      if (!controller.signal.aborted && mountedRef.current) {
        setError("Notifications could not be refreshed.");
      }
    } finally {
      if (!controller.signal.aborted && mountedRef.current) {
        setLoading(false);
      }
    }
  }, [observe]);

  useEffect(() => {
    mountedRef.current = true;
    void refresh();

    function refreshVisible() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    const timer = window.setInterval(refreshVisible, 30000);

    window.addEventListener("focus", refreshVisible);
    document.addEventListener("visibilitychange", refreshVisible);

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshVisible);
      document.removeEventListener(
        "visibilitychange",
        refreshVisible
      );
    };
  }, [refresh]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    void refresh();

    function outside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, refresh]);

  async function markRead(notification?: Notification) {
    if (busyRef.current) return;

    busyRef.current = true;
    setBusy(true);
    requestRef.current?.abort();

    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      5000
    );

    try {
      if (!notification || !notification.read_at) {
        const response = await fetch(
          "/api/admin/notifications",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              notification
                ? { id: notification.id }
                : { all: true }
            ),
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error("Update failed.");

        if (mountedRef.current) {
          const now = new Date().toISOString();

          setItems((current) =>
            current.map((item) =>
              !notification || item.id === notification.id
                ? { ...item, read_at: item.read_at || now }
                : item
            )
          );

          setUnread((current) =>
            notification ? Math.max(0, current - 1) : 0
          );
          setError("");
        }
      }
    } catch {
      if (mountedRef.current && !notification) {
        setError("Unable to mark notifications as read.");
      }
    } finally {
      window.clearTimeout(timer);
      busyRef.current = false;

      if (mountedRef.current) {
        setBusy(false);
        setLoading(false);

        if (notification) {
          setOpen(false);
          router.push(notification.href);
          router.refresh();
        } else {
          void refresh();
        }
      }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={
          unread
            ? `Admin notifications, ${unread} unread`
            : "Admin notifications"
        }
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
      >
        <Bell size={20} strokeWidth={1.7} aria-hidden="true" />

        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 min-w-4 rounded-full bg-[#181818] px-1 text-center text-[10px] font-semibold leading-4 text-white"
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <section
          id={panelId}
          aria-label="Admin notifications"
          aria-busy={busy}
          className="fixed left-4 right-4 top-[72px] z-50 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.10)] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[380px]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold">
                Notifications
              </h2>
              <p className="mt-1 text-xs text-[#7A7368]">
                {unread} unread
              </p>
            </div>

            <button
              type="button"
              aria-label="Close notifications"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#F5F4F0]"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>

          <div className="flex justify-between gap-3 px-4 py-1">
            <button
              type="button"
              disabled={busy}
              onClick={() => void refresh()}
              className="min-h-11 px-1 text-xs font-medium text-[#625D55] disabled:opacity-50"
            >
              Refresh
            </button>

            <button
              type="button"
              disabled={busy || unread === 0}
              onClick={() => void markRead()}
              className="min-h-11 px-1 text-xs font-medium text-[#625D55] disabled:opacity-40"
            >
              Mark all read
            </button>
          </div>

          <NotificationSoundControl sound={sound} />

          {error && (
            <p
              role="status"
              className="px-5 py-3 text-xs leading-6 text-red-700"
            >
              {error}
            </p>
          )}

          {loading ? (
            <p role="status" className="px-5 py-8 text-sm text-[#625D55]">
              Loading updates…
            </p>
          ) : items.length === 0 ? (
            <div className="px-5 py-8">
              <p className="text-sm font-medium">
                No updates yet.
              </p>
              <p className="mt-2 text-xs leading-6 text-[#625D55]">
                New orders, artwork uploads, and payment
                submissions will appear here.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60dvh] divide-y divide-black/5 overflow-y-auto">
              {items.map((item) => {
                const Icon = icons[item.category];

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void markRead(item)}
                      className={[
                        "flex w-full items-start gap-3 px-5 py-4 text-left",
                        "hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220]",
                        "disabled:opacity-60",
                        item.read_at ? "bg-white" : "bg-[#FAF9F6]",
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-[#625D55]"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold leading-6">
                            {item.title}
                          </span>

                          {!item.read_at && (
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58220]">
                              <span className="sr-only">Unread</span>
                            </span>
                          )}
                        </span>

                        <span className="mt-1 block break-words text-xs leading-6 text-[#625D55]">
                          {item.message}
                        </span>

                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">
                          Open
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
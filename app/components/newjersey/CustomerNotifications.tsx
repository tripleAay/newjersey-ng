"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Bell } from "lucide-react";

import { useNotificationSound, NotificationSoundControl } from "@/app/components/newjersey/NotificationSound";

type Notification = {
  id: string;
  order_id: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  href: string;
  actionLabel: string;
};

type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    !UUID.test(value.id) ||
    typeof value.order_id !== "string" ||
    !UUID.test(value.order_id) ||
    typeof value.title !== "string" ||
    typeof value.message !== "string" ||
    (value.read_at !== null &&
      typeof value.read_at !== "string") ||
    typeof value.created_at !== "string" ||
    typeof value.actionLabel !== "string"
  ) {
    return false;
  }

  return (
    value.href === `/shop/order/${value.order_id}` ||
    value.href === `/shop/artwork/${value.order_id}`
  );
}

export default function CustomerNotifications({
  open,
  onToggle,
  onClose,
}: Props) {
  const router = useRouter();
  const sound = useNotificationSound("customer");
  const { observe } = sound;
  const panelId = useId();

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(false);

  const controllerRef = useRef<AbortController | null>(
    null
  );
  const readControllerRef = useRef<AbortController | null>(
    null
  );
  const busyRef = useRef(false);
  const mountedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (busyRef.current) return;

    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/notifications", {
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
        throw new Error("Invalid notification response.");
      }

      if (
        controller.signal.aborted ||
        !mountedRef.current
      ) {
        return;
      }

      observe(result.notifications);
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
      setError("");
    } catch {
      if (
        controller.signal.aborted ||
        !mountedRef.current
      ) {
        return;
      }

      setError("Notifications could not be refreshed.");
    } finally {
      if (
        !controller.signal.aborted &&
        mountedRef.current
      ) {
        setLoading(false);
      }
    }
  }, [observe]);

  useEffect(() => {
    mountedRef.current = true;

    void refresh();

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    const interval = window.setInterval(
      refreshWhenVisible,
      30000
    );

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener(
      "visibilitychange",
      refreshWhenVisible
    );

    return () => {
      mountedRef.current = false;

      window.clearInterval(interval);
      window.removeEventListener(
        "focus",
        refreshWhenVisible
      );
      document.removeEventListener(
        "visibilitychange",
        refreshWhenVisible
      );

      controllerRef.current?.abort();
      readControllerRef.current?.abort();
    };
  }, [refresh]);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  async function openNotification(
    notification: Notification
  ) {
    if (busyRef.current) return;

    busyRef.current = true;
    setOpening(true);

    controllerRef.current?.abort();

    const controller = new AbortController();
    readControllerRef.current = controller;

    const timeout = window.setTimeout(
      () => controller.abort(),
      5000
    );

    try {
      if (!notification.read_at) {
        const response = await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: notification.id,
          }),
          signal: controller.signal,
        });

        if (response.ok && mountedRef.current) {
          const now = new Date().toISOString();

          setNotifications((current) =>
            current.map((item) =>
              item.id === notification.id
                ? { ...item, read_at: now }
                : item
            )
          );

          setUnreadCount((count) =>
            Math.max(0, count - 1)
          );
        }
      }
    } catch {
      // Navigation remains available if marking as read fails.
    } finally {
      window.clearTimeout(timeout);

      if (readControllerRef.current === controller) {
        readControllerRef.current = null;
      }

      busyRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
        setOpening(false);
        onClose();

        router.push(notification.href);
        router.refresh();
      }
    }
  }

  return (
    <>
      <button
        type="button"
        data-notification-toggle
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={onToggle}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
      >
        <span className="relative">
          <Bell size={20} aria-hidden="true" />

          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-2 min-w-4 rounded-full bg-[#181818] px-1 text-center text-[10px] font-bold leading-4 text-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      </button>

      {open && (
        <section
          id={panelId}
          aria-label="Notifications"
          aria-busy={opening}
          className="absolute right-0 top-full z-50 mt-3 w-[360px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-3">
            <h2 className="text-sm font-semibold">
              Notifications
            </h2>

            <button
              type="button"
              disabled={opening}
              onClick={() => void refresh()}
              className="min-h-11 rounded-lg px-2 text-xs font-medium text-[#625D55] hover:bg-[#F5F4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] disabled:opacity-50"
            >
              Refresh
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
            <p
              role="status"
              className="px-5 py-7 text-sm text-[#625D55]"
            >
              Loading notifications…
            </p>
          ) : notifications.length === 0 ? (
            <div className="px-5 py-8">
              <p className="text-sm font-medium">
                You’re all caught up.
              </p>

              <p className="mt-2 text-xs leading-6 text-[#625D55]">
                Order updates and artwork feedback will
                appear here.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-black/5 overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    disabled={opening}
                    onClick={() =>
                      void openNotification(notification)
                    }
                    className={[
                      "block w-full px-5 py-5 text-left transition-colors",
                      "hover:bg-[#F5F4F0]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F58220]",
                      "disabled:opacity-60",
                      notification.read_at
                        ? "bg-white"
                        : "bg-[#FAF9F6]",
                    ].join(" ")}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold leading-6">
                        {notification.title}
                      </span>

                      {!notification.read_at && (
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58220]">
                          <span className="sr-only">
                            Unread
                          </span>
                        </span>
                      )}
                    </span>

                    <span className="mt-2 block text-xs leading-6 text-[#625D55]">
                      {notification.message}
                    </span>

                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold">
                      {notification.actionLabel}
                      <ArrowUpRight
                        size={13}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
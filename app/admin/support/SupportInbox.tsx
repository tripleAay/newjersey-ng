"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import SupportConversation from "@/app/components/newjersey/experience/SupportConversation";
import type { SupportThread } from "@/app/lib/newjersey/support/model";
export default function SupportInbox() {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const mounted = useRef(false);
  const controllers = useRef<Set<AbortController>>(new Set());
  const sequence = useRef(0);
  const load = useCallback(
    async (before?: string) => {
      const request = new AbortController();
      controllers.current.add(request);
      const token = before ? sequence.current : ++sequence.current;
      try {
        const response = await fetch(
          `/api/admin/support${before ? `?before=${encodeURIComponent(before)}` : ""}`,
          { cache: "no-store", signal: request.signal },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        if (!mounted.current || token !== sequence.current) return;
        setThreads((old) =>
          Array.from(
            new Map(
              [...old, ...data.threads].map((thread: SupportThread) => [
                thread.id,
                thread,
              ]),
            ).values(),
          ).sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
        );
        setMore(data.hasMore);
        setCursor(data.cursor);
        setError("");
      } catch (error) {
        if (!request.signal.aborted && mounted.current)
          setError(
            error instanceof Error ? error.message : "Unable to load support.",
          );
      } finally {
        controllers.current.delete(request);
        if (mounted.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [cursor],
  );
  // Poll newest conversations; older pages remain available in the list.
  const loader = useRef(load);
  loader.current = load;
  useEffect(() => {
    mounted.current = true;
    void loader.current();
    const refresh = () => {
      if (document.visibilityState === "visible") void loader.current();
    };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => {
      mounted.current = false;
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      controllers.current.forEach((controller) => controller.abort());
      controllers.current.clear();
    };
  }, []);
  const changed = useCallback(() => {
    void loader.current();
    window.dispatchEvent(new Event("admin-notifications-updated"));
  }, []);
  return (
    <div className="mt-7 grid min-h-[620px] overflow-hidden rounded-2xl border border-black/10 bg-white lg:grid-cols-[290px_1fr]">
      <section
        aria-label="Customer conversations"
        className={`border-b border-black/10 lg:border-b-0 lg:border-r ${selected ? "hidden lg:block" : ""}`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
          <h2 className="text-xs font-semibold">Conversations</h2>
          <button
            type="button"
            onClick={() => void load()}
            className="min-h-10 text-xs underline"
          >
            Refresh
          </button>
        </div>
        {error && (
          <p role="alert" className="p-4 text-xs leading-6 text-red-800">
            {error}
          </p>
        )}
        <div className="max-h-[560px] overflow-y-auto">
          {loading ? (
            <p className="p-5 text-xs text-[#746E65]">Loading conversations…</p>
          ) : !threads.length ? (
            <p className="p-5 text-xs leading-6 text-[#746E65]">
              Customer messages will appear here. No conversations yet.
            </p>
          ) : (
            threads.map((thread) => {
              const unread =
                thread.last_customer_at &&
                (!thread.admin_read_at ||
                  Date.parse(thread.last_customer_at) >
                    Date.parse(thread.admin_read_at));
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelected(thread.id)}
                  aria-pressed={selected === thread.id}
                  className={`block w-full border-b border-black/5 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6B00] ${selected === thread.id ? "bg-[#FFF1E5]" : "hover:bg-[#FCFBF8]"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">
                      {thread.customer_name || "Customer"}
                    </span>
                    {unread && (
                      <span className="rounded-full bg-[#FF6B00] px-2 py-1 text-[9px] font-semibold">
                        Unread
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block text-[10px] capitalize text-[#746E65]">
                    {thread.status === "closed" ? "Resolved" : "Open"} ·{" "}
                    {new Date(thread.updated_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </button>
              );
            })
          )}
          {more && cursor && (
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => {
                setLoadingMore(true);
                void load(cursor);
              }}
              className="min-h-12 w-full text-xs underline disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load more conversations"}
            </button>
          )}
        </div>
      </section>
      <section
        aria-label="Selected conversation"
        className={`flex h-[620px] min-h-0 min-w-0 flex-col ${!selected ? "hidden lg:flex" : ""}`}
      >
        {selected ? (
          <>
            <div className="flex items-center gap-3 border-b border-black/10 px-4 py-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Back to conversations"
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 lg:hidden"
              >
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-xs font-semibold">
                {threads.find((thread) => thread.id === selected)
                  ?.customer_name || "Customer"}{" "}
                · {selected.slice(0, 8)}
              </h2>
            </div>
            <SupportConversation
              key={selected}
              scope="admin"
              threadId={selected}
              onUpdate={changed}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <MessageCircle
              size={30}
              strokeWidth={1.2}
              className="text-[#B94700]"
            />
            <h2 className="mt-5 text-sm font-semibold">
              One conversation at a time.
            </h2>
            <p className="mt-2 max-w-xs text-xs leading-6 text-[#746E65]">
              Select a customer message to read, reply and resolve it.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

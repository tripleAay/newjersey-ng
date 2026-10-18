"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, RotateCw } from "lucide-react";
import { notifyShop } from "@/app/components/dashboard components/common/fynaroToast";
import {
  mergeMessages,
  type SupportPayload,
  type SupportMessage,
} from "@/app/lib/newjersey/support/model";
type Props = {
  scope: "customer" | "admin";
  threadId?: string;
  onUpdate?: () => void;
  initialDraft?: string;
};
export default function SupportConversation({
  scope,
  threadId,
  onUpdate,
  initialDraft = "",
}: Props) {
  const endpoint =
    scope === "admin"
      ? `/api/admin/support?thread=${encodeURIComponent(threadId ?? "")}`
      : "/api/support";
  const [payload, setPayload] = useState<SupportPayload | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signedOut, setSignedOut] = useState(false);
  const [draft, setDraft] = useState(initialDraft);
  const [sending, setSending] = useState(false);
  const [olderBusy, setOlderBusy] = useState(false);
  const [changing, setChanging] = useState(false);
  const [readTick, setReadTick] = useState(0);
  const pending = useRef<{ body: string; id: string } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const read = useRef("");
  const list = useRef<SupportMessage[]>([]);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const refresh = useCallback(async () => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    try {
      const response = await fetch(endpoint, {
        cache: "no-store",
        signal: request.signal,
      });
      const data = await response.json();
      if (request.signal.aborted || !mounted.current) return;
      if (response.status === 401 || response.status === 403) {
        setSignedOut(true);
        setPayload(null);
        setMessages([]);
        list.current = [];
        setDraft("");
        pending.current = null;
        return;
      }
      if (!response.ok)
        throw new Error(data.message || "Conversation could not be loaded.");
      const next = data as SupportPayload;
      setSignedOut(false);
      const atBottom =
        !scroller.current ||
        scroller.current.scrollHeight -
          scroller.current.scrollTop -
          scroller.current.clientHeight <
          90;
      const previousCount = list.current.length;
      const merged = mergeMessages(list.current, next.messages);
      list.current = merged;
      setMessages(merged);
      setPayload((previous) =>
        previous && list.current.length > next.messages.length
          ? { ...next, cursor: previous.cursor, hasOlder: previous.hasOlder }
          : next,
      );
      setError("");
      if (atBottom || !previousCount)
        requestAnimationFrame(() => {
          if (scroller.current)
            scroller.current.scrollTop = scroller.current.scrollHeight;
        });
    } catch (error) {
      if (!request.signal.aborted && mounted.current)
        setError(
          error instanceof Error
            ? error.message
            : "Conversation could not be loaded.",
        );
    } finally {
      if (!request.signal.aborted && mounted.current) setLoading(false);
    }
  }, [endpoint]);
  useEffect(() => {
    mounted.current = true;
    setPayload(null);
    setMessages([]);
    list.current = [];
    setDraft(initialDraft);
    pending.current = null;
    read.current = "";
    setLoading(true);
    void refresh();
    const poll = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = setInterval(poll, 20000);
    document.addEventListener("visibilitychange", poll);
    window.addEventListener("focus", poll);
    return () => {
      mounted.current = false;
      clearInterval(timer);
      controller.current?.abort();
      document.removeEventListener("visibilitychange", poll);
      window.removeEventListener("focus", poll);
    };
  }, [refresh, initialDraft]);
  // Mark only the last message that has actually been loaded, never an arbitrary time.
  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (
      !latest ||
      !payload?.thread ||
      document.visibilityState !== "visible" ||
      latest.id === read.current ||
      (scroller.current &&
        scroller.current.scrollHeight -
          scroller.current.scrollTop -
          scroller.current.clientHeight >
          90)
    )
      return;
    read.current = latest.id;
    const abort = new AbortController();
    void fetch(scope === "admin" ? "/api/admin/support" : "/api/support", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: payload.thread.id,
        lastMessageId: latest.id,
      }),
      signal: abort.signal,
    })
      .then((response) => {
        if (response.ok) {
          window.dispatchEvent(new Event("admin-notifications-updated"));
          onUpdateRef.current?.();
        } else read.current = "";
      })
      .catch(() => {
        read.current = "";
      });
    return () => abort.abort();
  }, [messages, payload?.thread?.id, scope, readTick]);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (sending || !draft.trim()) return;
    setSending(true);
    setError("");
    const text = draft.trim();
    if (!pending.current || pending.current.body !== text)
      pending.current = { body: text, id: crypto.randomUUID() };
    const request = pending.current;
    try {
      const response = await fetch(
        scope === "admin" ? "/api/admin/support" : "/api/support",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: request.body,
            requestId: request.id,
            threadId,
          }),
        },
      );
      const data = await response.json();
      if (!mounted.current) return;
      if (response.status === 401 || response.status === 403) {
        setSignedOut(true);
        setPayload(null);
        setMessages([]);
        setDraft("");
        return;
      }
      if (!response.ok)
        throw new Error(data.message || "Message could not be sent.");
      setDraft("");
      pending.current = null;
      notifyShop(
        scope === "admin" ? "Reply sent" : "Message sent",
        "Saved in this conversation.",
        { toastId: "support-sent" },
      );
      await refresh();
      onUpdateRef.current?.();
      window.dispatchEvent(new Event("admin-notifications-updated"));
    } catch (error) {
      if (mounted.current)
        setError(
          error instanceof Error
            ? error.message
            : "Message could not be confirmed. Retry this same message.",
        );
    } finally {
      if (mounted.current) setSending(false);
    }
  }
  async function older() {
    if (!payload?.cursor || olderBusy) return;
    setOlderBusy(true);
    const beforeHeight = scroller.current?.scrollHeight ?? 0;
    try {
      const response = await fetch(
        `${endpoint}${endpoint.includes("?") ? "&" : "?"}before=${encodeURIComponent(payload.cursor)}`,
        { cache: "no-store" },
      );
      const data = await response.json();
      if (!mounted.current) return;
      if (!response.ok) throw new Error(data.message);
      list.current = mergeMessages(data.messages, list.current);
      setMessages(list.current);
      setPayload((previous) =>
        previous
          ? { ...previous, hasOlder: data.hasOlder, cursor: data.cursor }
          : previous,
      );
      requestAnimationFrame(() => {
        if (scroller.current)
          scroller.current.scrollTop =
            scroller.current.scrollHeight - beforeHeight;
      });
    } catch {
      if (mounted.current) setError("Older messages could not be loaded.");
    } finally {
      if (mounted.current) setOlderBusy(false);
    }
  }
  async function resolve() {
    if (!payload?.thread || changing) return;
    setChanging(true);
    try {
      const response = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          status: payload.thread.status === "closed" ? "open" : "closed",
          expectedUpdatedAt: payload.thread.updated_at,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (mounted.current) {
        await refresh();
        onUpdateRef.current?.();
      }
    } catch (error) {
      if (mounted.current)
        setError(
          error instanceof Error
            ? error.message
            : "Unable to update conversation.",
        );
    } finally {
      if (mounted.current) setChanging(false);
    }
  }
  if (signedOut)
    return (
      <div className="p-6">
        <h3 className="text-sm font-semibold">
          Keep your conversation private.
        </h3>
        <p className="mt-3 text-xs leading-6 text-[#746E65]">
          Sign in to message NewJersey and return to the same conversation
          later.
        </p>
        <Link
          href="/login?next=%2Fshop"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#FF6B00] px-5 text-xs font-semibold"
        >
          Sign in to continue
        </Link>
        <p className="mt-5 text-xs leading-6 text-[#746E65]">
          Prefer email?{" "}
          <a href="mailto:hello@newjersey.ng" className="underline">
            hello@newjersey.ng
          </a>
        </p>
      </div>
    );
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-2">
        <p className="text-[10px] text-[#746E65]">
          {payload?.thread?.status === "closed"
            ? "Resolved · sending a message reopens this conversation"
            : "Saved conversation · replies appear here"}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {scope === "admin" && payload?.thread && (
            <button
              type="button"
              disabled={changing}
              onClick={() => void resolve()}
              className="min-h-9 text-[10px] font-semibold underline disabled:opacity-50"
            >
              {payload.thread.status === "closed" ? "Reopen" : "Resolve"}
            </button>
          )}
          <button
            type="button"
            aria-label="Refresh conversation"
            onClick={() => void refresh()}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        onScroll={() => setReadTick((value) => value + 1)}
        role="log"
        aria-label="Support conversation"
        aria-live={loading ? "off" : "polite"}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {loading ? (
          <p className="text-xs text-[#746E65]">Loading your conversation…</p>
        ) : messages.length === 0 ? (
          <div className="rounded-xl bg-[#F7F5F0] p-4">
            <p className="text-sm font-semibold">What can we help you with?</p>
            <p className="mt-2 text-xs leading-6 text-[#746E65]">
              Tell us about the product or include your NJ order reference.
              Please leave out passwords, OTPs and banking credentials.
            </p>
          </div>
        ) : null}
        {payload?.hasOlder && (
          <button
            type="button"
            disabled={olderBusy}
            onClick={() => void older()}
            className="mb-4 min-h-10 w-full text-xs underline disabled:opacity-50"
          >
            {olderBusy ? "Loading…" : "Load older messages"}
          </button>
        )}
        <div className="space-y-3">
          {messages.map((message) => {
            const mine = message.sender_role === scope;
            return (
              <div
                key={message.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 ${mine ? "rounded-br-md bg-[#FFF1E5]" : "rounded-bl-md border border-black/5 bg-[#F7F6F3]"}`}
                >
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-[#8A8379]">
                    {mine
                      ? "You"
                      : scope === "customer"
                        ? "NewJersey team"
                        : "Customer"}
                  </p>
                  <p className="whitespace-pre-wrap break-words text-xs leading-6 text-[#494540] [overflow-wrap:anywhere]">
                    {message.body}
                  </p>
                  <time
                    dateTime={message.created_at}
                    className="mt-2 block text-[9px] text-[#8A8379]"
                  >
                    {new Date(message.created_at).toLocaleString("en-NG", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="border-t border-red-100 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800"
        >
          {error}
        </p>
      )}
      <form
        onSubmit={send}
        className="shrink-0 border-t border-black/10 bg-white p-4"
      >
        <label className="sr-only" htmlFor={`support-message-${scope}`}>
          Your message
        </label>
        <textarea
          id={`support-message-${scope}`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={3000}
          required
          disabled={sending}
          rows={2}
          placeholder="Write to the NewJersey team…"
          className="block w-full resize-none rounded-xl border border-black/15 bg-[#FCFBF8] px-3 py-2 text-base leading-6 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[9px] text-[#8A8379]">
            {draft.length}/3000 · No attachments
          </span>
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FF6B00] px-5 text-xs font-semibold disabled:opacity-45"
          >
            {sending ? "Sending…" : "Send"}
            <Send size={13} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}

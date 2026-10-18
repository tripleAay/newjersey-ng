"use client";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
export default function Newsletter() {
  const id = useId();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.get("email"),
          consent: fields.get("consent") === "on",
          website: fields.get("website"),
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.message || "We couldn’t save your request. Please try again.",
        );
      }
      setDone(true);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="w-full bg-[#FF6B00] text-[#181818]"
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12 lg:py-9">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[.2em]">
            The NewJersey list
          </p>
          <h2
            id={`${id}-title`}
            className="mt-2 text-2xl font-semibold tracking-tight"
          >
            Good things, worth hearing about.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-black/75">
            Product releases, print ideas and selected offers. Join the list for
            future email updates.
          </p>
        </div>
        <div>
          {done ? (
            <div
              role="status"
              className="rounded-2xl border border-black/15 bg-white/25 p-5"
            >
              <Check size={22} aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold">
                Thanks. Your request has been received.
              </p>
              <p className="mt-2 text-xs leading-6">
                No confirmation email has been sent. Email updates haven’t
                started yet; we’ll verify your address before sending marketing.
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label htmlFor={`${id}-email`} className="text-xs font-semibold">
                Email address
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  disabled={pending}
                  aria-describedby={error ? `${id}-error` : undefined}
                  className="min-h-12 min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-60"
                />
                <button
                  disabled={pending}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#181818] px-5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF6B00] disabled:opacity-60"
                >
                  {pending ? "Joining…" : "Join"}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
              <label className="mt-3 flex items-start gap-2 text-xs leading-6">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  disabled={pending}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#181818]"
                />
                <span>
                  I’d like NewJersey.ng email updates. I can unsubscribe from
                  future emails. Read our{" "}
                  <Link
                    href="/privacy-policy"
                    className="rounded-sm underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-black"
                  >
                    privacy policy
                  </Link>
                  .
                </span>
              </label>
              <div hidden aria-hidden="true">
                <label>
                  Leave empty
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              {error && (
                <p
                  id={`${id}-error`}
                  role="alert"
                  className="mt-3 rounded-lg bg-white p-3 text-xs text-red-800"
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

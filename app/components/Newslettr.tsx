"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const id = useId();
  const busy = useRef(false);

  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
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
          data?.message || "Couldn’t subscribe. Please try again.",
        );
      }

      setDone(true);
      form.reset();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Please try again.",
      );
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
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-10">
        <div>
          <h2
            id={`${id}-title`}
            className="text-xl font-semibold tracking-tight"
          >
            Stay in print.
          </h2>

          <p className="mt-1 text-xs text-black/75">
            New releases, print ideas and selected offers.
          </p>
        </div>

        {done ? (
          <div role="status" className="flex items-start gap-2">
            <Check
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-semibold">
                Thanks. Your request is received.
              </p>
              <p className="mt-1 text-xs text-black/75">
                We’ll verify your email before sending updates.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>

            <div className="flex gap-2">
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="Your email address"
                disabled={pending}
                aria-describedby={`${id}-consent${
                  error ? ` ${id}-error` : ""
                }`}
                className="h-11 min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#181818] px-5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF6B00] disabled:opacity-60"
              >
                {pending ? "Joining…" : "Join"}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <input
                id={`${id}-consent-input`}
                name="consent"
                type="checkbox"
                required
                disabled={pending}
                aria-describedby={`${id}-consent`}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#181818]"
              />

              <p
                id={`${id}-consent`}
                className="text-[10px] leading-4 text-black/80"
              >
                <label htmlFor={`${id}-consent-input`}>
                  Email me updates. Unsubscribe anytime.
                </label>{" "}
                <Link
                  href="/privacy-policy"
                  className="rounded-sm underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  Privacy policy
                </Link>
                .
              </p>
            </div>

            <div hidden aria-hidden="true">
              <label>
                Leave empty
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            {error && (
              <p
                id={`${id}-error`}
                role="alert"
                className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-red-800"
              >
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
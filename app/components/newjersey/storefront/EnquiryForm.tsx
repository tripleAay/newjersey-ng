"use client";
import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { sendBrandingEnquiry } from "@/app/shop/branding/[slug]/actions";
export default function EnquiryForm({
  slug,
  department,
}: {
  slug: string;
  department: "print" | "branding";
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reference, setReference] = useState("");
  const key = useRef("");
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    key.current ||= crypto.randomUUID();
    try {
      const result = await sendBrandingEnquiry({
        slug,
        department,
        key: key.current,
        name: String(f.get("name") || ""),
        phone: String(f.get("phone") || ""),
        brief: String(f.get("brief") || ""),
        location: String(f.get("location") || ""),
      });
      if (result.error) setError(result.error);
      else if (result.id) setReference(result.id);
    } catch {
      setError("Unable to send your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const field =
    "mt-2 block min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base";
  return reference ? (
    <div
      role="status"
      className="rounded-xl border border-[#FF6B00]/20 bg-white p-6"
    >
      <h2 className="text-xl font-semibold">Your request is with us.</h2>
      <p className="mt-3 text-sm leading-7 text-[#625D55]">
        We’ll contact you to confirm the dimensions, materials, scope and price.
        No payment has been requested.
      </p>
      <p className="mt-4 break-all text-xs">Reference: {reference}</p>
    </div>
  ) : (
    <form
      onSubmit={send}
      className="rounded-2xl border border-black/10 bg-white p-6"
    >
      <h2 className="text-xl font-semibold">Tell us what you need.</h2>
      <p className="mt-3 text-sm leading-7 text-[#625D55]">
        Send your brief directly to the NewJersey team. We’ll confirm the scope
        and price before you commit.
      </p>
      <fieldset disabled={busy} className="mt-5 space-y-4">
        {[
          ["name", "Your name", 120],
          ["phone", "Contact number", 30],
          ["location", "Delivery or installation location", 300],
        ].map(([key, label, max]) => (
          <label key={String(key)} className="block text-sm font-medium">
            {label}
            <input
              name={String(key)}
              type={key === "phone" ? "tel" : "text"}
              required
              maxLength={Number(max)}
              className={field}
            />
          </label>
        ))}
        <label className="block text-sm font-medium">
          Dimensions, quantity and what you have in mind
          <textarea
            name="brief"
            required
            minLength={15}
            maxLength={3000}
            rows={5}
            className={field}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-800">
            {error}{" "}
            <Link
              href={
                "/login?next=" +
                encodeURIComponent("/shop/" + department + "/" + slug)
              }
              className="underline"
            >
              Sign in
            </Link>
          </p>
        )}
        <button
          disabled={busy}
          className="min-h-12 w-full rounded-full bg-[#FF6B00] px-5 text-sm font-semibold text-[#181818] disabled:opacity-50"
        >
          {busy ? "Sending…" : "Request a quote"}
        </button>
      </fieldset>
    </form>
  );
}

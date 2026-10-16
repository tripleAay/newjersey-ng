"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

type Props = {
  paymentId: string;
};

const field =
  "mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818] focus:outline-none focus:ring-2 focus:ring-black/10";

export default function PaymentEvidenceForm({
  paymentId,
}: Props) {
  const router = useRouter();
  const busyRef = useRef(false);

  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busyRef.current || submitted) return;

    const form = new FormData(event.currentTarget);
    const file = form.get("file");

    if (
      !(file instanceof File) ||
      file.size === 0 ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Choose a non-empty receipt up to 10 MB.");
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setError("");

    form.set("paymentId", paymentId);

    try {
      const response = await fetch("/api/payments/evidence", {
        method: "POST",
        body: form,
      });

      const result: unknown = await response.json();

      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        result.success !== true
      ) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "Unable to submit your receipt.";

        throw new Error(message);
      }

      setSubmitted(true);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your receipt."
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <p
        role="status"
        className="mt-8 rounded-xl bg-[#EDF3ED] p-4 text-sm leading-7 text-[#426247]"
      >
        Receipt submitted. Your payment is awaiting
        verification.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 border-t border-black/10 pt-7"
    >
      <h3 className="text-lg font-semibold">
        Already transferred?
      </h3>

      <p className="mt-2 text-sm leading-7 text-[#625D55]">
        Submit your receipt so we can match the transfer
        to your order.
      </p>

      <fieldset disabled={busy} className="mt-6 space-y-5">
        <label className="block text-sm font-medium">
          Sender’s account name
          <input
            name="senderName"
            required
            maxLength={160}
            autoComplete="name"
            className={field}
            placeholder="Name on the account you paid from"
          />
        </label>

        <label className="block text-sm font-medium">
          Bank transaction reference
          <span className="ml-1 font-normal text-[#7A7368]">
            (optional)
          </span>

          <input
            name="transferReference"
            maxLength={160}
            className={field}
            placeholder="Reference from your bank receipt"
          />
        </label>

        <label className="block text-sm font-medium">
          Transfer receipt
          <input
            name="file"
            type="file"
            required
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#F5F4F0] file:px-3 file:py-2 file:text-sm"
          />

          <span className="mt-2 block text-xs leading-6 text-[#7A7368]">
            PDF, JPG, PNG or WebP. Maximum 10 MB.
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {busy ? "Submitting…" : "Submit transfer receipt"}
        </button>
      </fieldset>

      <p className="mt-4 text-xs leading-6 text-[#7A7368]">
        Submitting a receipt does not confirm payment.
        We verify the credit in our bank account first.
      </p>
    </form>
  );
}
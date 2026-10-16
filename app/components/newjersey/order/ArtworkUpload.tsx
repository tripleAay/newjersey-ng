"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Upload } from "lucide-react";

type Props = {
  orderId: string;
  artworkId: string;
};

export default function ArtworkUpload({
  orderId,
  artworkId,
}: Props) {
  const router = useRouter();
  const busyRef = useRef(false);

  const [busy, setBusy] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busyRef.current || uploaded) return;

    setError("");

    const form = new FormData(event.currentTarget);
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setError("Choose your artwork file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("Your file must be 20 MB or smaller.");
      return;
    }

    form.set("artworkId", artworkId);

    busyRef.current = true;
    setBusy(true);

    try {
      const response = await fetch(
        `/api/orders/${orderId}/artwork`,
        {
          method: "POST",
          body: form,
        }
      );

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
            : "Upload could not be confirmed. Refresh to check its status.";

        throw new Error(message);
      }

      setUploaded(true);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Upload could not be confirmed. Refresh to check its status."
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  if (uploaded) {
    return (
      <p
        role="status"
        className="mt-5 flex items-center gap-2 text-sm font-medium"
      >
        <Check size={18} className="text-[#F58220]" aria-hidden="true" />
        Artwork uploaded and awaiting review.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <label className="block text-sm font-medium">
        Production-ready artwork
        <input
          type="file"
          name="file"
          required
          disabled={busy}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="mt-3 block w-full rounded-xl border border-black/15 bg-[#F4F1E9]/50 p-3 text-sm text-[#625D55] file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-medium file:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        />
      </label>

      <p className="mt-2 text-xs leading-6 text-[#625D55]">
        PDF, JPG, PNG or WebP. Maximum 20 MB.
        Uploading does not approve the artwork for production.
      </p>

      {error && (
        <p role="alert" className="mt-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F58220] px-5 text-sm font-semibold text-[#181818] transition-colors hover:bg-[#D96B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Upload size={17} aria-hidden="true" />
        {busy ? "Uploading artwork…" : "Upload artwork"}
      </button>

      <p role="status" aria-live="polite" className="mt-2 text-xs text-[#625D55]">
        {busy ? "Please keep this page open until the upload finishes." : ""}
      </p>
    </form>
  );
}
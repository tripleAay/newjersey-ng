"use client";
import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { field, button } from "./model";
export default function FileUpload({
  id,
  kind,
  expected,
}: {
  id: string;
  kind: "reference" | "delivery";
  expected: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const body = new FormData(event.currentTarget);
    body.set("order_id", id);
    body.set("kind", kind);
    body.set("expected", expected);
    try {
      const response = await fetch("/api/design-files", {
        method: "POST",
        body,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      formRef.current?.reset();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form ref={formRef} onSubmit={upload} className="mt-5 space-y-3">
      <label className="block text-sm font-medium">
        {kind === "reference"
          ? "Add a reference"
          : "Deliver the finished design"}
        <input
          name="file"
          type="file"
          required
          accept={
            kind === "reference"
              ? ".pdf,.jpg,.jpeg,.png,.webp"
              : ".pdf,.jpg,.jpeg,.png,.webp,.zip"
          }
          className={field}
        />
      </label>
      <p className="text-xs leading-6 text-[#625D55]">
        {kind === "reference"
          ? "Up to 3 references. PDF, JPG, PNG or WebP; 10 MB each."
          : "One file per delivery. PDF, JPG, PNG, WebP or a ZIP of source files; 20 MB maximum."}
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}
      <button disabled={busy} className={button}>
        {busy
          ? "Uploading…"
          : kind === "reference"
            ? "Upload reference"
            : "Send finished design"}
      </button>
    </form>
  );
}

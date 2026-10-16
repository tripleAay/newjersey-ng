import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const runtime = "nodejs";

const BUCKET = "newjersey-payment-evidence";
const MAX_BYTES = 10 * 1024 * 1024;

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const headers = {
  "Cache-Control": "private, no-store",
};

function reply(message: string, status: number) {
  return NextResponse.json(
    { message },
    { status, headers }
  );
}

function detectFile(bytes: Uint8Array) {
  const matches = (signature: number[], offset = 0) =>
    signature.every(
      (value, index) => bytes[offset + index] === value
    );

  if (matches([0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return { mime: "application/pdf", extension: "pdf" };
  }

  if (matches([0xff, 0xd8, 0xff])) {
    return { mime: "image/jpeg", extension: "jpg" };
  }

  if (matches([137, 80, 78, 71, 13, 10, 26, 10])) {
    return { mime: "image/png", extension: "png" };
  }

  if (
    matches([82, 73, 70, 70]) &&
    matches([87, 69, 66, 80], 8)
  ) {
    return { mime: "image/webp", extension: "webp" };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");

    if (origin && origin !== request.nextUrl.origin) {
      return reply("Invalid request origin.", 403);
    }

    const auth = await createClient();

    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser();

    if (authError || !user) {
      return reply("Please sign in to continue.", 401);
    }

    const contentLength = Number(
      request.headers.get("content-length")
    );

    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_BYTES + 1024 * 1024
    ) {
      return reply("Choose a file no larger than 10 MB.", 413);
    }

    let form: FormData;

    try {
      form = await request.formData();
    } catch {
      return reply("Invalid upload request.", 400);
    }

    const paymentId = form.get("paymentId");
    const senderName = form.get("senderName");
    const transferReference = form.get("transferReference");
    const file = form.get("file");

    if (
      typeof paymentId !== "string" ||
      !UUID.test(paymentId) ||
      typeof senderName !== "string" ||
      !senderName.trim() ||
      senderName.trim().length > 160 ||
      typeof transferReference !== "string" ||
      transferReference.trim().length > 160 ||
      !(file instanceof File)
    ) {
      return reply("Enter the sender name and select a receipt.", 400);
    }

    if (file.size === 0 || file.size > MAX_BYTES) {
      return reply("Choose a non-empty file up to 10 MB.", 400);
    }

    const supabase = getSupabaseAdmin();

    const { data: payment, error: paymentError } =
      await supabase
        .from("order_payments")
        .select("id, status")
        .eq("id", paymentId)
        .eq("customer_id", user.id)
        .maybeSingle();

    if (paymentError) throw paymentError;

    if (!payment) {
      return reply("Payment not found.", 404);
    }

    if (payment.status !== "pending") {
      return reply(
        "This payment is no longer awaiting submission. Refresh the page.",
        409
      );
    }

    const bytes = new Uint8Array(
      await file.arrayBuffer()
    );

    const detected = detectFile(bytes);

    if (!detected) {
      return reply("Upload a PDF, JPG, PNG or WebP receipt.", 400);
    }

    const storagePath =
      `${user.id}/${payment.id}/` +
      `${randomUUID()}.${detected.extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, bytes, {
        contentType: detected.mime,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const fileName =
      file.name
        .replace(/[/\\\u0000-\u001f\u007f]/g, "_")
        .slice(0, 200) ||
      `receipt.${detected.extension}`;

    const { error: submitError } = await supabase.rpc(
      "submit_bank_transfer",
      {
        p_payment_id: payment.id,
        p_customer_id: user.id,
        p_sender_name: senderName.trim(),
        p_transfer_reference: transferReference.trim(),
        p_storage_path: storagePath,
        p_file_name: fileName,
        p_mime_type: detected.mime,
        p_file_size: file.size,
      }
    );

    if (submitError) {
      console.error("[Payment evidence save]", submitError);

      // A database-raised rejection guarantees that this
      // submission did not commit. Other errors may be
      // ambiguous, so preserve the private file.
      if (submitError.code === "P0001") {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);

        if (cleanupError) {
          console.error("[Payment evidence cleanup]", cleanupError);
        }

        return reply(
          "This payment cannot accept a submission. Refresh the page to check its status.",
          409
        );
      }

      return reply(
        "Unable to confirm your submission. Refresh the page before trying again.",
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Transfer evidence submitted for verification.",
      },
      { headers }
    );
  } catch (error) {
    console.error("[Payment evidence upload]", error);

    return reply(
      "Unable to upload your receipt. Please try again.",
      500
    );
  }
}
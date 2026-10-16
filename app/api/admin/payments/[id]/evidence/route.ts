import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const headers = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
};

export async function GET(
  _request: Request,
  { params }: Context
) {
  const current = await getCurrentAdmin();

  if (!current) {
    return NextResponse.json(
      { message: "Please sign in." },
      { status: 401, headers }
    );
  }

  if (!["owner", "admin"].includes(current.profile.role)) {
    return NextResponse.json(
      { message: "Payment access is not permitted." },
      { status: 403, headers }
    );
  }

  const { id } = await params;

  if (!UUID.test(id)) {
    return NextResponse.json(
      { message: "Receipt not found." },
      { status: 404, headers }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: payment, error } = await supabase
      .from("order_payments")
      .select("evidence_storage_path, evidence_file_name")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    if (!payment?.evidence_storage_path) {
      return NextResponse.json(
        { message: "Receipt not found." },
        { status: 404, headers }
      );
    }

    const { data: signed, error: signedError } =
      await supabase.storage
        .from("newjersey-payment-evidence")
        .createSignedUrl(
          payment.evidence_storage_path,
          60,
          {
            download: payment.evidence_file_name || "receipt",
          }
        );

    if (signedError || !signed) {
      throw signedError || new Error("No download URL.");
    }

    return new NextResponse(null, {
      status: 302,
      headers: {
        ...headers,
        Location: signed.signedUrl,
      },
    });
  } catch (error) {
    console.error("[Payment receipt download]", error);

    return NextResponse.json(
      { message: "Unable to download this receipt." },
      { status: 500, headers }
    );
  }
}
import { NextResponse } from "next/server";

import { requireAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "newjersey-order-artworks";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: Context
) {
  // Keep authorization outside the catch so Next.js
  // can process its login redirect.
  const current = await requireAdmin();

  if (
    !["owner", "admin", "production"].includes(
      current.profile.role
    )
  ) {
    return NextResponse.json(
      { message: "Access denied." },
      { status: 403 }
    );
  }

  const { id } = await params;

  if (!UUID.test(id)) {
    return NextResponse.json(
      { message: "Artwork not found." },
      { status: 404 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: artwork, error } = await supabase
      .from("order_artworks")
      .select("storage_path, file_name")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    if (!artwork?.storage_path) {
      return NextResponse.json(
        { message: "No uploaded file is available." },
        { status: 404 }
      );
    }

    const { data, error: linkError } =
      await supabase.storage
        .from(BUCKET)
        .createSignedUrl(
          artwork.storage_path,
          60,
          {
            download:
              artwork.file_name || "customer-artwork",
          }
        );

    if (linkError) throw linkError;

    if (!data?.signedUrl) {
      throw new Error("Download link was not returned.");
    }

    const response = NextResponse.redirect(
      data.signedUrl,
      302
    );

    response.headers.set(
      "Cache-Control",
      "private, no-store"
    );
    response.headers.set("Referrer-Policy", "no-referrer");

    return response;
  } catch (error) {
    console.error("[Admin artwork download]", error);

    return NextResponse.json(
      { message: "Unable to open this artwork file." },
      {
        status: 500,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }
}
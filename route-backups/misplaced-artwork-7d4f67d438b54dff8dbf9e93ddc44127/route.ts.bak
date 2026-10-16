import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const runtime = "nodejs";

const BUCKET = "newjersey-order-artworks";
const MAX_BYTES = 20 * 1024 * 1024;

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Context = {
  params: Promise<{
    orderNumber: string;
  }>;
};

function detectFile(bytes: Uint8Array) {
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return {
      mime: "application/pdf",
      extension: "pdf",
    };
  }

  if (
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return {
      mime: "image/jpeg",
      extension: "jpg",
    };
  }

  const pngSignature = [
    137, 80, 78, 71, 13, 10, 26, 10,
  ];

  if (
    pngSignature.every(
      (value, index) => bytes[index] === value
    )
  ) {
    return {
      mime: "image/png",
      extension: "png",
    };
  }

  const decoder = new TextDecoder();

  if (
    decoder.decode(bytes.slice(0, 4)) === "RIFF" &&
    decoder.decode(bytes.slice(8, 12)) === "WEBP"
  ) {
    return {
      mime: "image/webp",
      extension: "webp",
    };
  }

  return null;
}

export async function POST(
  request: NextRequest,
  context: Context
) {
  try {
    const origin = request.headers.get("origin");

    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { message: "Invalid request origin." },
        { status: 403 }
      );
    }

    const { orderNumber: id } = await context.params;

    if (!UUID.test(id)) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    const auth = await createClient();

    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          message:
            "Please sign in to upload your artwork.",
        },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .select("id, status")
        .eq("id", id)
        .eq("customer_id", user.id)
        .maybeSingle();

    if (orderError) throw orderError;

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    if (
      ![
        "submitted",
        "under-review",
        "awaiting-artwork",
      ].includes(order.status)
    ) {
      return NextResponse.json(
        {
          message:
            "Artwork uploads are closed for this order.",
        },
        { status: 409 }
      );
    }

    const contentLength = Number(
      request.headers.get("content-length")
    );

    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_BYTES + 1024 * 1024
    ) {
      return NextResponse.json(
        {
          message:
            "Choose a file no larger than 20 MB.",
        },
        { status: 413 }
      );
    }

    let form: FormData;

    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        { message: "Invalid upload request." },
        { status: 400 }
      );
    }

    const artworkId = form.get("artworkId");
    const file = form.get("file");

    if (
      typeof artworkId !== "string" ||
      !UUID.test(artworkId) ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        { message: "Choose a valid artwork file." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          message:
            "Choose a non-empty file no larger than 20 MB.",
        },
        { status: 400 }
      );
    }

    const { data: artwork, error: artworkError } =
      await supabase
        .from("order_artworks")
        .select(
          "id, status, updated_at, order_item_id"
        )
        .eq("id", artworkId)
        .eq("order_id", order.id)
        .maybeSingle();

    if (artworkError) throw artworkError;

    if (!artwork || !artwork.order_item_id) {
      return NextResponse.json(
        { message: "Artwork record not found." },
        { status: 404 }
      );
    }

    if (
      !["pending", "revision-required"].includes(
        artwork.status
      )
    ) {
      return NextResponse.json(
        {
          message:
            "This artwork has already been submitted for review.",
        },
        { status: 409 }
      );
    }

    const { data: item, error: itemError } =
      await supabase
        .from("order_items")
        .select("id")
        .eq("id", artwork.order_item_id)
        .eq("order_id", order.id)
        .eq("artwork_type", "customer-supplied")
        .maybeSingle();

    if (itemError) throw itemError;

    if (!item) {
      return NextResponse.json(
        {
          message:
            "This item does not accept customer artwork.",
        },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(
      await file.arrayBuffer()
    );

    const detected = detectFile(bytes);

    if (!detected) {
      return NextResponse.json(
        {
          message:
            "Upload a PDF, JPG, PNG or WebP file.",
        },
        { status: 400 }
      );
    }

    const storagePath =
      `${user.id}/${order.id}/${artwork.id}/` +
      `${randomUUID()}.${detected.extension}`;

    const { error: uploadError } =
      await supabase.storage
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
      `artwork.${detected.extension}`;

    const { data: saved, error: saveError } =
      await supabase
        .from("order_artworks")
        .update({
          storage_path: storagePath,
          public_url: null,
          file_name: fileName,
          file_size: file.size,
          mime_type: detected.mime,
          status: "uploaded",
          updated_at: new Date().toISOString(),
        })
        .eq("id", artwork.id)
        .eq("order_id", order.id)
        .eq("status", artwork.status)
        .eq("updated_at", artwork.updated_at)
        .select("id")
        .maybeSingle();

    if (saveError) {
      console.error(
        "[Artwork metadata save]",
        saveError
      );

      return NextResponse.json(
        {
          message:
            "Unable to confirm your upload. Refresh the page to check its status before trying again.",
        },
        { status: 500 }
      );
    }

    if (!saved) {
      const { error: cleanupError } =
        await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);

      if (cleanupError) {
        console.error(
          "[Unused artwork cleanup]",
          cleanupError
        );
      }

      return NextResponse.json(
        {
          message:
            "The artwork record changed during upload. Refresh the page.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Artwork uploaded. It is awaiting review.",
    });
  } catch (error) {
    console.error(
      "[NewJersey artwork upload]",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to upload artwork. Please try again.",
      },
      { status: 500 }
    );
  }
}
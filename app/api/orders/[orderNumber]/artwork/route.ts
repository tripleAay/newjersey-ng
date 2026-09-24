import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { getSupabaseAdmin } from "@/app/lib/supabase/admin";

export const runtime =
  "nodejs";

const BUCKET =
  "order-artwork";

const MAX_FILE_SIZE =
  15 * 1024 * 1024;

const ALLOWED_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ]);

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

function sanitizeFileName(
  fileName: string
) {
  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase() ??
    "";

  const base =
    fileName
      .replace(
        /\.[^/.]+$/,
        ""
      )
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9-_]+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      )
      .slice(
        0,
        80
      ) || "artwork";

  return extension
    ? `${base}.${extension}`
    : base;
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: RouteContext
) {
  try {
    const {
      orderNumber,
    } =
      await params;

    const normalizedOrderNumber =
      decodeURIComponent(
        orderNumber
      )
        .trim()
        .toUpperCase();

    const formData =
      await request.formData();

    const file =
      formData.get(
        "file"
      );

    const artworkId =
      formData
        .get(
          "artworkId"
        )
        ?.toString()
        .trim();

    if (
      !artworkId
    ) {
      return NextResponse.json(
        {
          success:
            false,
          message:
            "Artwork record is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !(file instanceof
        File)
    ) {
      return NextResponse.json(
        {
          success:
            false,
          message:
            "Select an artwork file.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size <=
      0
    ) {
      return NextResponse.json(
        {
          success:
            false,
          message:
            "The selected file is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success:
            false,
          message:
            "Artwork must be 15 MB or smaller.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.has(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,
          message:
            "Upload a JPG, PNG, WebP or PDF file.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      getSupabaseAdmin();

    const {
      data: order,
      error:
        orderError,
    } =
      await supabase
        .from(
          "orders"
        )
        .select(
          "id, order_number, status"
        )
        .eq(
          "order_number",
          normalizedOrderNumber
        )
        .maybeSingle();

    if (
      orderError ||
      !order
    ) {
      console.error(
        "[NewJersey] order lookup:",
        orderError
      );

      return NextResponse.json(
        {
          success:
            false,
          message:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data:
        artwork,
      error:
        artworkError,
    } =
      await supabase
        .from(
          "order_artworks"
        )
        .select(
          `
            id,
            order_id,
            order_item_id,
            storage_path,
            status
          `
        )
        .eq(
          "id",
          artworkId
        )
        .eq(
          "order_id",
          order.id
        )
        .maybeSingle();

    if (
      artworkError ||
      !artwork
    ) {
      console.error(
        "[NewJersey] artwork lookup:",
        artworkError
      );

      return NextResponse.json(
        {
          success:
            false,
          message:
            "Artwork request not found for this order.",
        },
        {
          status: 404,
        }
      );
    }

    const oldStoragePath =
      artwork.storage_path;

    const safeName =
      sanitizeFileName(
        file.name
      );

    const storagePath =
      [
        order.id,
        artwork.order_item_id ??
          "general",
        artwork.id,
        `${crypto.randomUUID()}-${safeName}`,
      ].join("/");

    const buffer =
      await file.arrayBuffer();

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(BUCKET)
        .upload(
          storagePath,
          buffer,
          {
            contentType:
              file.type,
            upsert:
              false,
          }
        );

    if (
      uploadError
    ) {
      console.error(
        "[NewJersey] storage upload:",
        uploadError
      );

      return NextResponse.json(
        {
          success:
            false,
          message:
            "Unable to upload artwork.",
        },
        {
          status: 500,
        }
      );
    }

    const now =
      new Date().toISOString();

    const {
      error:
        updateError,
    } =
      await supabase
        .from(
          "order_artworks"
        )
        .update({
          file_name:
            file.name,

          storage_path:
            storagePath,

          mime_type:
            file.type,

          file_size:
            file.size,

          status:
            "uploaded",

          updated_at:
            now,
        })
        .eq(
          "id",
          artwork.id
        )
        .eq(
          "order_id",
          order.id
        );

    if (
      updateError
    ) {
      await supabase.storage
        .from(BUCKET)
        .remove([
          storagePath,
        ]);

      console.error(
        "[NewJersey] artwork DB update:",
        updateError
      );

      return NextResponse.json(
        {
          success:
            false,
          message:
            "Unable to attach artwork to this order.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      oldStoragePath &&
      oldStoragePath !==
        storagePath
    ) {
      const {
        error:
          cleanupError,
      } =
        await supabase.storage
          .from(
            BUCKET
          )
          .remove([
            oldStoragePath,
          ]);

      if (
        cleanupError
      ) {
        console.error(
          "[NewJersey] old artwork cleanup:",
          cleanupError
        );
      }
    }

    const {
      data:
        artworkRecords,
      error:
        artworkCheckError,
    } =
      await supabase
        .from(
          "order_artworks"
        )
        .select(
          "id, status, storage_path"
        )
        .eq(
          "order_id",
          order.id
        );

    if (
      artworkCheckError
    ) {
      console.error(
        "[NewJersey] artwork completion check:",
        artworkCheckError
      );
    } else {
      const records =
        artworkRecords ??
        [];

      const allUploaded =
        records.length >
          0 &&
        records.every(
          (
            record
          ) =>
            Boolean(
              record.storage_path
            ) &&
            [
              "uploaded",
              "reviewing",
              "approved",
            ].includes(
              record.status
            )
        );

      if (
        allUploaded &&
        order.status ===
          "awaiting-artwork"
      ) {
        const {
          error:
            statusError,
        } =
          await supabase
            .from(
              "orders"
            )
            .update({
              status:
                "under-review",

              updated_at:
                now,
            })
            .eq(
              "id",
              order.id
            )
            .eq(
              "status",
              "awaiting-artwork"
            );

        if (
          statusError
        ) {
          console.error(
            "[NewJersey] order status update:",
            statusError
          );
        }
      }
    }

    return NextResponse.json({
      success: true,

      message:
        "Artwork uploaded successfully.",

      artwork: {
        id:
          artwork.id,

        fileName:
          file.name,

        mimeType:
          file.type,

        fileSize:
          file.size,

        status:
          "uploaded",
      },
    });
  } catch (error) {
    console.error(
      "[NewJersey] artwork upload:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        message:
          "Unable to upload artwork.",
      },
      {
        status: 500,
      }
    );
  }
}
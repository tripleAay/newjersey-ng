import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getSupabaseAdmin,
} from "@/app/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const {
      orderNumber,
    } = await context.params;

    const normalizedOrderNumber =
      decodeURIComponent(
        orderNumber
      )
        .trim()
        .toUpperCase();

    if (
      !normalizedOrderNumber
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order number is required.",
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
      error,
    } = await supabase
      .from("orders")
      .select(
        `
          id,
          order_number,
          customer_full_name,
          customer_phone,
          customer_email,
          customer_organization,
          delivery_method,
          delivery_state,
          delivery_city,
          delivery_address,
          delivery_landmark,
          project_name,
          preferred_deadline,
          production_instructions,
          item_count,
          subtotal,
          design_fee,
          delivery_fee,
          final_total,
          status,
          created_at,
          updated_at,
          order_items (
            id,
            cart_item_id,
            product_id,
            product_slug,
            product_name,
            product_image,
            quantity,
            base_price,
            options_total,
            unit_price,
            total_price,
            selections,
            artwork_type,
            design_fee,
            created_at,
            order_artworks (
              id,
              file_name,
              storage_path,
              mime_type,
              file_size,
              status,
              notes,
              created_at,
              updated_at
            )
          )
        `
      )
      .eq(
        "order_number",
        normalizedOrderNumber
      )
      .maybeSingle();

    if (error) {
      console.error(
        "[NewJersey] fetch order error",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to retrieve the order.",
        },
        {
          status: 500,
        }
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "[NewJersey] fetch order error",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to retrieve the order.",
      },
      {
        status: 500,
      }
    );
  }
}
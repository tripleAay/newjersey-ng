import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getSupabaseAdmin,
} from "@/app/lib/supabase/admin";

import type {
  CartItem,
  CreateOrderPayload,
  OrderStatus,
} from "@/app/types/commerce";

export const runtime = "nodejs";

function generateOrderNumber() {
  const now = new Date();

  const year = now
    .getUTCFullYear()
    .toString()
    .slice(-2);

  const month = String(
    now.getUTCMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getUTCDate()
  ).padStart(2, "0");

  const random = crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase();

  return `NJ-${year}${month}${day}-${random}`;
}

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

function isMoney(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

function validateCartItem(
  item: CartItem
) {
  if (!item) {
    return false;
  }

  if (
    !item.cartItemId?.trim() ||
    !item.productId?.trim() ||
    !item.slug?.trim() ||
    !item.name?.trim()
  ) {
    return false;
  }

  if (
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ) {
    return false;
  }

  if (
    !isMoney(item.basePrice) ||
    !isMoney(item.optionsTotal) ||
    !isMoney(item.unitPrice) ||
    !isMoney(item.totalPrice)
  ) {
    return false;
  }

  if (
    !Array.isArray(item.selections)
  ) {
    return false;
  }

  return true;
}

function validatePayload(
  payload: CreateOrderPayload
) {
  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return "Invalid order request.";
  }

  if (
    !payload.customer?.fullName?.trim()
  ) {
    return "Customer name is required.";
  }

  if (
    !payload.customer.phone?.trim()
  ) {
    return "Phone number is required.";
  }

  if (
    !payload.customer.email?.trim()
  ) {
    return "Email address is required.";
  }

  if (
    !isValidEmail(
      payload.customer.email.trim()
    )
  ) {
    return "Enter a valid email address.";
  }

  if (
    !payload.brief?.projectName?.trim()
  ) {
    return "Project name is required.";
  }

  if (
    !Array.isArray(payload.items) ||
    payload.items.length === 0
  ) {
    return "Your order has no items.";
  }

  if (
    payload.items.some(
      (item) =>
        !validateCartItem(item)
    )
  ) {
    return "One or more order items are invalid.";
  }

  if (
    payload.delivery?.method !==
      "delivery" &&
    payload.delivery?.method !==
      "pickup"
  ) {
    return "Select a delivery method.";
  }

  if (
    payload.delivery.method ===
    "delivery"
  ) {
    if (
      !payload.delivery.state?.trim()
    ) {
      return "Delivery state is required.";
    }

    if (
      !payload.delivery.city?.trim()
    ) {
      return "Delivery city is required.";
    }

    if (
      !payload.delivery.address?.trim()
    ) {
      return "Delivery address is required.";
    }
  }

  return null;
}

function determineInitialStatus(
  items: CartItem[]
): OrderStatus {
  const requiresCustomerArtwork =
    items.some(
      (item) =>
        item.artwork?.type ===
        "customer-supplied"
    );

  if (requiresCustomerArtwork) {
    return "awaiting-artwork";
  }

  return "under-review";
}

export async function POST(
  request: NextRequest
) {
  const supabase =
    getSupabaseAdmin();

  let createdOrderId:
    | string
    | null = null;

  try {
    const payload =
      (await request.json()) as CreateOrderPayload;

    const validationError =
      validatePayload(payload);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message:
            validationError,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * TEMPORARY:
     *
     * Product pricing is still coming
     * from the configured cart.
     *
     * Once the product catalogue itself
     * lives in Supabase, reconstruct
     * prices here from product IDs and
     * option IDs.
     */

    const serverSubtotal =
      payload.items.reduce(
        (total, item) =>
          total +
          item.totalPrice,
        0
      );

    const orderNumber =
      generateOrderNumber();

    const status =
      determineInitialStatus(
        payload.items
      );

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        order_number:
          orderNumber,

        customer_full_name:
          payload.customer.fullName.trim(),

        customer_phone:
          payload.customer.phone.trim(),

        customer_email:
          payload.customer.email
            .trim()
            .toLowerCase(),

        customer_organization:
          payload.customer.organization?.trim() ||
          null,

        delivery_method:
          payload.delivery.method,

        delivery_state:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.state?.trim() ||
              null
            : null,

        delivery_city:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.city?.trim() ||
              null
            : null,

        delivery_address:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.address?.trim() ||
              null
            : null,

        delivery_landmark:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.landmark?.trim() ||
              null
            : null,

        project_name:
          payload.brief.projectName.trim(),

        preferred_deadline:
          payload.brief.deadline ||
          null,

        production_instructions:
          payload.brief.instructions?.trim() ||
          null,

        item_count:
          payload.items.length,

        subtotal:
          serverSubtotal,

        design_fee: 0,

        delivery_fee: 0,

        final_total: null,

        status,
      })
      .select(
        `
          id,
          order_number,
          status,
          subtotal,
          created_at
        `
      )
      .single();

    if (
      orderError ||
      !order
    ) {
      console.error(
        "[NewJersey] order insert error",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to save the order.",
        },
        {
          status: 500,
        }
      );
    }

    createdOrderId =
      order.id;

    const orderItems =
      payload.items.map(
        (item) => ({
          order_id:
            order.id,

          cart_item_id:
            item.cartItemId,

          product_id:
            item.productId,

          product_slug:
            item.slug,

          product_name:
            item.name,

          product_image:
            item.image || null,

          quantity:
            item.quantity,

          base_price:
            item.basePrice,

          options_total:
            item.optionsTotal,

          unit_price:
            item.unitPrice,

          total_price:
            item.totalPrice,

          selections:
            item.selections,

          artwork_type:
            item.artwork?.type ||
            null,

          design_fee:
            item.artwork?.designFee ||
            0,
        })
      );

    const {
      data: insertedItems,
      error: itemsError,
    } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select(
        `
          id,
          artwork_type
        `
      );

    if (
      itemsError ||
      !insertedItems
    ) {
      console.error(
        "[NewJersey] order item insert error",
        itemsError
      );

      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          order.id
        );

      createdOrderId = null;

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to save the order items.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Create pending artwork records
     * only for jobs where the customer
     * said they already have artwork.
     */

    const artworkRecords =
      insertedItems
        .filter(
          (item) =>
            item.artwork_type ===
            "customer-supplied"
        )
        .map(
          (item) => ({
            order_id:
              order.id,

            order_item_id:
              item.id,

            status:
              "pending",
          })
        );

    if (
      artworkRecords.length >
      0
    ) {
      const {
        error: artworkError,
      } = await supabase
        .from(
          "order_artworks"
        )
        .insert(
          artworkRecords
        );

      if (artworkError) {
        console.error(
          "[NewJersey] artwork record insert error",
          artworkError
        );

        await supabase
          .from("orders")
          .delete()
          .eq(
            "id",
            order.id
          );

        createdOrderId = null;

        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to prepare artwork records.",
          },
          {
            status: 500,
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Production request created.",

        order: {
          id:
            order.id,

          orderNumber:
            order.order_number,

          status:
            order.status,

          subtotal:
            Number(
              order.subtotal
            ),

          createdAt:
            order.created_at,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[NewJersey] create order error",
      error
    );

    /*
     * Cleanup if an unexpected failure
     * happened after the order row was
     * created.
     */

    if (createdOrderId) {
      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          createdOrderId
        );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create the production request.",
      },
      {
        status: 500,
      }
    );
  }
}
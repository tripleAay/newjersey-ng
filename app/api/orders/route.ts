import {
  NextRequest,
  NextResponse,
} from "next/server";

import type {
  CartItem,
  CreateOrderPayload,
  NewJerseyOrder,
} from "@/app/types/commerce";

function generateOrderNumber() {
  const now = new Date();

  const year = now
    .getFullYear()
    .toString()
    .slice(-2);

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const random = crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 6)
    .toUpperCase();

  return `NJ-${year}${month}${day}-${random}`;
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function validMoney(
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
  if (!item.cartItemId) {
    return false;
  }

  if (!item.productId) {
    return false;
  }

  if (!item.slug) {
    return false;
  }

  if (!item.name) {
    return false;
  }

  if (
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ) {
    return false;
  }

  if (!validMoney(item.basePrice)) {
    return false;
  }

  if (!validMoney(item.optionsTotal)) {
    return false;
  }

  if (!validMoney(item.unitPrice)) {
    return false;
  }

  if (!validMoney(item.totalPrice)) {
    return false;
  }

  if (!Array.isArray(item.selections)) {
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

  if (!payload.customer) {
    return "Customer details are required.";
  }

  if (
    !payload.customer.fullName?.trim()
  ) {
    return "Customer name is required.";
  }

  if (!payload.customer.phone?.trim()) {
    return "Phone number is required.";
  }

  if (!payload.customer.email?.trim()) {
    return "Email address is required.";
  }

  if (
    !validEmail(
      payload.customer.email.trim()
    )
  ) {
    return "Enter a valid email address.";
  }

  if (!payload.brief) {
    return "Production brief is required.";
  }

  if (
    !payload.brief.projectName?.trim()
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

  if (!payload.delivery) {
    return "Delivery details are required.";
  }

  if (
    payload.delivery.method !==
      "delivery" &&
    payload.delivery.method !==
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

function calculateItemTotal(
  item: CartItem
) {
  /*
   * Temporary pricing validation.
   *
   * Once products are database-backed,
   * pricing must be reconstructed from
   * product + option IDs instead of
   * trusting price values in the cart.
   */

  return item.totalPrice;
}

export async function POST(
  request: NextRequest
) {
  try {
    const payload =
      (await request.json()) as CreateOrderPayload;

    const validationError =
      validatePayload(payload);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError,
        },
        {
          status: 400,
        }
      );
    }

    const serverSubtotal =
      payload.items.reduce(
        (total, item) =>
          total +
          calculateItemTotal(item),
        0
      );

    const now =
      new Date().toISOString();

    const requiresArtwork =
      payload.items.some(
        (item) =>
          item.artwork?.type ===
          "customer-supplied"
      );

    const order: NewJerseyOrder = {
      id: crypto.randomUUID(),

      orderNumber:
        generateOrderNumber(),

      customer: {
        fullName:
          payload.customer.fullName.trim(),

        phone:
          payload.customer.phone.trim(),

        email:
          payload.customer.email
            .trim()
            .toLowerCase(),

        organization:
          payload.customer.organization?.trim() ||
          undefined,
      },

      delivery: {
        method:
          payload.delivery.method,

        state:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.state?.trim()
            : undefined,

        city:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.city?.trim()
            : undefined,

        address:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.address?.trim()
            : undefined,

        landmark:
          payload.delivery.method ===
          "delivery"
            ? payload.delivery.landmark?.trim() ||
              undefined
            : undefined,
      },

      brief: {
        projectName:
          payload.brief.projectName.trim(),

        deadline:
          payload.brief.deadline ||
          undefined,

        instructions:
          payload.brief.instructions?.trim() ||
          undefined,
      },

      items: payload.items,

      itemCount:
        payload.items.length,

      subtotal:
        serverSubtotal,

      designFee: 0,
      deliveryFee: 0,

      finalTotal: null,

      status: requiresArtwork
        ? "awaiting-artwork"
        : "under-review",

      createdAt: now,
      updatedAt: now,
    };

    /*
     * NEXT BACKEND STAGE:
     *
     * Persist:
     * 1. orders
     * 2. order_items
     * 3. artwork records
     *
     * Until that database insert exists,
     * this endpoint creates and validates
     * the canonical order but does not
     * persist it between requests.
     */

    console.log(
      "[NewJersey] production request",
      {
        id: order.id,
        orderNumber:
          order.orderNumber,
        status: order.status,
        itemCount:
          order.itemCount,
        subtotal:
          order.subtotal,
      }
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Production request created.",

        order: {
          id: order.id,

          orderNumber:
            order.orderNumber,

          status:
            order.status,

          subtotal:
            order.subtotal,

          createdAt:
            order.createdAt,
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
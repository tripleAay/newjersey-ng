import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { createClient as createSupabaseServerClient } from "@/app/lib/newjersey/supabase/server";

import {
  APPAREL_FIELDS,
  toApparelProduct,
  type ApparelRow,
} from "@/app/lib/newjersey/apparel/catalogue";
import type { NewJerseyProduct } from "@/app/types/commerce";

import { getProductById } from "@/app/data/newjersey/products";

import type { OrderStatus, SelectedProductOption } from "@/app/types/commerce";

export const runtime = "nodejs";

const MAX_ITEMS = 100;
const MAX_JOBS_PER_ITEM = 1000;
const MAX_MONEY = Number.MAX_SAFE_INTEGER / 100;

class RequestError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(
  value: unknown,
  message: string,
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new RequestError(message);
  }

  return value;
}

function readText(
  value: unknown,
  label: string,
  maxLength: number,
  required = false,
): string | null {
  if (value === undefined || value === null) {
    if (required) {
      throw new RequestError(`${label} is required.`);
    }

    return null;
  }

  if (typeof value !== "string") {
    throw new RequestError(`${label} must be text.`);
  }

  const text = value.trim();

  if (!text) {
    if (required) {
      throw new RequestError(`${label} is required.`);
    }

    return null;
  }

  if (text.length > maxLength) {
    throw new RequestError(`${label} is too long.`);
  }

  return text;
}

function requiredText(
  value: unknown,
  label: string,
  maxLength: number,
): string {
  return readText(value, label, maxLength, true)!;
}

function isMoney(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= MAX_MONEY
  );
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function sameMoney(left: number, right: number) {
  return Math.round(left * 100) === Math.round(right * 100);
}

function parseDatabaseMoney(value: unknown): number {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && !value.trim())
  ) {
    throw new Error("Invalid database amount.");
  }

  const amount = Number(value);

  if (!isMoney(amount)) {
    throw new Error("Invalid database amount.");
  }

  return roundMoney(amount);
}

function readDeadline(value: unknown): string | null {
  const deadline = readText(value, "Preferred deadline", 10);

  if (!deadline) return null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    throw new RequestError("Enter a valid deadline.");
  }

  const parsed = new Date(`${deadline}T00:00:00.000Z`);

  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== deadline ||
    deadline < "0001-01-01"
  ) {
    throw new RequestError("Enter a valid deadline.");
  }

  return deadline;
}

function generateOrderNumber() {
  const date = new Date().toISOString().slice(2, 10).replaceAll("-", "");

  const reference = randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase();

  return `NJ-${date}-${reference}`;
}

function createCartItemId(
  productId: string,
  selections: SelectedProductOption[],
  artworkType: string,
) {
  const signature = selections
    .map(
      (selection) =>
        `${encodeURIComponent(selection.optionId)}:${encodeURIComponent(
          selection.choiceId,
        )}`,
    )
    .sort()
    .join("|");

  return `${encodeURIComponent(productId)}__${signature}__${artworkType}`;
}

function rebuildItem(
  value: unknown,
  retailProducts: Map<string, NewJerseyProduct>,
) {
  const item = requireRecord(value, "One or more order items are invalid.");

  const productId = requiredText(item.productId, "Product ID", 200);

  const retail = productId.startsWith("retail-");
  const product = retail
    ? retailProducts.get(productId)
    : getProductById(productId);

  if (!product || product.published === false) {
    throw new RequestError("An item in your order is no longer available.");
  }

  if (product.pricing.type === "quote") {
    throw new RequestError(
      `${product.name} requires a separate quote request.`,
    );
  }

  const quantity = item.quantity;

  if (
    typeof quantity !== "number" ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_JOBS_PER_ITEM
  ) {
    throw new RequestError(
      `Choose between 1 and ${MAX_JOBS_PER_ITEM} jobs for ${product.name}.`,
    );
  }

  if (!Array.isArray(item.selections)) {
    throw new RequestError(`Invalid selections for ${product.name}.`);
  }

  const productOptions = product.options ?? [];

  if (item.selections.length > productOptions.length) {
    throw new RequestError(`Too many selections for ${product.name}.`);
  }

  const requestedChoices = new Map<string, string>();

  for (const rawSelection of item.selections) {
    const selection = requireRecord(
      rawSelection,
      `Invalid selections for ${product.name}.`,
    );

    const optionId = requiredText(selection.optionId, "Option ID", 200);

    const choiceId = requiredText(selection.choiceId, "Choice ID", 200);

    if (requestedChoices.has(optionId)) {
      throw new RequestError(`Duplicate option selected for ${product.name}.`);
    }

    const option = productOptions.find(
      (candidate) => candidate.id === optionId,
    );

    if (!option || !option.choices.some((choice) => choice.id === choiceId)) {
      throw new RequestError(
        `A selected option is unavailable for ${product.name}.`,
      );
    }

    requestedChoices.set(optionId, choiceId);
  }

  const selections: SelectedProductOption[] = [];

  for (const option of productOptions) {
    const choiceId = requestedChoices.get(option.id);

    if (!choiceId) {
      if (option.required) {
        throw new RequestError(`Select ${option.label} for ${product.name}.`);
      }

      continue;
    }

    const choice = option.choices.find(
      (candidate) => candidate.id === choiceId,
    );

    if (!choice) {
      throw new RequestError(
        `A selected option is unavailable for ${product.name}.`,
      );
    }

    const modifier = choice.priceModifier ?? 0;

    if (!isMoney(modifier)) {
      throw new Error(`Invalid catalogue modifier: ${product.id}/${option.id}`);
    }

    selections.push({
      optionId: option.id,
      optionLabel: option.label,
      choiceId: choice.id,
      choiceLabel: choice.label,
      priceModifier: roundMoney(modifier),
    });
  }

  const artwork = retail
    ? { type: "not-required" }
    : requireRecord(
        item.artwork,
        `Select an artwork option for ${product.name}.`,
      );

  const artworkType = artwork.type;

  if (
    artworkType !== "customer-supplied" &&
    artworkType !== "design-needed" &&
    !(retail && artworkType === "not-required")
  ) {
    throw new RequestError(
      `Select a valid artwork option for ${product.name}.`,
    );
  }

  if (!isMoney(product.pricing.basePrice)) {
    throw new Error(`Invalid catalogue base price: ${product.id}`);
  }

  const basePrice = roundMoney(product.pricing.basePrice);

  const optionsTotal = roundMoney(
    selections.reduce((sum, selection) => sum + selection.priceModifier, 0),
  );

  const unitPrice = roundMoney(basePrice + optionsTotal);

  const totalPrice = roundMoney(unitPrice * quantity);

  if (!isMoney(optionsTotal) || !isMoney(unitPrice) || !isMoney(totalPrice)) {
    throw new RequestError("The order amount is too large.");
  }

  return {
    cart_item_id: createCartItemId(product.id, selections, artworkType),
    product_id: product.id,
    product_slug: product.slug,
    product_name: product.name,
    product_image: product.image || product.images?.[0] || null,
    quantity,
    base_price: basePrice,
    options_total: optionsTotal,
    unit_price: unitPrice,
    total_price: totalPrice,
    selections,
    review_mode: retail ? "retail" : "artwork",
    artwork_type: artworkType,
    design_fee: 0,
  };
}

export async function POST(request: NextRequest) {
  try {
    const authClient = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      throw new RequestError(
        "Please sign in before submitting your order.",
        401,
      );
    }

    let rawPayload: unknown;

    try {
      rawPayload = await request.json();
    } catch {
      throw new RequestError("Invalid JSON request.");
    }

    const payload = requireRecord(rawPayload, "Invalid order request.");

    const customer = requireRecord(
      payload.customer,
      "Customer details are required.",
    );

    const delivery = requireRecord(
      payload.delivery,
      "Delivery details are required.",
    );

    const brief = requireRecord(
      payload.brief,
      "A production brief is required.",
    );

    const fullName = requiredText(customer.fullName, "Customer name", 150);

    const phone = requiredText(customer.phone, "Phone number", 40);

    const email = requiredText(
      customer.email,
      "Email address",
      254,
    ).toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new RequestError("Enter a valid email address.");
    }

    const method = delivery.method;

    if (method !== "delivery" && method !== "pickup") {
      throw new RequestError("Select a delivery method.");
    }

    const isDelivery = method === "delivery";

    const state = isDelivery
      ? requiredText(delivery.state, "Delivery state", 100)
      : null;

    const city = isDelivery
      ? requiredText(delivery.city, "Delivery city", 100)
      : null;

    const address = isDelivery
      ? requiredText(delivery.address, "Delivery address", 500)
      : null;

    const landmark = isDelivery
      ? readText(delivery.landmark, "Landmark", 200)
      : null;

    const organization = readText(customer.organization, "Organization", 200);

    const projectName = requiredText(brief.projectName, "Project name", 200);

    const deadline = readDeadline(brief.deadline);

    const instructions = readText(
      brief.instructions,
      "Production instructions",
      5000,
    );

    if (
      !Array.isArray(payload.items) ||
      payload.items.length < 1 ||
      payload.items.length > MAX_ITEMS
    ) {
      throw new RequestError(
        `Your order must contain between 1 and ${MAX_ITEMS} configurations.`,
      );
    }

    const rawItems: unknown[] = payload.items;
    const retailProducts = new Map<string, NewJerseyProduct>();
    const retailIds = [
      ...new Set(
        rawItems.flatMap((value) =>
          isRecord(value) &&
          typeof value.productId === "string" &&
          value.productId.startsWith("retail-")
            ? [value.productId.slice(7)]
            : [],
        ),
      ),
    ];
    if (retailIds.some((id) => !/^[1-9]\d{0,18}$/.test(id)))
      throw new RequestError("Invalid apparel product.");
    if (retailIds.length) {
      const { data: rows, error } = await getSupabaseAdmin()
        .from("products")
        .select(APPAREL_FIELDS)
        .in("id", retailIds);
      if (error) throw new Error("Unable to check apparel availability.");
      for (const row of (rows ?? []) as unknown as ApparelRow[]) {
        const product = toApparelProduct(row);
        if (product) retailProducts.set(product.id, product);
      }
    }
    const items = rawItems.map((item) => rebuildItem(item, retailProducts));
    const signatures = new Set<string>();

    for (const item of items) {
      if (signatures.has(item.cart_item_id)) {
        throw new RequestError(
          "Combine identical configurations in your cart.",
        );
      }

      signatures.add(item.cart_item_id);
    }

    const supabase = getSupabaseAdmin();

    const designSlugs = [
      ...new Set(
        items
          .filter((item) => item.artwork_type === "design-needed")
          .map((item) => item.product_slug),
      ),
    ];

    const feesBySlug = new Map<string, number>();

    if (designSlugs.length > 0) {
      const { data: settings, error: settingsError } = await supabase
        .from("products")
        .select("slug, design_fee")
        .eq("publication_status", "published")
        .in("slug", designSlugs);

      if (settingsError) {
        console.error(
          "[NewJersey] design pricing lookup failed",
          settingsError,
        );

        throw new Error("Unable to verify design pricing.");
      }

      for (const setting of settings ?? []) {
        if (
          typeof setting.slug !== "string" ||
          setting.design_fee === null ||
          setting.design_fee === undefined
        ) {
          continue;
        }

        const fee = parseDatabaseMoney(setting.design_fee);

        if (fee > 9999999999) {
          throw new Error("Invalid configured design fee.");
        }

        feesBySlug.set(setting.slug, fee);
      }
    }

    for (const [index, item] of items.entries()) {
      if (item.artwork_type !== "design-needed") {
        continue;
      }

      const fee = feesBySlug.get(item.product_slug);

      if (fee === undefined) {
        throw new RequestError(
          `Design assistance is currently unavailable for ${item.product_name}. Reopen the product and update your cart.`,
          409,
        );
      }

      const rawItem = requireRecord(rawItems[index], "Invalid order item.");

      const rawArtwork = requireRecord(
        rawItem.artwork,
        "Invalid artwork selection.",
      );

      if (
        !isMoney(rawArtwork.designFee) ||
        !sameMoney(rawArtwork.designFee, fee)
      ) {
        throw new RequestError(
          `The design fee for ${item.product_name} has changed. Remove and re-add this product to review its current price.`,
          409,
        );
      }

      // One fee for this configuration, regardless of quantity.
      item.design_fee = fee;
    }

    const subtotal = roundMoney(
      items.reduce((sum, item) => sum + item.total_price, 0),
    );

    const designFee = roundMoney(
      items.reduce((sum, item) => sum + item.design_fee, 0),
    );

    const estimatedTotal = roundMoney(subtotal + designFee);

    if (!isMoney(subtotal) || !isMoney(designFee) || !isMoney(estimatedTotal)) {
      throw new RequestError("The order amount is too large.");
    }

    if (!isMoney(payload.subtotal)) {
      throw new RequestError("Invalid production estimate.");
    }

    if (!sameMoney(payload.subtotal, subtotal)) {
      throw new RequestError(
        "Production pricing has changed. Reconfigure the affected products before submitting.",
        409,
      );
    }

    const status: OrderStatus = items.some(
      (item) => item.artwork_type === "customer-supplied",
    )
      ? "awaiting-artwork"
      : "under-review";

    const { data, error } = await supabase.rpc("create_catalogue_order", {
      p_order: {
        customer_id: user.id,
        order_number: generateOrderNumber(),
        customer_full_name: fullName,
        customer_phone: phone,
        customer_email: email,
        customer_organization: organization,
        delivery_method: method,
        delivery_state: state,
        delivery_city: city,
        delivery_address: address,
        delivery_landmark: landmark,
        project_name: projectName,
        preferred_deadline: deadline,
        production_instructions: instructions,
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        design_fee: designFee,
        status,
      },
      p_items: items,
    });

    if (error) {
      console.error("[NewJersey] atomic order creation failed", error);

      throw new Error("Unable to save production request.");
    }

    // The RPC has completed. Avoid encouraging duplicate
    // submissions if its confirmation is unexpected.
    try {
      if (
        !isRecord(data) ||
        !isText(data.id) ||
        !isText(data.orderNumber) ||
        !isText(data.createdAt) ||
        data.status !== status
      ) {
        throw new Error("Invalid confirmation.");
      }

      const savedSubtotal = parseDatabaseMoney(data.subtotal);

      const savedDesignFee = parseDatabaseMoney(data.designFee);

      const savedEstimatedTotal = parseDatabaseMoney(data.estimatedTotal);

      if (
        !sameMoney(savedSubtotal, subtotal) ||
        !sameMoney(savedDesignFee, designFee) ||
        !sameMoney(savedEstimatedTotal, estimatedTotal)
      ) {
        throw new Error("Unexpected saved order totals.");
      }

      return NextResponse.json(
        {
          success: true,
          message: "Production request created.",
          order: {
            id: data.id,
            orderNumber: data.orderNumber,
            status,
            subtotal: savedSubtotal,
            designFee: savedDesignFee,
            estimatedTotal: savedEstimatedTotal,
            createdAt: data.createdAt,
          },
        },
        { status: 201 },
      );
    } catch (confirmationError) {
      console.error(
        "[NewJersey] unexpected order confirmation",
        confirmationError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to confirm the saved order. Check whether it was created before submitting again.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.status },
      );
    }

    console.error("[NewJersey] create order error", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create the production request.",
      },
      { status: 500 },
    );
  }
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
